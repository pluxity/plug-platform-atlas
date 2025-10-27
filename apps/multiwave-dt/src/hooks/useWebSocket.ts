import { useEffect, useRef, useCallback } from 'react'
import { useTrackingStore } from '../stores/useTrackingStore'

const WS_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8765'
const RECONNECT_DELAY = 5000 // 5초 후 재연결 시도
const MAX_RECONNECT_ATTEMPTS = 5

// 서버에서 받는 객체 데이터 타입
interface ServerTrackingObject {
  id: string
  type: 'person' | 'wildlife'
  name: string
  latitude: number
  longitude: number
  speed: number
  direction: number
  timestamp: string
  metadata: {
    confidence: number
    camera_id: string
    detection_count: number
  }
}

interface ServerMessage {
  type: 'connection' | 'tracking_update'
  message?: string
  timestamp?: string
  objects?: ServerTrackingObject[]
  server_time?: string
  tracking_count?: number
}

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttempts = useRef(0)
  const reconnectTimerRef = useRef<number | null>(null)
  const { updateObjectPosition, setConnectionStatus } = useTrackingStore()

  const connect = useCallback(() => {
    // 이미 연결되어 있거나 연결 중이면 종료
    if (
      wsRef.current?.readyState === WebSocket.OPEN ||
      wsRef.current?.readyState === WebSocket.CONNECTING
    ) {
      console.log('WebSocket 이미 연결 중 또는 연결됨')
      return
    }

    // 최대 재연결 시도 횟수 초과 시
    if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
      console.warn(`WebSocket 최대 재연결 시도 횟수(${MAX_RECONNECT_ATTEMPTS})를 초과했습니다.`)
      setConnectionStatus('error')
      return
    }

    try {
      console.log(`WebSocket 연결 시도 중... (${WS_URL})`)

      const ws = new WebSocket(WS_URL)

      ws.onopen = () => {
        console.log('✅ WebSocket 연결됨')
        reconnectAttempts.current = 0 // 연결 성공 시 카운터 리셋
        setConnectionStatus('connected')
      }

      ws.onmessage = (event) => {
        try {
          const data: ServerMessage = JSON.parse(event.data)

          if (data.type === 'connection') {
            console.log(`📡 환영 메시지: ${data.message}`)
          } else if (data.type === 'tracking_update' && data.objects) {
            // 서버 데이터를 클라이언트 형식으로 변환
            data.objects.forEach((serverObj) => {
              updateObjectPosition({
                id: serverObj.id,
                type: serverObj.type === 'wildlife' ? 'unknown' : serverObj.type,
                position: {
                  latitude: serverObj.latitude,
                  longitude: serverObj.longitude,
                  altitude: 0, // 서버에서 고도 정보가 없으면 0
                },
                timestamp: new Date(serverObj.timestamp).getTime(),
                cameraId: serverObj.metadata.camera_id,
                metadata: {
                  name: serverObj.name,
                  speed: serverObj.speed,
                  direction: serverObj.direction,
                  confidence: serverObj.metadata.confidence,
                  detection_count: serverObj.metadata.detection_count,
                },
              })
            })
          }
        } catch (error) {
          console.error('메시지 파싱 오류:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('❌ WebSocket 오류:', error)
        setConnectionStatus('error')
      }

      ws.onclose = (event) => {
        console.log(`🔌 WebSocket 연결 종료 (code: ${event.code}, reason: ${event.reason})`)
        setConnectionStatus('disconnected')
        wsRef.current = null

        // 비정상 종료 시 재연결 시도
        if (event.code !== 1000) {
          reconnectAttempts.current++
          if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
            console.log(`🔄 재연결 시도 (${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS})`)
            reconnectTimerRef.current = window.setTimeout(() => {
              connect()
            }, RECONNECT_DELAY)
          }
        }
      }

      wsRef.current = ws
    } catch (error) {
      console.error('WebSocket 초기화 실패:', error)
      setConnectionStatus('error')
    }
  }, [updateObjectPosition, setConnectionStatus])

  const disconnect = useCallback(() => {
    // 재연결 타이머 제거
    if (reconnectTimerRef.current !== null) {
      clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Client disconnecting')
      wsRef.current = null
      setConnectionStatus('disconnected')
    }
  }, [setConnectionStatus])

  useEffect(() => {
    // 연결 시작
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    ws: wsRef.current,
    connect,
    disconnect,
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
  }
}
