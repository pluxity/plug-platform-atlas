import { useState, useEffect } from 'react'
import { useTrackingStore } from '../../stores/useTrackingStore'
import { useSceneModeStore } from '../../stores/useSceneModeStore'
import { Activity, Wifi, WifiOff, Clock } from 'lucide-react'

export function Header() {
  const objects = useTrackingStore((state) => state.objects)
  const connectionStatus = useTrackingStore((state) => state.connectionStatus)
  const { mode, setMode } = useSceneModeStore()
  const [currentTime, setCurrentTime] = useState(new Date())

  // 1초마다 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-500" />
      case 'disconnected':
        return <WifiOff className="h-4 w-4 text-gray-400" />
      case 'error':
        return <WifiOff className="h-4 w-4 text-red-500" />
    }
  }

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':
        return '연결됨'
      case 'disconnected':
        return '연결 끊김'
      case 'error':
        return '연결 오류'
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <header className="absolute top-0 left-0 right-0 h-14 bg-slate-800 border-b border-slate-700 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* 좌측: 타이틀 */}
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-white">실시간 객체 추적 시스템</h1>
          <div className="h-5 w-px bg-slate-600" />
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Activity className="h-4 w-4" />
            <span>추적 객체: <span className="font-semibold text-white">{objects.size}</span></span>
          </div>
        </div>

        {/* 중앙: 모드 토글 */}
        <div className="flex items-center gap-1 bg-slate-700/50 rounded-lg p-1">
          <button
            onClick={() => setMode('day')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              mode === 'day'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-600'
            }`}
          >
            주간
          </button>
          <button
            onClick={() => setMode('night')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              mode === 'night'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-600'
            }`}
          >
            야간
          </button>
          <button
            onClick={() => setMode('tactical')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              mode === 'tactical'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-600'
            }`}
          >
            작전
          </button>
        </div>

        {/* 우측: 시간 + 연결 상태 */}
        <div className="flex items-center gap-4">
          {/* 현재 시간 */}
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="h-4 w-4" />
            <div className="text-sm">
              <span className="text-white font-medium">{formatTime(currentTime)}</span>
              <span className="ml-2 text-slate-400">{formatDate(currentTime)}</span>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-600" />

          {/* 연결 상태 */}
          <div className="flex items-center gap-2">
            {getConnectionIcon()}
            <span className={`text-sm font-medium ${
              connectionStatus === 'connected' ? 'text-green-400' :
              connectionStatus === 'error' ? 'text-red-400' : 'text-slate-400'
            }`}>
              {getConnectionText()}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
