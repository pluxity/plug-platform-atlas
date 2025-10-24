import { useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useTrackingStore } from '../stores/useTrackingStore'

const WS_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3000'

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null)
  const { addTrackingData, updateObjectPosition, setConnectionStatus } = useTrackingStore()

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return

    const socket = io(WS_URL, {
      transports: ['websocket'],
      autoConnect: true,
    })

    socket.on('connect', () => {
      console.log('WebSocket connected')
      setConnectionStatus('connected')
    })

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
      setConnectionStatus('disconnected')
    })

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      setConnectionStatus('error')
    })

    // 객체 추적 데이터 수신
    socket.on('tracking:update', (data) => {
      updateObjectPosition(data)
    })

    // 초기 데이터 수신
    socket.on('tracking:init', (data) => {
      addTrackingData(data)
    })

    socketRef.current = socket
  }, [addTrackingData, updateObjectPosition, setConnectionStatus])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
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
    socket: socketRef.current,
    connect,
    disconnect,
  }
}
