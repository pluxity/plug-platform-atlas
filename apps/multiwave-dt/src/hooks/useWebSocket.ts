import { useEffect, useRef, useCallback } from 'react'
import { useTrackingStore } from '../stores/useTrackingStore'
import { useTrackingLogStore } from '../stores/useTrackingLogStore'
import type { ServerMessage } from '../types/websocket.types'
import { WS_URL, RECONNECT_DELAY, MAX_RECONNECT_ATTEMPTS } from '../constants/websocket'

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttempts = useRef(0)
  const reconnectTimerRef = useRef<number | null>(null)
  const { updateObjectPosition, removeObject, setConnectionStatus } = useTrackingStore()
  const addLog = useTrackingLogStore((state) => state.addLog)

  const connect = useCallback(() => {
    if (
      wsRef.current?.readyState === WebSocket.OPEN ||
      wsRef.current?.readyState === WebSocket.CONNECTING
    ) {
      return
    }

    if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
      setConnectionStatus('error')
      return
    }

    try {
      const ws = new WebSocket(WS_URL)

      ws.onopen = () => {
        reconnectAttempts.current = 0
        setConnectionStatus('connected')
        addLog({
          type: 'connection',
          message: `WebSocket 서버에 연결됨 (${WS_URL})`,
        })
      }

      ws.onmessage = (event) => {
        try {
          const data: ServerMessage = JSON.parse(event.data)

          if (data.type === 'connection') {
            addLog({
              type: 'connection',
              message: data.message || '서버 환영 메시지 수신',
            })
          } else if (data.type === 'event' && data.object) {
            const serverObj = data.object
            const typeLabel = serverObj.type === 'person' ? '사람' : '야생동물'

            if (data.event_description === '객체 추적 종료') {
              addLog({
                type: 'tracking_update',
                message: `${typeLabel} 추적 종료: ${serverObj.name} (${serverObj.id.slice(0, 8)})`,
                data: {
                  objectId: serverObj.id,
                  name: serverObj.name,
                  objectType: serverObj.type,
                  camera: serverObj.metadata.camera_id,
                  eventDescription: data.event_description,
                  snapshot: data.snapshot_url,
                },
              })

              removeObject(serverObj.id)
              return
            }

            const eventMessage = data.event_description
              ? `${typeLabel} - ${data.event_description}: ${serverObj.name} (${serverObj.id.slice(0, 8)})`
              : `새로운 ${typeLabel} 감지: ${serverObj.name} (${serverObj.id.slice(0, 8)})`

            addLog({
              type: 'tracking_update',
              message: eventMessage,
              data: {
                objectId: serverObj.id,
                name: serverObj.name,
                objectType: serverObj.type,
                camera: serverObj.metadata.camera_id,
                eventDescription: data.event_description,
                snapshot: data.snapshot_url,
              },
            })

            updateObjectPosition({
              id: serverObj.id,
              type: serverObj.type,
              position: {
                latitude: serverObj.latitude,
                longitude: serverObj.longitude,
                altitude: 0,
              },
              timestamp: new Date(serverObj.timestamp).getTime(),
              cameraId: serverObj.metadata.camera_id,
              metadata: {
                name: serverObj.name,
                speed: serverObj.speed ?? 0,
                direction: serverObj.direction ?? 0,
                confidence: serverObj.metadata.confidence,
                detection_count: serverObj.metadata.detection_count,
              },
            })
          } else if (data.type === 'tracking_update' && data.object) {
            const serverObj = data.object

            updateObjectPosition({
              id: serverObj.id,
              type: serverObj.type,
              position: {
                latitude: serverObj.latitude,
                longitude: serverObj.longitude,
                altitude: 0,
              },
              timestamp: new Date(serverObj.timestamp).getTime(),
              cameraId: serverObj.metadata.camera_id,
              metadata: {
                name: serverObj.name,
                speed: serverObj.speed ?? 0,
                direction: serverObj.direction ?? 0,
                confidence: serverObj.metadata.confidence,
                detection_count: serverObj.metadata.detection_count,
              },
            })
          }
        } catch (error) {
          addLog({
            type: 'error',
            message: `메시지 파싱 실패: ${error}`,
            data: { error: String(error) },
          })
        }
      }

      ws.onerror = () => {
        setConnectionStatus('error')
        addLog({
          type: 'error',
          message: 'WebSocket 연결 오류 발생',
          data: { error: 'WebSocket error event' },
        })
      }

      ws.onclose = (event) => {
        setConnectionStatus('disconnected')
        wsRef.current = null

        addLog({
          type: 'info',
          message: `WebSocket 연결 종료 (code: ${event.code})`,
          data: { code: event.code, reason: event.reason },
        })

        if (event.code !== 1000) {
          reconnectAttempts.current++
          if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
            addLog({
              type: 'info',
              message: `재연결 시도 (${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS})`,
            })
            reconnectTimerRef.current = window.setTimeout(() => {
              connect()
            }, RECONNECT_DELAY)
          }
        }
      }

      wsRef.current = ws
    } catch (error) {
      setConnectionStatus('error')
      addLog({
        type: 'error',
        message: `WebSocket 초기화 실패: ${error}`,
        data: { error: String(error) },
      })
    }
  }, [updateObjectPosition, removeObject, setConnectionStatus, addLog])

  const disconnect = useCallback(() => {
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
