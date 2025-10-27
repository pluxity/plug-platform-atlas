import { CesiumMap } from '../components/CesiumMap'
import { ModeToggle } from '../components/ModeToggle'
import { useWebSocket } from '../hooks/useWebSocket'
import { useTrackingStore } from '../stores/useTrackingStore'

export function TrackingPage() {
  useWebSocket() // WebSocket 연결 시작

  const connectionStatus = useTrackingStore((state) => state.connectionStatus)
  const objects = useTrackingStore((state) => state.objects)

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <CesiumMap />

      {/* 모드 전환 버튼 (우측 상단) */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      {/* 연결 상태 표시 (좌측 상단) */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected'
                ? 'bg-green-500 animate-pulse'
                : connectionStatus === 'error'
                ? 'bg-red-500'
                : 'bg-gray-400'
            }`}
          />
          <span className="text-sm font-medium">
            {connectionStatus === 'connected'
              ? 'WebSocket 연결됨'
              : connectionStatus === 'error'
              ? 'WebSocket 오류'
              : 'WebSocket 연결 끊김'}
          </span>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          추적 중인 객체: {objects.size}개
        </div>
      </div>
    </div>
  )
}
