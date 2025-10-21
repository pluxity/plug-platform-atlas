import {
  Viewer as CesiumViewer,
  Math as CesiumMath,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  defined,
  Cartesian3,
} from 'cesium'
import { useEffect, useRef, useState, useCallback } from 'react'
import {
  useViewerStore,
  useCameraStore,
  useMarkerStore,
  DEFAULT_CAMERA_POSITION,
} from '../stores/cesium'
import { Button } from '@plug-atlas/ui'
import MapControls from './MapControls'

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
  markerImage = '/images/icons/map/marker.png',
  markerWidth = 32,
  markerHeight = 32,
}: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const handlerRef = useRef<ScreenSpaceEventHandler | null>(null)
  const [viewer, setViewer] = useState<CesiumViewer | null>(null)
  const [contextMenu, setContextMenu] = useState<{
    show: boolean
    x: number
    y: number
    lon: number
    lat: number
  } | null>(null)

  const { createViewer, setupCesiumResources } = useViewerStore()
  const { setView } = useCameraStore()
  const { addMarker, removeMarker } = useMarkerStore()

  useEffect(() => {
    if (!containerRef.current || viewer) return

    let currentViewer: CesiumViewer | null = null

    const initViewer = async () => {
      try {
        currentViewer = createViewer(containerRef.current!)
        setViewer(currentViewer)

        if (lon && lon !== 0 && lat && lat !== 0) {
          setView(currentViewer, {
            lon,
            lat,
            height: 1500,
            pitch: -45,
            heading: 0,
          })
        } else {
          setView(currentViewer, {
            ...DEFAULT_CAMERA_POSITION,
            lat: DEFAULT_CAMERA_POSITION.lat - 0.05,
          })
        }

        await setupCesiumResources(currentViewer)

        const handler = new ScreenSpaceEventHandler(currentViewer.scene.canvas)
        handlerRef.current = handler

        handler.setInputAction(() => {
          setContextMenu(null)
        }, ScreenSpaceEventType.LEFT_CLICK)

        handler.setInputAction((click: ScreenSpaceEventHandler.PositionedEvent) => {
          let cartesian: Cartesian3 | undefined = currentViewer!.scene.pickPosition(
            click.position
          )

          if (!defined(cartesian)) {
            cartesian =
              currentViewer!.camera.pickEllipsoid(
                click.position,
                currentViewer!.scene.globe.ellipsoid
              ) ?? undefined
          }

          if (cartesian && defined(cartesian)) {
            const cartographic =
              currentViewer!.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
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
      } catch (error) {
        console.error('Cesium viewer initialization failed:', error)
      }
    }

    initViewer()

    return () => {
      if (handlerRef.current) {
        handlerRef.current.destroy()
        handlerRef.current = null
      }
      if (currentViewer && !currentViewer.isDestroyed()) {
        currentViewer.destroy()
      }
      setViewer(null)
    }
  }, [createViewer, setView, setupCesiumResources, lon, lat])

  useEffect(() => {
    if (!viewer) return

    if (lon && lat && lon !== 0 && lat !== 0) {
      removeMarker(viewer, 'location-marker')
      addMarker(viewer, {
        id: 'location-marker',
        lon,
        lat,
        height: cctvHeight,
        image: markerImage,
        width: markerWidth,
        heightValue: markerHeight,
      })
    } else {
      removeMarker(viewer, 'location-marker')
    }
  }, [viewer, lon, lat, cctvHeight, markerImage, markerWidth, markerHeight, addMarker, removeMarker])

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

      <MapControls
        viewer={viewer}
        homePosition={DEFAULT_CAMERA_POSITION}
        className="absolute top-4 right-4 z-10"
      />

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
