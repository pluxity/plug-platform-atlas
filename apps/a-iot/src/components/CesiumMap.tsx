import {
  Ion,
  Viewer,
  Cartesian3,
  Math as CesiumMath,
  createWorldTerrainAsync,
} from 'cesium'
import React, { useEffect, useRef, useState } from 'react'
import SeongnamTileset from './SeongnamTileset'

// Cesium Ion Access Token
const CESIUM_ION_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5NGQ0YTBmZC1kMjVmLTQ2OGUtOTFiYy03YWYyNDJhOWZjYzMiLCJpZCI6MjgzMTA2LCJpYXQiOjE3NTMwNjEzMDF9.xhu9JUBNx01Zanmt1lz_MR8a5V0_vTaIpiN8gxhHuU0'

const CesiumMap: React.FC = () => {
  const viewerRef = useRef<HTMLDivElement>(null)
  const [viewer, setViewer] = useState<Viewer | null>(null)

  useEffect(() => {
    if (!viewerRef.current) return

    let isMounted = true

    const initViewer = async () => {
      // Set Cesium Ion token
      Ion.defaultAccessToken = CESIUM_ION_TOKEN

      // Create Viewer
      const viewerInstance = new Viewer(viewerRef.current!, {
        timeline: false,
        animation: false,
        homeButton: true,
        sceneModePicker: true,
        baseLayerPicker: true,
        navigationHelpButton: true,
        geocoder: false,
        fullscreenButton: true,
      })

      if (!isMounted) return

      // Apply World Terrain (실제 지형 고도 적용)
      try {
        const terrainProvider = await createWorldTerrainAsync()
        viewerInstance.terrainProvider = terrainProvider
      } catch {
        // 기본 지형 사용
      }

      // Set initial camera position to Seongnam
      viewerInstance.camera.setView({
        destination: Cartesian3.fromDegrees(127.1378, 37.4200, 2000),
        orientation: {
          heading: CesiumMath.toRadians(0),
          pitch: CesiumMath.toRadians(-30),
          roll: 0,
        },
      })

      setViewer(viewerInstance)
    }

    initViewer()

    // Cleanup
    return () => {
      isMounted = false
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy()
        setViewer(null)
      }
    }
  }, [])

  return (
    <>
      <div ref={viewerRef} className="w-full h-full" />
      <SeongnamTileset viewer={viewer} visible={true} alpha={1.0} />
    </>
  )
}

export default CesiumMap
