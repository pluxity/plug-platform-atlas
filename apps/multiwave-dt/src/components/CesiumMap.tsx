import { useEffect, useRef } from 'react'
import { Ion, Cartesian3 } from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { useCesiumViewer } from '../stores/cesium/useCesiumViewer'

// Cesium Ion 액세스 토큰 설정
Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_ACCESS_TOKEN || ''

export function CesiumMap() {
  const cesiumContainer = useRef<HTMLDivElement>(null)
  const { viewer, initializeViewer, destroyViewer } = useCesiumViewer()

  useEffect(() => {
    if (!cesiumContainer.current) return

    // Cesium Viewer 초기화
    initializeViewer(cesiumContainer.current, {
      terrain: undefined,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      vrButton: false,
      selectionIndicator: true,
      infoBox: true,
      shouldAnimate: true,
    })

    return () => {
      destroyViewer()
    }
  }, [])

  useEffect(() => {
    if (!viewer) return

    // 기본 카메라 위치 설정 (서울 상공)
    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(127.0276, 37.4979, 1000),
    })
  }, [viewer])

  return <div ref={cesiumContainer} className="h-full w-full" />
}
