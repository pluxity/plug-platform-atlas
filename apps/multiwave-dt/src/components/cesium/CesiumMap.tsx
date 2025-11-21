import { useEffect, useRef } from 'react'
import { Cartesian3, Color } from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { useCesiumViewer } from '../../stores/useCesiumViewer'
import { useSceneModeStore } from '../../stores/useSceneModeStore'
import { ObjectTracker } from './ObjectTracker'
import { CctvMarkers } from './CctvMarkers'

export function CesiumMap() {
  const cesiumContainer = useRef<HTMLDivElement>(null)
  const { viewer, initializeViewer, destroyViewer } = useCesiumViewer()
  const mode = useSceneModeStore((state) => state.mode)

  useEffect(() => {
    if (!cesiumContainer.current) return

    initializeViewer(cesiumContainer.current)

    return () => {
      destroyViewer()
    }
  }, [])

  useEffect(() => {
    if (!viewer) return

    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(128.573323, 38.066044, 2000),
    })
  }, [viewer])

  useEffect(() => {
    if (!viewer) return

    const scene = viewer.scene

    switch (mode) {
      case 'day':
        scene.globe.enableLighting = false
        if (scene.skyAtmosphere) {
          scene.skyAtmosphere.show = true
        }
        scene.backgroundColor = Color.BLACK

        if (viewer.imageryLayers.length > 0) viewer.imageryLayers.get(0).brightness = 1.0
        break

      case 'night':
        scene.globe.enableLighting = false
        if (scene.skyAtmosphere) {
          scene.skyAtmosphere.show = false
        }
        scene.backgroundColor = Color.fromCssColorString('#0a0a0a')

        if (viewer.imageryLayers.length > 0) viewer.imageryLayers.get(0).brightness = 0.3
        break

      case 'tactical':
        break
    }

    scene.requestRender()
  }, [viewer, mode])

  return (
    <>
      <div ref={cesiumContainer} className="h-full w-full" />
      {viewer && (
        <>
          <ObjectTracker />
          <CctvMarkers />
        </>
      )}
    </>
  )
}
