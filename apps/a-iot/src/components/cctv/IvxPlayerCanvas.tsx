import { useEffect, useRef, useId } from 'react'
import {
  loadIvxPlayer,
  type IVXMediaPlayerInstance,
  type IvxWsParams,
  type IvxEnvParams,
} from '@/lib/eds/ivx-player'
import { EDS_CONFIG } from '@/constants/eds'

interface IvxPlayerCanvasProps {
  streamUrl: string
  session: string
  streamType?: 'live' | 'record'
  onStatus?: (stat: string, msg: unknown) => void
  className?: string
}

/**
 * IVXMediaPlayer를 React에서 사용하기 위한 Canvas 래퍼.
 *
 * 주의: IVXMediaPlayer 생성자가 canvas.outerHTML을 교체하므로
 * React의 DOM 소유권과 충돌합니다.
 * → container div 안에서 imperative하게 canvas를 생성합니다.
 */
export default function IvxPlayerCanvas({
  streamUrl,
  session,
  streamType = 'live',
  onStatus,
  className,
}: IvxPlayerCanvasProps) {
  const containerId = useId().replace(/:/g, '_')
  const canvasId = `ivx_disp_${containerId}`
  const pannelId = `ivx_text_${containerId}`

  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<IVXMediaPlayerInstance | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !streamUrl || !session) return

    let cancelled = false

    // 기존 내용 정리
    container.innerHTML = ''

    // canvas 요소를 imperative하게 생성
    const dispCanvas = document.createElement('canvas')
    dispCanvas.id = canvasId
    dispCanvas.width = container.clientWidth || 960
    dispCanvas.height = container.clientHeight || 540
    dispCanvas.style.width = '100%'
    dispCanvas.style.height = '100%'
    dispCanvas.style.display = 'block'

    const textCanvas = document.createElement('canvas')
    textCanvas.id = pannelId
    textCanvas.width = dispCanvas.width
    textCanvas.height = dispCanvas.height
    textCanvas.style.position = 'absolute'
    textCanvas.style.left = '0'
    textCanvas.style.top = '0'
    textCanvas.style.width = '100%'
    textCanvas.style.height = '100%'
    textCanvas.style.zIndex = '10'
    textCanvas.style.pointerEvents = 'none'

    container.appendChild(dispCanvas)
    container.appendChild(textCanvas)

    async function initPlayer() {
      try {
        const { IVXMediaPlayer } = await loadIvxPlayer()
        if (cancelled) return

        const wsParams: IvxWsParams = {
          stream_mode: 'relay',
          stream_type: streamType,
          session,
          url: streamUrl,
          auth_key: EDS_CONFIG.playerAuthKey,
          access_key: EDS_CONFIG.playerAccessKey,
        }

        // IVXMediaPlayer 생성자가 outerHTML을 교체한 후
        // document.getElementById로 새 캔버스를 가져옴
        const envParams: IvxEnvParams = {
          canvas: dispCanvas,
          pannel: textCanvas,
          status: (stat, msg) => {
            onStatus?.(stat, msg)
          },
          lang: 'KR',
          async_mode: true,
          meta_mode: 'none',
          eventzone: false,
        }

        const player = new IVXMediaPlayer(wsParams, envParams)
        playerRef.current = player
        player.Play()

        // 리사이즈 감지
        resizeObserverRef.current = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const { width, height } = entry.contentRect
            if (width > 0 && height > 0 && playerRef.current) {
              playerRef.current.SetResizeWindow(
                Math.round(width),
                Math.round(height),
              )
            }
          }
        })
        if (container) resizeObserverRef.current.observe(container)
      } catch (e) {
        console.error('[IvxPlayerCanvas] 플레이어 초기화 실패:', e)
        onStatus?.('error', e instanceof Error ? e.message : String(e))
      }
    }

    initPlayer()

    return () => {
      cancelled = true
      resizeObserverRef.current?.disconnect()
      resizeObserverRef.current = null

      if (playerRef.current) {
        try {
          playerRef.current.Stop()
        } catch {
          // 이미 정리된 경우 무시
        }
        playerRef.current = null
      }

      // container 내용 정리
      if (container) container.innerHTML = ''
    }
  }, [streamUrl, session, streamType]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    />
  )
}
