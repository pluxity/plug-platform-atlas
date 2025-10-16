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

// Cesium Ion 토큰 설정
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
  // TODO: POLYGON 영역 데이터 (나중에 구현)
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

  // Viewer 초기화
  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return

    let handler: ScreenSpaceEventHandler | null = null

    const initializeViewer = async () => {
      try {
        console.log('Cesium Viewer 초기화 시작...')

        // Cesium Viewer 생성
        console.log('Cesium Viewer 생성 중...')
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

        console.log('Cesium Viewer 생성 완료')
        viewerRef.current = viewer

        // GoogleMap Imagery Provider 설정 (asset ID: 3830182)
        console.log('GoogleMap Imagery 로드 중...')
        const imageryProvider = await IonImageryProvider.fromAssetId(3830182)
        viewer.imageryLayers.removeAll()
        viewer.imageryLayers.addImageryProvider(imageryProvider)
        console.log('GoogleMap Imagery 로드 완료')

        // Terrain Provider 로드 (asset ID: 3825983)
        try {
          console.log('Terrain 로드 중...')
          const terrainResource = await IonResource.fromAssetId(3825983)
          const terrainProvider = await CesiumTerrainProvider.fromUrl(terrainResource)
          viewer.terrainProvider = terrainProvider
          console.log('Terrain 로드 완료')
        } catch (error) {
          console.error('Terrain 로드 실패:', error)
        }

        // 성남시 중심으로 카메라 이동
        viewer.camera.flyTo({
          destination: Cartesian3.fromDegrees(127.1388, 37.4201, 5000),
          orientation: {
            heading: CesiumMath.toRadians(0),
            pitch: CesiumMath.toRadians(-45),
            roll: 0,
          },
          duration: 2,
        })

        // 클릭 이벤트 핸들러
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

    // 클린업
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

  // 공원 마커 추가/업데이트
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    // 기존 엔티티 제거
    entitiesRef.current.forEach((entity) => {
      viewer.entities.remove(entity)
    })
    entitiesRef.current.clear()

    // 공원 마커 추가
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
          heightReference: 1, // CLAMP_TO_GROUND
          verticalOrigin: 1, // BOTTOM
          scale: selectedPark?.id === park.id ? 1.3 : 1.0,
        },
      })

      entitiesRef.current.set(park.id, entity)

      // TODO: POLYGON 영역 표시 (나중에 구현)
      /*
      if (park.polygon) {
        const polygonEntity = viewer.entities.add({
          id: `park-polygon-${park.id}`,
          polygon: {
            hierarchy: Cartesian3.fromDegreesArray(
              park.polygon.positions.flatMap(p => [p.longitude, p.latitude])
            ),
            material: Color.fromAlpha(getStatusColor(park.status), 0.3),
            outline: true,
            outlineColor: getStatusColor(park.status),
            outlineWidth: 2,
            height: 0,
          },
        })
      }
      */
    })
  }, [parks, selectedPark])

  // 선택된 공원으로 카메라 이동
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

// 마커 이미지 생성 (Canvas)
function createMarkerCanvas(status: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 40
  canvas.height = 40
  const ctx = canvas.getContext('2d')

  if (ctx) {
    // 원 그리기
    ctx.beginPath()
    ctx.arc(20, 20, 18, 0, Math.PI * 2)
    ctx.fillStyle =
      status === 'normal' ? '#22c55e' : status === 'warning' ? '#eab308' : '#ef4444'
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    ctx.stroke()

    // 트리 아이콘 (간단한 삼각형)
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.moveTo(20, 10)
    ctx.lineTo(14, 22)
    ctx.lineTo(26, 22)
    ctx.closePath()
    ctx.fill()

    // 트렁크
    ctx.fillRect(18, 22, 4, 6)
  }

  return canvas
}
