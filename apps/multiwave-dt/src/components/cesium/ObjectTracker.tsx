import { useEffect, useRef } from 'react'
import { Cartesian3, Color, Entity, HeightReference, ConstantProperty, ArcType, PolylineGraphics, Viewer } from 'cesium'
import { useCesiumViewer } from '../../stores/useCesiumViewer'
import { useTrackingStore } from '../../stores/useTrackingStore'
import { useSceneModeStore } from '../../stores/useSceneModeStore'
import type { TrackingObject, TrackingPath } from '../../types/tracking.types'

// 객체 타입별 색상 정의 (OverviewPanel과 동일한 색상)
const OBJECT_COLORS = {
  person: Color.fromCssColorString('#E8A500'), // 노란색
  vehicle: Color.fromCssColorString('#C83C3C'), // 빨간색
  car: Color.fromCssColorString('#C83C3C'), // 빨간색
  wildlife: Color.fromCssColorString('#4A90B8'), // 파란색
} as const

// 야간 모드 색상 (녹색 강조)
const NIGHT_COLOR = Color.LIME

// 경로 색상 (반투명)
const PATH_COLORS = {
  person: Color.fromCssColorString('#E8A500').withAlpha(0.7),
  vehicle: Color.fromCssColorString('#C83C3C').withAlpha(0.7),
  car: Color.fromCssColorString('#C83C3C').withAlpha(0.7),
  wildlife: Color.fromCssColorString('#4A90B8').withAlpha(0.7),
} as const

// 경로 최대 포인트 수
const MAX_PATH_POINTS = 100

export function ObjectTracker() {
  const viewer = useCesiumViewer((state: any) => state.viewer)
  const objects = useTrackingStore((state: any) => state.objects)
  const paths = useTrackingStore((state: any) => state.paths)
  const lastUpdatedObjectId = useTrackingStore((state: any) => state.lastUpdatedObjectId)
  const mode = useSceneModeStore((state: any) => state.mode)
  const entityMapRef = useRef<Map<string, Entity>>(new Map())

  // 특정 객체만 업데이트 (WS로 데이터 받을 때마다)
  useEffect(() => {
    if (!viewer || !lastUpdatedObjectId) return

    const obj = objects.get(lastUpdatedObjectId)
    if (!obj) return

    const path = paths.get(lastUpdatedObjectId)
    const entityMap = entityMapRef.current
    updateOrCreateEntity(viewer, obj, path, entityMap, mode)

    // 화면 갱신 요청
    viewer.scene.requestRender()
  }, [viewer, lastUpdatedObjectId, mode])

  // 객체 제거 감지 (주기적으로 체크)
  useEffect(() => {
    if (!viewer) return

    const intervalId = setInterval(() => {
      const currentObjectIds = new Set(useTrackingStore.getState().objects.keys())
      const entities = viewer.entities
      const entityMap = entityMapRef.current
      const entitiesToRemove: Entity[] = []

      entityMap.forEach((entity, id) => {
        if (!currentObjectIds.has(id)) {
          entitiesToRemove.push(entity)
          entityMap.delete(id)
        }
      })

      if (entitiesToRemove.length > 0) {
        entitiesToRemove.forEach((entity) => {
          entities.remove(entity)
        })
        viewer.scene.requestRender()
      }
    }, 5000) // 5초마다 체크

    return () => clearInterval(intervalId)
  }, [viewer])

  // Cleanup: 컴포넌트 언마운트 시에만 모든 Entity 제거
  useEffect(() => {
    return () => {
      if (viewer) {
        entityMapRef.current.forEach((entity) => {
          viewer.entities.remove(entity)
        })
        entityMapRef.current.clear()
      }
    }
  }, [viewer])

  return null // 이 컴포넌트는 렌더링 없이 Cesium Entity만 관리
}

// Entity 생성 또는 업데이트 (point + label + polyline 통합)
function updateOrCreateEntity(
  viewer: Viewer,
  obj: TrackingObject,
  path: TrackingPath | undefined,
  entityMap: Map<string, Entity>,
  mode: 'day' | 'night' | 'tactical'
) {
  const position = Cartesian3.fromDegrees(
    obj.position.longitude,
    obj.position.latitude,
    obj.position.altitude ?? 0
  )

  // 야간 모드 시 녹색으로 강조, 그 외에는 타입별 색상
  const color = mode === 'night' ? NIGHT_COLOR : (OBJECT_COLORS[obj.type as keyof typeof OBJECT_COLORS] || OBJECT_COLORS.person)
  const pathColor = mode === 'night' ? NIGHT_COLOR.withAlpha(0.7) : (PATH_COLORS[obj.type as keyof typeof PATH_COLORS] || PATH_COLORS.person)

  // 경로 좌표 계산
  let pathPositions: Cartesian3[] | undefined
  if (path && path.positions.length >= 2) {
    let positions = path.positions

    // 최대 포인트 수 제한
    if (positions.length > MAX_PATH_POINTS) {
      positions = positions.slice(-MAX_PATH_POINTS)
    }

    pathPositions = positions.map((pos: any) =>
      Cartesian3.fromDegrees(pos.longitude, pos.latitude, pos.altitude ?? 0)
    )
  }

  let entity = entityMap.get(obj.id)

  if (entity) {
    // 기존 Entity 업데이트
    entity.position = position as any

    // point 색상 업데이트
    if (entity.point) {
      entity.point.color = new ConstantProperty(color)
    }

    // label 색상 업데이트
    if (entity.label) {
      entity.label.fillColor = new ConstantProperty(color)
    }

    // polyline 업데이트
    if (pathPositions && pathPositions.length >= 2) {
      if (entity.polyline) {
        entity.polyline.positions = pathPositions as any
        entity.polyline.material = pathColor as any
      } else {
        // polyline이 없으면 추가
        entity.polyline = {
          positions: pathPositions as any,
          width: 3,
          material: pathColor,
          clampToGround: true,
          arcType: ArcType.GEODESIC,
        } as PolylineGraphics.ConstructorOptions as any
      }
    } else if (entity.polyline) {
      // 경로가 부족하면 polyline 제거
      entity.polyline = undefined as any
    }
  } else {
    // 새 Entity 생성 (point + label + polyline)
    const entityOptions: any = {
      id: obj.id,
      position: position as any,
      point: {
        pixelSize: 12,
        color,
        outlineColor: Color.WHITE,
        outlineWidth: 2,
        heightReference: HeightReference.RELATIVE_TO_GROUND,
      },
      label: {
        text: obj.id.slice(0, 8),
        font: '14px sans-serif',
        fillColor: color, // 타입별 색상 적용
        outlineColor: Color.BLACK,
        outlineWidth: 2,
        style: 0, // FILL
        verticalOrigin: 1, // BOTTOM
        pixelOffset: { x: 0, y: -15 } as any,
        heightReference: HeightReference.RELATIVE_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    }

    // 경로가 있으면 polyline 추가
    if (pathPositions && pathPositions.length >= 2) {
      entityOptions.polyline = {
        positions: pathPositions as any,
        width: 3,
        material: pathColor,
        clampToGround: true,
        arcType: ArcType.GEODESIC,
      } as PolylineGraphics.ConstructorOptions as any
    }

    entity = viewer.entities.add(entityOptions)
    entityMap.set(obj.id, entity)
  }
}
