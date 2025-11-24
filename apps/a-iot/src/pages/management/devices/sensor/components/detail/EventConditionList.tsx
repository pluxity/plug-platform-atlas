// Internal imports
import { DeviceProfile, EventCondition } from '@/services/types'
import EventConditionCard from '@/pages/management/devices/sensor/components/detail/EventConditionCard'

interface EventConditionListProps {
  conditions: EventCondition[]
  profiles: DeviceProfile[]
  errorIndices: Set<number>
  onFieldChange: (index: number, field: keyof EventCondition, value: any) => void
  onRemove: (index: number) => void
  onDelete: (conditionId: number) => Promise<void>
}

export default function EventConditionList({
  conditions,
  profiles,
  errorIndices,
  onFieldChange,
  onRemove,
  onDelete,
}: EventConditionListProps) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-medium text-sm text-gray-700">
        <div className="flex-1 min-w-[7.5rem] text-center">Field Key</div>
        <div className="w-[6.25rem] text-center">레벨</div>
        <div className="w-[6.25rem] text-center">타입</div>
        <div className="flex-1 min-w-[9.375rem] text-center">조건</div>
        <div className="w-[3.75rem] text-center">알림</div>
        <div className="w-[3.75rem] text-center">SMS</div>
        <div className="w-[3.125rem] text-center">작업</div>
      </div>

      {/* Conditions */}
      {conditions.map((condition, index) => (
        <EventConditionCard
          key={condition.id || `new-${index}`}
          condition={condition}
          index={index}
          profiles={profiles}
          hasError={errorIndices.has(index)}
          onFieldChange={onFieldChange}
          onRemove={onRemove}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
