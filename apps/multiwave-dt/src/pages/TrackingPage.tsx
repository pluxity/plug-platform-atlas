import { useEffect } from 'react'
import { CesiumMap } from '../components/cesium/CesiumMap'
import { Header } from '../components/layout/Header'
import { ObjectList } from '../components/tracking/ObjectList'
import { EventLog } from '../components/tracking/EventLog'
import { ObjectInfoPanel } from '../components/tracking/ObjectInfoPanel'
import VideoSearchDialog from '../components/tracking/VideoSearchDialog'
import { useWebSocket } from '../hooks/useWebSocket'
import { useObjectTimeout } from '../hooks/useObjectTimeout'
import { initDB, scheduleAutoCleanup, getStorageStats } from '../services/indexeddb.service'
import { useVideoSearchStore } from '../stores/useVideoSearchStore'
import { Film } from 'lucide-react'

export function TrackingPage() {
  useWebSocket()
  useObjectTimeout()
  const openVideoSearch = useVideoSearchStore((state) => state.openDialog)

  useEffect(() => {
    initDB()
      .then(() => {
        scheduleAutoCleanup()
        getStorageStats()
      })
      .catch((error) => {
        console.error('Failed to initialize DB:', error)
      })
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
          onClick={() => openVideoSearch()}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-lg transition-colors"
        >
          <Film className="h-4 w-4" />
          <span>영상기록 검색</span>
        </button>
      </div>

      <VideoSearchDialog />
    </div>
  )
}
