import { useEffect, useRef } from 'react'
import { Cartesian3, Color, DirectionalLight, Cartesian3 as CesiumCartesian3 } from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { useCesiumViewer } from '../stores/cesium/useCesiumViewer'
import { useSceneModeStore } from '../stores/useSceneModeStore'
import { ObjectTracker } from './ObjectTracker'
import { PathRenderer } from './PathRenderer'

export function CesiumMap() {
  const cesiumContainer = useRef<HTMLDivElement>(null)
  const { viewer, initializeViewer, destroyViewer } = useCesiumViewer()
  const mode = useSceneModeStore((state) => state.mode)

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

  // 모드 전환 로직
  useEffect(() => {
    if (!viewer) return

    const scene = viewer.scene
    const globe = scene.globe

    switch (mode) {
      case 'day':
        // 주간 모드: 기본 설정
        globe.enableLighting = false
        scene.skyAtmosphere.show = true
        scene.backgroundColor = Color.BLACK
        scene.globe.baseColor = Color.WHITE
        break

      case 'night':
        // 야간 모드: 저조도 환경 시뮬레이션
        globe.enableLighting = true
        scene.skyAtmosphere.show = true

        // 어두운 조명 설정
        const directionalLight = new DirectionalLight({
          direction: new CesiumCartesian3(0.2, 0.5, -0.8),
          color: Color.WHITE.withAlpha(0.3),
        })
        scene.light = directionalLight

        // 어두운 배경
        scene.backgroundColor = Color.BLACK
        scene.globe.baseColor = Color.fromCssColorString('#1a1a2e')
        break

      case 'tactical':
        // 작전 모드: 전술 지도 스타일
        globe.enableLighting = false
        scene.skyAtmosphere.show = false
        scene.backgroundColor = Color.fromCssColorString('#1e293b')
        scene.globe.baseColor = Color.fromCssColorString('#334155')
        break
    }

    // 렌더링 갱신
    scene.requestRender()
  }, [viewer, mode])

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
