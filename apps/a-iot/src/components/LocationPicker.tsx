import {
  Cartesian3,
  Viewer as CesiumViewer,
  Math as CesiumMath,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  defined,
  HeightReference,
  Entity,
  NearFarScalar,
} from 'cesium'
import { useEffect, useRef, useState, useCallback } from 'react'
import { DEFAULT_VIEWER_OPTIONS, setupCesiumResources } from '../lib/cesiumSetup'
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
  const cesiumContainerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<CesiumViewer | null>(null)
  const markerEntityRef = useRef<Entity | null>(null)
  const handlerRef = useRef<ScreenSpaceEventHandler | null>(null)

  const [contextMenu, setContextMenu] = useState<{
    show: boolean
    x: number
    y: number
    lon: number
    lat: number
  } | null>(null)

  const [viewer, setViewer] = useState<CesiumViewer | null>(null)

  useEffect(() => {
    if (!cesiumContainerRef.current || viewerRef.current) return

    const initializeViewer = async () => {
      try {
        const newViewer = new CesiumViewer(cesiumContainerRef.current!, DEFAULT_VIEWER_OPTIONS)
        viewerRef.current = newViewer
        setViewer(newViewer)

        newViewer.scene.canvas.addEventListener('contextmenu', (e) => {
          e.preventDefault()
          return false
        })

        if (lon && lon !== 0 && lat && lat !== 0) {
          newViewer.camera.setView({
            destination: Cartesian3.fromDegrees(lon, lat, 1500),
            orientation: {
              heading: CesiumMath.toRadians(0),
              pitch: CesiumMath.toRadians(-45),
              roll: 0,
            },
          })
        } else {
          const pangyo = { lon: 127.1114, lat: 37.3948 }
          const cameraLon = pangyo.lon
          const cameraLat = pangyo.lat - 0.05
          const cameraHeight = 3000

          newViewer.camera.setView({
            destination: Cartesian3.fromDegrees(cameraLon, cameraLat, cameraHeight),
            orientation: {
              heading: CesiumMath.toRadians(0),
              pitch: CesiumMath.toRadians(-35),
              roll: 0,
            },
          })
        }

        const handler = new ScreenSpaceEventHandler(newViewer.scene.canvas)
        handlerRef.current = handler

        handler.setInputAction(() => {
          setContextMenu(null)
        }, ScreenSpaceEventType.LEFT_CLICK)

        handler.setInputAction((click: ScreenSpaceEventHandler.PositionedEvent) => {
          let cartesian: Cartesian3 | undefined = newViewer.scene.pickPosition(click.position)

          if (!defined(cartesian)) {
            cartesian = newViewer.camera.pickEllipsoid(
              click.position,
              newViewer.scene.globe.ellipsoid
            ) ?? undefined
          }

          if (cartesian && defined(cartesian)) {
            const cartographic = newViewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
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

        setupCesiumResources(newViewer)
      } catch (error) {
      }
    }

    initializeViewer()

    return () => {
      if (handlerRef.current) {
        handlerRef.current.destroy()
      }
      if (viewerRef.current) {
        viewerRef.current.destroy()
        viewerRef.current = null
      }
      setViewer(null)
    }
  }, [])

  const updateMarker = useCallback((viewer: CesiumViewer, longitude: number, latitude: number, height: number) => {
    const position = Cartesian3.fromDegrees(longitude, latitude, height)

    if (markerEntityRef.current) {
      markerEntityRef.current.position = position as any
    } else {
      const entity = viewer.entities.add({
        id: 'location-marker',
        position: position,
        billboard: {
          image: markerImage,
          width: markerWidth,
          height: markerHeight,
          heightReference: HeightReference.RELATIVE_TO_GROUND,
          scaleByDistance: new NearFarScalar(100, 1.5, 5000, 0.3),
        },
      })
      markerEntityRef.current = entity
    }
  }, [markerImage, markerWidth, markerHeight])

  useEffect(() => {
    if (!viewer) return

    if (lon && lat && lon !== 0 && lat !== 0) {
      updateMarker(viewer, lon, lat, cctvHeight)
    } else if (markerEntityRef.current) {
      viewer.entities.remove(markerEntityRef.current)
      markerEntityRef.current = null
    }
  }, [viewer, lon, lat, cctvHeight, updateMarker])

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
      <div ref={cesiumContainerRef} style={{ width: '100%', height: '100%' }} />

      <MapControls
        viewer={viewer}
        homePosition={{ lon: 127.1114, lat: 37.3948, height: 3000 }}
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
          <button
            onClick={handleSetMarker}
            className="w-full px-4 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap"
          >
            여기에 위치 지정
          </button>
        </div>
      )}
    </div>
  )
}
