import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@plug-atlas/ui'
import { MapPin } from 'lucide-react'
import { Viewer as CesiumViewer, Cesium3DTileset } from 'cesium'
import { useViewerStore, useTilesetStore, ION_ASSETS, LOCAL_TILESETS, TILESET_HEIGHT_OFFSETS } from '../../stores/cesium'

export default function MapDashboard() {
  const cesiumContainerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<CesiumViewer | null>(null)
  const ionTileset4004889Ref = useRef<Cesium3DTileset | null>(null)
  const ionTileset4005051Ref = useRef<Cesium3DTileset | null>(null)
  const seongnamTilesetRef = useRef<Cesium3DTileset | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { createViewer } = useViewerStore()
  const { loadIonTileset, loadSeongnamTileset, applyHeightOffset } = useTilesetStore()

  useEffect(() => {
    if (!cesiumContainerRef.current) return

    let mounted = true

    const initViewer = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Create Cesium Viewer
        const viewer = createViewer(cesiumContainerRef.current!, {
          animation: false,
          baseLayerPicker: false,
          fullscreenButton: true,
          geocoder: false,
          homeButton: true,
          infoBox: true,
          sceneModePicker: false,
          selectionIndicator: true,
          timeline: false,
          navigationHelpButton: true,
        })

        if (!mounted) {
          viewer.destroy()
          return
        }

        viewerRef.current = viewer

        // Setup imagery and terrain
        await useViewerStore.getState().setupImagery(viewer)
        await useViewerStore.getState().setupTerrain(viewer, ION_ASSETS.TERRAIN)

        // Load Ion Asset 4004889
        const ionTileset4004889 = await loadIonTileset(viewer, ION_ASSETS.TILESETS.ASSET_4004889)

        if (ionTileset4004889 && !viewer.isDestroyed()) {
          ionTileset4004889Ref.current = ionTileset4004889
          applyHeightOffset(ionTileset4004889, TILESET_HEIGHT_OFFSETS.ASSET_4004889)
        }

        // Load Ion Asset 4005051
        const ionTileset4005051 = await loadIonTileset(viewer, ION_ASSETS.TILESETS.ASSET_4005051)

        if (ionTileset4005051 && !viewer.isDestroyed()) {
          ionTileset4005051Ref.current = ionTileset4005051
          applyHeightOffset(ionTileset4005051, TILESET_HEIGHT_OFFSETS.ASSET_4005051)
        }

        // Load Seongnam tileset from localhost (Brotli compressed version)
        const seongnamTileset = await loadSeongnamTileset(viewer, LOCAL_TILESETS.SEONGNAM)

        if (seongnamTileset && !viewer.isDestroyed()) {
          seongnamTilesetRef.current = seongnamTileset
          applyHeightOffset(seongnamTileset, TILESET_HEIGHT_OFFSETS.SEONGNAM)
        }

        // Fly to the first Ion tileset if loaded
        if (ionTileset4004889 && !viewer.isDestroyed()) {
          await viewer.zoomTo(ionTileset4004889)
        }

        if (mounted) {
          setIsLoading(false)
        }
      } catch (err) {
        console.error('Cesium 초기화 오류:', err)
        if (mounted) {
          setError('지도를 로드하는 중 오류가 발생했습니다.')
          setIsLoading(false)
        }
      }
    }

    initViewer()

    return () => {
      mounted = false
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy()
        viewerRef.current = null
      }
    }
  }, [createViewer, loadIonTileset, loadSeongnamTileset, applyHeightOffset])

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
          {/* Map Container */}
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
