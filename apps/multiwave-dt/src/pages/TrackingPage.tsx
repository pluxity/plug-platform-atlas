import { useEffect } from 'react'
import { CesiumMap } from '../components/cesium/CesiumMap'
import { Header } from '../components/layout/Header'
import { OverviewPanel } from '../components/tracking/OverviewPanel'
import { EventLog } from '../components/tracking/EventLog'
import { EventSnapshotPanel } from '../components/tracking/EventSnapshotPanel'
import { VideoSearchButton } from '../components/tracking/VideoSearchButton'
import { ObjectInfoPanel } from '../components/tracking/ObjectInfoPanel'
import { TrackingObjectModal } from '../components/tracking/TrackingObjectModal'
import { useWebSocket } from '../hooks/useWebSocket'
import { useObjectTimeout } from '../hooks/useObjectTimeout'
import { initDB, scheduleAutoCleanup, getStorageStats } from '../services/indexeddb.service'

export function TrackingPage() {
  useWebSocket()
  useObjectTimeout()

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
    <div className="relative h-screen w-screen overflow-hidden">
      {/* 3D 지도 - 전체 화면 */}
      <div className="fixed inset-0 w-screen h-screen">
        <CesiumMap />
      </div>

      {/* 헤더 */}
      <Header />

      {/* 지도 위 정보 패널 */}
      <div className="absolute inset-0 pointer-events-none">
        <ObjectInfoPanel />
      </div>

      {/* 좌측 사이드바 - 패널들 */}
      <div className="absolute left-4 top-[4.5rem] bottom-4 w-96 z-30 flex flex-col gap-3">
        {/* 1. 종합상황 패널 */}
        <div className="h-44">
          <OverviewPanel />
        </div>

        {/* 2. 이벤트 로그 패널 */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <EventLog />
        </div>

        {/* 3. 이벤트 스냅샷 패널 */}
        <div className="h-72">
          <EventSnapshotPanel />
        </div>

        {/* 4. 영상기록 검색 버튼 */}
        <div>
          <VideoSearchButton />
        </div>
      </div>

      {/* 트래킹 객체 모달 */}
      <TrackingObjectModal />
    </div>
  )
}
