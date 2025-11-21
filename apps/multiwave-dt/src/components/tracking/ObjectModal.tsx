import { X, User, PawPrint, Car } from 'lucide-react'

export type ObjectType = 'person' | 'wildlife' | 'vehicle'

export interface ObjectModalField {
  label: string
  value: string | number
}

export interface ObjectModalProps {
  isOpen: boolean
  onClose: () => void
  type: ObjectType
  objectId: string
  imageUrl?: string
  fields: ObjectModalField[]
  alertBanner?: string
}

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
}

export function ObjectModal({
  isOpen,
  onClose,
  type,
  objectId,
  imageUrl,
  fields,
  alertBanner,
}: ObjectModalProps) {
  if (!isOpen) return null

  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto">
        {/* 모달 컨테이너 */}
        <div className={`relative ${config.color} rounded-2xl shadow-2xl w-[380px] overflow-hidden`}>
          {/* 헤더 */}
          <div className="relative px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`${config.iconBg} rounded-full p-2`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white text-xl font-bold">{config.label}</span>
                <span className="text-white/70 text-lg font-medium">ID {objectId}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* 바디 */}
          <div className="bg-white rounded-t-2xl px-5 py-4">
            {/* 경고 배너 (차량 타입 등) */}
            {alertBanner && (
              <div className="mb-4 bg-[#FF0000] text-white text-center py-2 px-4 rounded-lg font-bold text-sm">
                {alertBanner}
              </div>
            )}

            {/* 이미지 */}
            {imageUrl && (
              <div className="mb-4 rounded-xl overflow-hidden border-2 border-gray-200">
                <img
                  src={imageUrl}
                  alt={`${config.label} 이미지`}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* 정보 필드들 */}
            <div className="space-y-0">
              {fields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2.5 border-b border-dashed border-gray-300 last:border-b-0"
                >
                  <span className="text-gray-600 text-sm font-medium">{field.label}</span>
                  <span className="text-gray-900 text-sm font-semibold">{field.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 화살표 */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
            <div
              className={`w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[20px] ${
                type === 'vehicle' ? 'border-t-white' : 'border-t-white'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
