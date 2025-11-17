import {
  Math as CesiumMath,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  defined,
  Cartesian3,
  Viewer as CesiumViewer,
} from 'cesium'
import { useEffect, useRef, useState, useCallback } from 'react'
import {
  useViewerStore,
  useCameraStore,
  useMarkerStore,
  DEFAULT_CAMERA_POSITION,
} from '../../stores/cesium'
import { Button, Spinner } from '@plug-atlas/ui'

interface LocationPickerProps {
  lon: number
  lat: number
  onLocationChange: (lon: number, lat: number) => void
  cctvHeight?: number
  containerHeight?: number
  markerImage?: string
  markerWidth?: number
  markerHeight?: number
}

export default function LocationPicker({
  lon,
  lat,
  onLocationChange,
  cctvHeight = 3,
  containerHeight,
  markerImage = '/aiot/images/icons/map/marker.png',
  markerWidth = 32,
  markerHeight = 32,
}: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<CesiumViewer | null>(null)
  const handlerRef = useRef<ScreenSpaceEventHandler | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [contextMenu, setContextMenu] = useState<{
    show: boolean
    x: number
    y: number
    lon: number
    lat: number
  } | null>(null)

  const { createViewer, initializeResources } = useViewerStore()
  const { setView, focusOn } = useCameraStore()
  const { addMarker, removeMarker } = useMarkerStore()

  useEffect(() => {
    if (!containerRef.current) return
    if (viewerRef.current && !viewerRef.current.isDestroyed()) return

    let mounted = true

    const initViewer = async () => {
      try {
        setIsLoading(true)

        const viewer = createViewer(containerRef.current!)

        if (!mounted) {
          viewer.destroy()
          return
        }

        viewerRef.current = viewer

        await initializeResources(viewer, {
          imageryProvider: 'ion-default',
          loadTerrain: false,
          load3DTiles: false,
        })

        if (!mounted) return

        setIsLoading(false)
      } catch (error) {
        if (mounted) {
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
  }, [])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return

    if (lon && lon !== 0 && lat && lat !== 0) {
      focusOn(viewer, { lon, lat }, 1500)
    } else {
      setView(viewer, {
        ...DEFAULT_CAMERA_POSITION,
        lat: DEFAULT_CAMERA_POSITION.lat - 0.05,
      })
    }
  }, [viewerRef.current, lon, lat, setView, focusOn])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
    handlerRef.current = handler

    handler.setInputAction(() => {
      setContextMenu(null)
    }, ScreenSpaceEventType.LEFT_CLICK)

    handler.setInputAction((click: ScreenSpaceEventHandler.PositionedEvent) => {
      let cartesian: Cartesian3 | undefined = viewer.scene.pickPosition(click.position)

      if (!defined(cartesian)) {
        cartesian =
          viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid) ??
          undefined
      }

      if (cartesian && defined(cartesian)) {
        const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
        const longitude = CesiumMath.toDegrees(cartographic.longitude)
        const latitude = CesiumMath.toDegrees(cartographic.latitude)

        setContextMenu({
          show: true,
          x: click.position.x,
          y: click.position.y,
          lon: longitude,
          lat: latitude,
        })
      }
    }, ScreenSpaceEventType.RIGHT_CLICK)

    return () => {
      if (handlerRef.current) {
        handlerRef.current.destroy()
        handlerRef.current = null
      }
    }
  }, [viewerRef.current])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return

    removeMarker(viewer, 'location-marker')

    if (lon && lat && lon !== 0 && lat !== 0) {
      addMarker(viewer, {
        id: 'location-marker',
        lon,
        lat,
        height: cctvHeight,
        image: markerImage,
        width: markerWidth,
        heightValue: markerHeight,
      })
    }
  }, [viewerRef.current, lon, lat, cctvHeight, markerImage, markerWidth, markerHeight, addMarker, removeMarker])

  const handleSetMarker = useCallback(() => {
    if (!contextMenu) return

    onLocationChange(contextMenu.lon, contextMenu.lat)
    setContextMenu(null)
  }, [contextMenu, onLocationChange])

  return (
    <div
      style={{ width: '100%', height: containerHeight ? `${containerHeight}px` : '100%' }}
      className="overflow-hidden relative"
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-20 gap-3">
          <Spinner size="xl" className="text-white" />
          <div className="text-white text-sm font-medium">지도 로딩 중...</div>
        </div>
      )}

      {contextMenu?.show && (
        <div
          style={{
            position: 'absolute',
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
            zIndex: 1000,
          }}
          className="bg-background border border-border rounded-md shadow-lg overflow-hidden"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSetMarker}
            className="w-full justify-start rounded-none h-auto px-4 py-2 font-normal"
          >
            여기에 위치 지정
          </Button>
        </div>
      )}
    </div>
  )
}
