import { useEffect, useState } from 'react'
import { SceneTransforms } from 'cesium'
import * as Cesium from 'cesium'
import { X, User, PawPrint, Car } from 'lucide-react'
import { useCesiumViewer } from '../../stores/useCesiumViewer'
import { useObjectModalStore } from '../../stores/useObjectModalStore'
import { useTrackingStore } from '../../stores/useTrackingStore'

const typeConfig = {
  person: {
    label: '사람',
    icon: User,
    color: 'bg-[#00B4D8]',
    iconBg: 'bg-white/20',
  },
  wildlife: {
    label: '동물',
    icon: PawPrint,
    color: 'bg-[#00B4D8]',
    iconBg: 'bg-white/20',
  },
  vehicle: {
    label: '자동차',
    icon: Car,
    color: 'bg-[#FF0000]',
    iconBg: 'bg-white/20',
  },
  car: {
    label: '자동차',
    icon: Car,
    color: 'bg-[#FF0000]',
    iconBg: 'bg-white/20',
  }
} as const

export function TrackingObjectModal() {
  const viewer = useCesiumViewer((state: any) => state.viewer)
  const objects = useTrackingStore((state) => state.objects)
  const { isOpen, selectedObject, snapshotImage, closeModal } = useObjectModalStore()
  const [screenPosition, setScreenPosition] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!viewer || !isOpen || !selectedObject) {
      setScreenPosition(null)
      return
    }

    let animationFrameId: number
    let lastUpdateTime = 0
    const UPDATE_INTERVAL = 1000 / 30 // 30 FPS

    const updatePosition = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(updatePosition)

      if (currentTime - lastUpdateTime < UPDATE_INTERVAL) {
        return
      }
      lastUpdateTime = currentTime

      // 실시간으로 업데이트된 객체 정보 가져오기
      const currentObject = useTrackingStore.getState().objects.get(selectedObject.id)
      if (!currentObject) {
        setScreenPosition(null)
        return
      }

      try {
        const cartographic = Cesium.Cartographic.fromDegrees(
          currentObject.position.longitude,
          currentObject.position.latitude,
          currentObject.position.altitude ?? 0
        )

        const height = viewer.scene.globe.getHeight(cartographic)
        if (height !== undefined) {
          cartographic.height = height + (currentObject.position.altitude ?? 0)
        }

        const position = viewer.scene.globe.ellipsoid.cartographicToCartesian(cartographic)
        const screenPos = SceneTransforms.worldToWindowCoordinates(viewer.scene, position)

        if (screenPos) {
          setScreenPosition({ x: screenPos.x, y: screenPos.y })
        } else {
          setScreenPosition(null)
        }
      } catch (error) {
        setScreenPosition(null)
      }
    }

    animationFrameId = requestAnimationFrame(updatePosition)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [viewer, isOpen, selectedObject])

  if (!isOpen || !selectedObject || !screenPosition) return null

  // 실시간으로 업데이트된 객체 가져오기
  const currentObject = objects.get(selectedObject.id) || selectedObject

  // 타입 정규화 (소문자 변환, 공백 제거)
  const normalizedType = (currentObject.type || 'person').toLowerCase().trim()
  const objectType = normalizedType as keyof typeof typeConfig
  const config = typeConfig[objectType] || typeConfig.person
  const Icon = config.icon

  // 필드 데이터 생성 - 타입에 따라 다르게
  const fields: Array<{ label: string; value: string }> = []

  // 기본 정보 필드
  const basicFields: Array<{ label: string; value: string }> = []
  // 특성 정보 필드 (사람만)
  const attributeFields: Array<{ label: string; value: string }> = []

  if (objectType === 'person') {
    // 기본 정보
    basicFields.push({ label: '종류', value: '사람' })
    basicFields.push({ label: '위도', value: (currentObject.position?.latitude ?? (currentObject as any).latitude ?? 0).toFixed(6) })
    basicFields.push({ label: '경도', value: (currentObject.position?.longitude ?? (currentObject as any).longitude ?? 0).toFixed(6) })

    if (currentObject.metadata?.zone) {
      basicFields.push({ label: '구역', value: currentObject.metadata.zone })
    }

    // 사람 특성 정보
    if ((currentObject as any).person_attributes?.gender) {
      attributeFields.push({ label: '성별', value: (currentObject as any).person_attributes.gender })
    }

    if ((currentObject as any).person_attributes?.estimated_age) {
      attributeFields.push({ label: '나이추정', value: `${(currentObject as any).person_attributes.estimated_age}세` })
    }

    if ((currentObject as any).person_attributes?.upper_clothing) {
      const upper = (currentObject as any).person_attributes.upper_clothing
      attributeFields.push({ label: '상의', value: `${upper.color} ${upper.style}` })
    }

    if ((currentObject as any).person_attributes?.lower_clothing) {
      const lower = (currentObject as any).person_attributes.lower_clothing
      attributeFields.push({ label: '하의', value: `${lower.color} ${lower.style}` })
    }

    if ((currentObject as any).person_attributes?.accessories) {
      const acc = (currentObject as any).person_attributes.accessories
      const accessories = []
      if (acc.bag && acc.bag !== '없음') accessories.push(acc.bag)
      if (acc.hat && acc.hat !== '없음') accessories.push(acc.hat)
      if (accessories.length > 0) {
        attributeFields.push({ label: '악세서리', value: accessories.join(', ') })
      }
    }

    // 기본 정보와 특성 정보 합치기
    fields.push(...basicFields)
    if (attributeFields.length > 0) {
      fields.push(...attributeFields)
    }
  } else if (objectType === 'wildlife') {
    // 동물의 경우 - modal2.png 참고 (간단함)
    fields.push({ label: '종류', value: currentObject.metadata?.species || '너구리' })
    fields.push({ label: '위도', value: currentObject.position.latitude.toFixed(6) })
    fields.push({ label: '경도', value: currentObject.position.longitude.toFixed(6) })

    if (currentObject.metadata?.zone) {
      fields.push({ label: '구역', value: currentObject.metadata.zone })
    }
  } else if (objectType === 'vehicle' || objectType === 'car') {
    // 차량의 경우 - modal3.png 참고
    fields.push({ label: '종류', value: '차량' })
    fields.push({ label: '위도', value: currentObject.position.latitude.toFixed(6) })
    fields.push({ label: '경도', value: currentObject.position.longitude.toFixed(6) })

    if (currentObject.metadata?.zone) {
      fields.push({ label: '구역', value: currentObject.metadata.zone })
    }
  }

  return (
    <div className="fixed inset-0 z-20 pointer-events-none">
      <div
        className="absolute pointer-events-auto"
        style={{
          left: `${screenPosition.x}px`,
          top: `${screenPosition.y}px`,
          transform: 'translate(-50%, calc(-100% - 20px))',
        }}
      >
        {/* 모달 컨테이너 */}
        <div className={`relative ${config.color} rounded-2xl shadow-2xl w-[280px] overflow-hidden`}>
          {/* 헤더 */}
          <div className="relative px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`${config.iconBg} rounded-full p-1.5`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white text-base font-bold">{config.label}</span>
                <span className="text-white/70 text-sm font-medium">
                  ID {selectedObject.id.slice(0, 8)}
                </span>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>

          {/* 바디 */}
          <div className="bg-white rounded-t-2xl px-4 py-3">
            {/* 경고 배너 (차량 침범 등) */}
            {currentObject.metadata?.alert && (
              <div className="mb-3 bg-[#FF0000] text-white text-center py-1.5 px-3 rounded-lg font-bold text-xs">
                {currentObject.metadata.alert}
              </div>
            )}

            {/* 이미지 - 스냅샷 우선, 없으면 metadata의 imageUrl */}
            {(snapshotImage || currentObject.metadata?.imageUrl) && (
              <div className="mb-3 rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={snapshotImage || currentObject.metadata?.imageUrl}
                  alt={`${config.label} 이미지`}
                  className="w-full h-32 object-cover"
                />
              </div>
            )}

            {/* 정보 필드들 */}
            <div className="space-y-0">
              {/* 기본 정보 */}
              {basicFields.map((field, index) => (
                <div
                  key={`basic-${index}`}
                  className="flex items-center justify-between py-2 border-b border-dashed border-gray-300"
                >
                  <span className="text-gray-600 text-xs font-medium">{field.label}</span>
                  <span className="text-gray-900 text-xs font-semibold">{field.value}</span>
                </div>
              ))}

              {/* 간격 - 사람 특성 정보가 있을 때만 */}
              {objectType === 'person' && attributeFields.length > 0 && (
                <div className="py-2"></div>
              )}

              {/* 사람 특성 정보 */}
              {objectType === 'person' && attributeFields.map((field, index) => (
                <div
                  key={`attr-${index}`}
                  className="flex items-center justify-between py-2 border-b border-dashed border-gray-300 last:border-b-0"
                >
                  <span className="text-gray-600 text-xs font-medium">{field.label}</span>
                  <span className="text-gray-900 text-xs font-semibold">{field.value}</span>
                </div>
              ))}

              {/* 야생동물이나 차량의 경우 필드 표시 */}
              {objectType !== 'person' && fields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-dashed border-gray-300 last:border-b-0"
                >
                  <span className="text-gray-600 text-xs font-medium">{field.label}</span>
                  <span className="text-gray-900 text-xs font-semibold">{field.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 화살표 */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
            <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[20px] border-t-white" />
          </div>
        </div>
      </div>
    </div>
  )
}
