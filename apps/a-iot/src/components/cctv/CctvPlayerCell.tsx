import { useState, useCallback } from 'react'
import { X, AlertCircle, Loader2 } from 'lucide-react'
import IvxPlayerCanvas from './IvxPlayerCanvas'
import { useEdsStream } from '@/services/hooks/useEdsStream'
import type { EdsCamera } from '@/lib/eds/eds-types'

type CellStatus = 'idle' | 'connecting' | 'playing' | 'error'

interface CctvPlayerCellProps {
  camera: EdsCamera | null
  onRemove: () => void
}

export default function CctvPlayerCell({
  camera,
  onRemove,
}: CctvPlayerCellProps) {
  const { getStreamUrl } = useEdsStream()
  const [streamUrl, setStreamUrl] = useState<string | null>(null)
  const [session, setSession] = useState<string | null>(null)
  const [status, setStatus] = useState<CellStatus>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // 카메라가 할당되면 스트림 URL 요청
  const startStream = useCallback(
    async (cam: EdsCamera) => {
      setStatus('connecting')
      setErrorMsg(null)
      try {
        const result = await getStreamUrl(cam.camera_id)
        setStreamUrl(result.stream_url)
        setSession(result.session ?? null)
        setStatus('playing')
      } catch (e) {
        setErrorMsg(e instanceof Error ? e.message : '스트림 연결 실패')
        setStatus('error')
      }
    },
    [getStreamUrl],
  )

  // camera가 변경될 때 자동 연결
  const prevCameraRef = useState<string | null>(null)
  if (camera && camera.camera_id !== prevCameraRef[0]) {
    prevCameraRef[1](camera.camera_id)
    startStream(camera)
  } else if (!camera && prevCameraRef[0]) {
    prevCameraRef[1](null)
    setStreamUrl(null)
    setSession(null)
    setStatus('idle')
  }

  const handlePlayerStatus = useCallback((stat: string, msg: unknown) => {
    if (stat === 'error' || stat === 'fatal') {
      setStatus('error')
      setErrorMsg(typeof msg === 'string' ? msg : '재생 오류')
    } else if (stat === 'info' && msg === 'play') {
      setStatus('playing')
    }
  }, [])

  // 빈 셀
  if (!camera) {
    return (
      <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
        <span className="text-sm text-gray-400">
          카메라를 선택하세요
        </span>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-black">
      {/* 카메라명 오버레이 */}
      <div className="absolute left-0 top-0 z-20 flex items-center gap-2 rounded-br-lg bg-black/60 px-3 py-1.5">
        <span className="text-xs font-medium text-white">
          {camera.camera_name}
        </span>
      </div>

      {/* 닫기 버튼 */}
      <button
        onClick={onRemove}
        className="absolute right-2 top-2 z-20 rounded-full bg-black/50 p-1 text-white/80 transition-colors hover:bg-black/70 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>

      {/* 컨텐츠 영역 */}
      {status === 'connecting' && (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <span className="ml-2 text-sm text-gray-300">연결 중...</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <span className="text-sm text-red-300">{errorMsg}</span>
          <button
            onClick={() => startStream(camera)}
            className="mt-1 rounded bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20"
          >
            재시도
          </button>
        </div>
      )}

      {status === 'playing' && streamUrl && session && (
        <IvxPlayerCanvas
          streamUrl={streamUrl}
          session={session}
          onStatus={handlePlayerStatus}
          className="h-full w-full"
        />
      )}
    </div>
  )
}
