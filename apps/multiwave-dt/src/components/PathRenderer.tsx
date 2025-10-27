import { useEffect } from 'react'
import {
  Cartesian3,
  Color,
  Entity,
  PolylineGraphics,
  ArcType,
} from 'cesium'
import { useCesiumViewer } from '../stores/cesium/useCesiumViewer'
import { useTrackingStore } from '../stores/useTrackingStore'
import type { TrackingPath } from '../stores/useTrackingStore'

// 객체 타입별 경로 색상 (약간 투명하게)
const PATH_COLORS = {
  person: Color.BLUE.withAlpha(0.7),
  vehicle: Color.RED.withAlpha(0.7),
  unknown: Color.YELLOW.withAlpha(0.7),
} as const

export function PathRenderer() {
  const viewer = useCesiumViewer((state) => state.viewer)
  const paths = useTrackingStore((state) => state.paths)
  const objects = useTrackingStore((state) => state.objects)

  useEffect(() => {
    if (!viewer) return

    const entities = viewer.entities
    const pathEntityMap = new Map<string, Entity>()

    // 기존 경로 Entity 가져오기
    paths.forEach((path, objectId) => {
      const pathEntityId = `path-${objectId}`
      const existingEntity = entities.getById(pathEntityId)
      if (existingEntity) {
        pathEntityMap.set(objectId, existingEntity)
      }
    })

    // 경로 업데이트/추가
    paths.forEach((path, objectId) => {
      const obj = objects.get(objectId)
      if (!obj) return

      updateOrCreatePathEntity(viewer, path, obj.type, pathEntityMap)
    })

    // 더 이상 추적되지 않는 경로 제거
    const currentPathIds = new Set(paths.keys())
    pathEntityMap.forEach((entity, objectId) => {
      if (!currentPathIds.has(objectId)) {
        entities.remove(entity)
        pathEntityMap.delete(objectId)
      }
    })

    // Cleanup: 컴포넌트 언마운트 시 모든 경로 Entity 제거
    return () => {
      pathEntityMap.forEach((entity) => {
        entities.remove(entity)
      })
    }
  }, [viewer, paths, objects])

  return null // 이 컴포넌트는 렌더링 없이 Cesium Entity만 관리
}

// 경로 Entity 생성 또는 업데이트
function updateOrCreatePathEntity(
  viewer: NonNullable<ReturnType<typeof useCesiumViewer>['viewer']>,
  path: TrackingPath,
  objectType: 'person' | 'vehicle' | 'unknown',
  entityMap: Map<string, Entity>
) {
  if (path.positions.length < 2) {
    // 경로가 너무 짧으면 렌더링하지 않음
    return
  }

  const pathEntityId = `path-${path.objectId}`
  const color = PATH_COLORS[objectType] || PATH_COLORS.unknown

  // 경로 좌표를 Cartesian3 배열로 변환
  const positions = path.positions.map((pos) =>
    Cartesian3.fromDegrees(pos.longitude, pos.latitude, pos.altitude ?? 0)
  )

  let entity = entityMap.get(path.objectId)

  if (entity && entity.polyline) {
    // 기존 Entity 업데이트
    entity.polyline.positions = positions as any
  } else {
    // 새 Entity 생성
    entity = viewer.entities.add({
      id: pathEntityId,
      polyline: {
        positions: positions as any,
        width: 3,
        material: color,
        clampToGround: true,
        arcType: ArcType.GEODESIC,
      } as PolylineGraphics.ConstructorOptions as any,
    })
    entityMap.set(path.objectId, entity)
  }
}
