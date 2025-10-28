import { useEffect, useState } from 'react'
import { CesiumMap } from '../components/cesium/CesiumMap'
import { Header } from '../components/layout/Header'
import { ObjectList } from '../components/tracking/ObjectList'
import { EventLog } from '../components/tracking/EventLog'
import { ObjectInfoPanel } from '../components/tracking/ObjectInfoPanel'
import { useWebSocket } from '../hooks/useWebSocket'
import { useObjectTimeout } from '../hooks/useObjectTimeout'
import { initDB, scheduleAutoCleanup, getStorageStats } from '../services/indexeddb.service'
import { Film, X } from 'lucide-react'

export function TrackingPage() {
  useWebSocket()
  useObjectTimeout()
  const [showVideoSearch, setShowVideoSearch] = useState(false)

  useEffect(() => {
    initDB()
      .then(() => {
        scheduleAutoCleanup()
        getStorageStats()
      })
      .catch(() => {})
  }, [])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-900">
      <Header />

      <div className="absolute top-14 left-0 right-0 bottom-0">
        <CesiumMap />
      </div>

      <div className="absolute top-14 inset-x-0 bottom-0 pointer-events-none">
        <ObjectInfoPanel />
      </div>

      <div className="absolute left-4 top-[4.5rem] bottom-4 w-80 z-30">
        <ObjectList />
      </div>

      <div className="absolute right-4 top-[4.5rem] bottom-20 w-96 z-30">
        <EventLog />
      </div>

      <div className="absolute right-4 bottom-4 z-40">
        <button
          onClick={() => setShowVideoSearch(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-lg transition-colors"
        >
          <Film className="h-4 w-4" />
          <span>영상기록 검색</span>
        </button>
      </div>

      {showVideoSearch && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm">영상기록 검색</h3>
              <button
                onClick={() => setShowVideoSearch(false)}
                className="p-1 hover:bg-slate-700 rounded transition-colors"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 text-center text-slate-400">
              <Film className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-sm">영상기록 검색 기능은 추후 구현 예정입니다.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
