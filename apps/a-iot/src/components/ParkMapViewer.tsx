import {
  Cartesian3,
  Viewer as CesiumViewer,
  Ion,
  CesiumTerrainProvider,
  IonResource,
  IonImageryProvider,
  Math as CesiumMath,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  defined,
} from 'cesium'
import { useEffect, useRef } from 'react'

Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5NGQ0YTBmZC1kMjVmLTQ2OGUtOTFiYy03YWYyNDJhOWZjYzMiLCJpZCI6MjgzMTA2LCJpYXQiOjE3NTMwNjEzMDF9.xhu9JUBNx01Zanmt1lz_MR8a5V0_vTaIpiN8gxhHuU0'

interface Park {
  id: number
  name: string
  location: string
  cctv: number
  sensors: number
  status: 'normal' | 'warning' | 'error'
  coordinates: {
    longitude: number
    latitude: number
    height?: number
  }
  polygon?: {
    positions: Array<{ longitude: number; latitude: number }>
  }
}

interface ParkMapViewerProps {
  parks: Park[]
  selectedPark: Park | null
  onSelectPark: (park: Park | null) => void
}

export default function ParkMapViewer({ parks, selectedPark, onSelectPark }: ParkMapViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<CesiumViewer | null>(null)
  const entitiesRef = useRef<Map<number, any>>(new Map())

  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return

    let handler: ScreenSpaceEventHandler | null = null

    const initializeViewer = async () => {
      try {
        const viewer = new CesiumViewer(containerRef.current!, {
          timeline: false,
          animation: false,
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          navigationHelpButton: false,
          sceneModePicker: false,
          selectionIndicator: false,
          infoBox: false,
        })
        viewerRef.current = viewer

        const imageryProvider = await IonImageryProvider.fromAssetId(3830182)
        viewer.imageryLayers.removeAll()
        viewer.imageryLayers.addImageryProvider(imageryProvider)

        try {
          console.log('Terrain 로드 중...')
          const terrainResource = await IonResource.fromAssetId(3825983)
          const terrainProvider = await CesiumTerrainProvider.fromUrl(terrainResource)
          viewer.terrainProvider = terrainProvider
          console.log('Terrain 로드 완료')
        } catch (error) {
          console.error('Terrain 로드 실패:', error)
        }

        viewer.camera.flyTo({
          destination: Cartesian3.fromDegrees(127.1388, 37.4201, 5000),
          orientation: {
            heading: CesiumMath.toRadians(0),
            pitch: CesiumMath.toRadians(-45),
            roll: 0,
          },
          duration: 2,
        })

        handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
        handler.setInputAction((click: any) => {
          const pickedObject = viewer.scene.pick(click.position)
          if (defined(pickedObject) && defined(pickedObject.id)) {
            const entity = pickedObject.id
            const parkId = entity.properties?.parkId?.getValue()
            if (parkId) {
              const park = parks.find((p) => p.id === parkId)
              if (park) {
                onSelectPark(park)
              }
            }
          }
        }, ScreenSpaceEventType.LEFT_CLICK)

        console.log('Cesium Viewer 초기화 완료!')
      } catch (error) {
        console.error('Cesium Viewer 초기화 실패:', error)
      }
    }

    initializeViewer()

    return () => {
      if (handler) {
        handler.destroy()
      }
      if (viewerRef.current) {
        viewerRef.current.destroy()
        viewerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    entitiesRef.current.forEach((entity) => {
      viewer.entities.remove(entity)
    })
    entitiesRef.current.clear()

    parks.forEach((park) => {
      const { longitude, latitude, height = 100 } = park.coordinates
      const position = Cartesian3.fromDegrees(longitude, latitude, height)

      const entity = viewer.entities.add({
        id: `park-${park.id}`,
        position: position,
        properties: {
          parkId: park.id,
        },
        billboard: {
          image: createMarkerCanvas(park.status),
          width: 40,
          height: 40,
          heightReference: 1,
          verticalOrigin: 1,
          scale: selectedPark?.id === park.id ? 1.3 : 1.0,
        },
      })

      entitiesRef.current.set(park.id, entity)
    })
  }, [parks, selectedPark])

  useEffect(() => {
    if (selectedPark && viewerRef.current) {
      const { longitude, latitude } = selectedPark.coordinates
      viewerRef.current.camera.flyTo({
        destination: Cartesian3.fromDegrees(longitude, latitude, 1000),
        duration: 1.5,
      })
    }
  }, [selectedPark])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}

function createMarkerCanvas(status: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 40
  canvas.height = 40
  const ctx = canvas.getContext('2d')

  if (ctx) {
    ctx.beginPath()
    ctx.arc(20, 20, 18, 0, Math.PI * 2)
    ctx.fillStyle =
      status === 'normal' ? '#22c55e' : status === 'warning' ? '#eab308' : '#ef4444'
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    ctx.stroke()

    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.moveTo(20, 10)
    ctx.lineTo(14, 22)
    ctx.lineTo(26, 22)
    ctx.closePath()
    ctx.fill()

    ctx.fillRect(18, 22, 4, 6)
  }

  return canvas
}
