import { useRef, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@plug-atlas/ui'
import { MapPin } from 'lucide-react'
import { Viewer as CesiumViewer, Cartesian3, Math as CesiumMath } from 'cesium'
import { useViewerStore, useTilesetStore, ION_ASSETS, DEFAULT_CAMERA_POSITION, TILESET_HEIGHT_OFFSETS, TILESET_AUTO_HIDE_THRESHOLD } from '../../stores/cesium'

export default function MapDashboard() {
  const cesiumContainerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { createViewer } = useViewerStore()
  const { loadIonTileset, loadAllIonTilesets, loadSeongnamTileset, setupTilesetsAutoHide, setupSeongnamAutoHide, applyHeightOffset } = useTilesetStore()

  useEffect(() => {
    if (!cesiumContainerRef.current) return

    let viewerInstance: CesiumViewer | null = null
    const cleanupFunctions: Array<() => void> = []

    const initializeViewer = async () => {
      try {
        setIsLoading(true)

        viewerInstance = createViewer(cesiumContainerRef.current!)

        viewerInstance.scene.globe.depthTestAgainstTerrain = true
        viewerInstance.scene.fog.enabled = true
        viewerInstance.scene.fog.density = 0.0002
        viewerInstance.scene.fog.screenSpaceErrorFactor = 2.0

        const destination = Cartesian3.fromDegrees(
          DEFAULT_CAMERA_POSITION.lon,
          DEFAULT_CAMERA_POSITION.lat,
          DEFAULT_CAMERA_POSITION.height
        )
        const orientation = {
          heading: CesiumMath.toRadians(DEFAULT_CAMERA_POSITION.heading || 0),
          pitch: CesiumMath.toRadians(DEFAULT_CAMERA_POSITION.pitch || -45),
          roll: CesiumMath.toRadians(DEFAULT_CAMERA_POSITION.roll || 0),
        }
        viewerInstance.camera.setView({ destination, orientation })

        await loadIonTileset(viewerInstance, ION_ASSETS.GOOGLE_PHOTOREALISTIC_3D_TILES, {
          maximumScreenSpaceError: 64,
          skipLevelOfDetail: true,
        })

        const tilesets = await loadAllIonTilesets(viewerInstance)
        const tilesetsCleanup = setupTilesetsAutoHide(viewerInstance, tilesets, TILESET_AUTO_HIDE_THRESHOLD)
        cleanupFunctions.push(tilesetsCleanup)

        const seongnamTileset = await loadSeongnamTileset(viewerInstance)
        if (seongnamTileset) {
          applyHeightOffset(seongnamTileset, TILESET_HEIGHT_OFFSETS.SEONGNAM)
          const seongnamCleanup = setupSeongnamAutoHide(viewerInstance, seongnamTileset, TILESET_AUTO_HIDE_THRESHOLD)
          cleanupFunctions.push(seongnamCleanup)
        }

        setIsLoading(false)
      } catch (err) {
        console.error('Failed to initialize viewer:', err)
        setError('지도를 로드하는 중 오류가 발생했습니다.')
        setIsLoading(false)
      }
    }

    initializeViewer()

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
      if (viewerInstance && !viewerInstance.isDestroyed()) {
        viewerInstance.destroy()
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">대시보드 - 지도형</h1>
        <p className="text-gray-600">공원별 장치 현황 및 위치 정보</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-5" />
            공원 위치 지도
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
            <div
              ref={cesiumContainerRef}
              className="w-full h-full"
            />
            {isLoading && (
              <div className="absolute inset-0 bg-gray-100/80 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <span className="text-sm text-gray-600">지도 로딩 중...</span>
                </div>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <p className="text-red-500">{error}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
