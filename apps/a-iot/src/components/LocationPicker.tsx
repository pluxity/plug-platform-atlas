import {
  Cartesian3,
  Viewer as CesiumViewer,
  Math as CesiumMath,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  defined,
  CameraEventType,
  HeightReference,
  Entity,
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
}

export default function LocationPicker({
  lon,
  lat,
  onLocationChange,
  cctvHeight = 3,
  containerHeight,
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

        const controller = newViewer.scene.screenSpaceCameraController
        controller.rotateEventTypes = [CameraEventType.LEFT_DRAG]
        controller.tiltEventTypes = [CameraEventType.MIDDLE_DRAG, CameraEventType.PINCH]
        controller.lookEventTypes = [CameraEventType.LEFT_DRAG]

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

        let isDragging = false
        let dragEntity: Entity | null = null

        handler.setInputAction((movement: ScreenSpaceEventHandler.PositionedEvent) => {
          const pickedObject = newViewer.scene.pick(movement.position)
          if (defined(pickedObject) && pickedObject.id === markerEntityRef.current) {
            isDragging = true
            dragEntity = pickedObject.id as Entity
            newViewer.scene.screenSpaceCameraController.enableRotate = false
          }
        }, ScreenSpaceEventType.LEFT_DOWN)

        handler.setInputAction((movement: ScreenSpaceEventHandler.MotionEvent) => {
          if (isDragging && dragEntity) {
            let cartesian: Cartesian3 | undefined = newViewer.scene.pickPosition(movement.endPosition)

            if (!defined(cartesian)) {
              cartesian = newViewer.camera.pickEllipsoid(
                movement.endPosition,
                newViewer.scene.globe.ellipsoid
              ) ?? undefined
            }

            if (cartesian && defined(cartesian)) {
              const cartographic = newViewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
              const longitude = CesiumMath.toDegrees(cartographic.longitude)
              const latitude = CesiumMath.toDegrees(cartographic.latitude)

              dragEntity.position = Cartesian3.fromDegrees(longitude, latitude, 10) as any
              onLocationChange(longitude, latitude)
            }
          }
        }, ScreenSpaceEventType.MOUSE_MOVE)

        handler.setInputAction(() => {
          isDragging = false
          dragEntity = null
          newViewer.scene.screenSpaceCameraController.enableRotate = true
        }, ScreenSpaceEventType.LEFT_UP)

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
          image: createCctvMarkerCanvas(),
          width: 50,
          height: 50,
          heightReference: HeightReference.RELATIVE_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      })
      markerEntityRef.current = entity
    }
  }, [])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    if (lon && lat && lon !== 0 && lat !== 0) {
      updateMarker(viewer, lon, lat, cctvHeight)
    } else if (markerEntityRef.current) {
      viewer.entities.remove(markerEntityRef.current)
      markerEntityRef.current = null
    }
  }, [lon, lat, cctvHeight, updateMarker])

  const handleSetMarker = useCallback(() => {
    if (!contextMenu || !viewerRef.current) return

    updateMarker(viewerRef.current, contextMenu.lon, contextMenu.lat, cctvHeight)
    onLocationChange(contextMenu.lon, contextMenu.lat)
    setContextMenu(null)
  }, [contextMenu, cctvHeight, updateMarker, onLocationChange])

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
            여기에 CCTV 위치 지정
          </button>
        </div>
      )}
    </div>
  )
}

function createCctvMarkerCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 40
  canvas.height = 40
  const ctx = canvas.getContext('2d')

  if (ctx) {
    ctx.beginPath()
    ctx.arc(20, 20, 18, 0, Math.PI * 2)
    ctx.fillStyle = '#3b82f6'
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    ctx.stroke()

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(12, 14, 16, 10)
    ctx.fillRect(8, 16, 4, 6)

    ctx.beginPath()
    ctx.arc(20, 19, 3, 0, Math.PI * 2)
    ctx.fillStyle = '#3b82f6'
    ctx.fill()
  }

  return canvas
}
