import { useEffect } from 'react'
import { Cartesian3, Color, Entity, HeightReference } from 'cesium'
import { useCesiumViewer } from '../stores/cesium/useCesiumViewer'
import { useTrackingStore } from '../stores/useTrackingStore'
import type { TrackingObject } from '../stores/useTrackingStore'

// 객체 타입별 색상 정의
const OBJECT_COLORS = {
  person: Color.BLUE,
  vehicle: Color.RED,
  unknown: Color.YELLOW,
} as const

// 객체 타입별 라벨 텍스트
const OBJECT_LABELS = {
  person: '👤',
  vehicle: '🚗',
  unknown: '❓',
} as const

export function ObjectTracker() {
  const viewer = useCesiumViewer((state) => state.viewer)
  const objects = useTrackingStore((state) => state.objects)

  useEffect(() => {
    if (!viewer) return

    const entities = viewer.entities
    const entityMap = new Map<string, Entity>()

    // 기존 객체 Entity 가져오기
    objects.forEach((obj) => {
      const existingEntity = entities.getById(obj.id)
      if (existingEntity) {
        entityMap.set(obj.id, existingEntity)
      }
    })

    // 객체 업데이트/추가
    objects.forEach((obj) => {
      updateOrCreateEntity(viewer, obj, entityMap)
    })

    // 더 이상 추적되지 않는 객체 제거
    const currentObjectIds = new Set(objects.keys())
    entities.values.forEach((entity) => {
      if (entity.id && !currentObjectIds.has(entity.id.toString())) {
        entities.remove(entity)
      }
    })

    // Cleanup: 컴포넌트 언마운트 시 모든 추적 객체 Entity 제거
    return () => {
      entityMap.forEach((entity) => {
        entities.remove(entity)
      })
    }
  }, [viewer, objects])

  return null // 이 컴포넌트는 렌더링 없이 Cesium Entity만 관리
}

// Entity 생성 또는 업데이트
function updateOrCreateEntity(
  viewer: NonNullable<ReturnType<typeof useCesiumViewer>['viewer']>,
  obj: TrackingObject,
  entityMap: Map<string, Entity>
) {
  const position = Cartesian3.fromDegrees(
    obj.position.longitude,
    obj.position.latitude,
    obj.position.altitude ?? 0
  )

  const color = OBJECT_COLORS[obj.type] || OBJECT_COLORS.unknown
  const label = OBJECT_LABELS[obj.type] || OBJECT_LABELS.unknown

  let entity = entityMap.get(obj.id)

  if (entity) {
    // 기존 Entity 업데이트
    entity.position = position as any
  } else {
    // 새 Entity 생성
    entity = viewer.entities.add({
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
        text: `${label} ${obj.id.slice(0, 8)}`,
        font: '14px sans-serif',
        fillColor: Color.WHITE,
        outlineColor: Color.BLACK,
        outlineWidth: 2,
        style: 0, // FILL
        verticalOrigin: 1, // BOTTOM
        pixelOffset: { x: 0, y: -15 } as any,
        heightReference: HeightReference.RELATIVE_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    })
    entityMap.set(obj.id, entity)
  }
}
