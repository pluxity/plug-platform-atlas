import { useEffect, useRef } from 'react'
import { Cartesian3 } from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { useCesiumViewer } from '../stores/cesium/useCesiumViewer'
import { ObjectTracker } from './ObjectTracker'
import { PathRenderer } from './PathRenderer'

export function CesiumMap() {
  const cesiumContainer = useRef<HTMLDivElement>(null)
  const { viewer, initializeViewer, destroyViewer } = useCesiumViewer()

  useEffect(() => {
    if (!cesiumContainer.current) return

    // Cesium Viewer 비동기 초기화
    initializeViewer(cesiumContainer.current)

    return () => {
      destroyViewer()
    }
  }, [])

  useEffect(() => {
    if (!viewer) return

    // 기본 카메라 위치 설정 (알펜시아 리조트 스키장 - 강원도 평창)
    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(128.6703, 37.6560, 2000),
    })
  }, [viewer])

  return (
    <>
      <div ref={cesiumContainer} className="h-full w-full" />
      {/* 객체 및 경로 렌더링 */}
      {viewer && (
        <>
          <ObjectTracker />
          <PathRenderer />
        </>
      )}
    </>
  )
}
