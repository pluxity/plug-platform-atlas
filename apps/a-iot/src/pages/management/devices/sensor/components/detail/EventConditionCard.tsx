// External packages
import { useState } from 'react'
import { Bell, BellOff, Trash2, X, Mail, MailX } from 'lucide-react'

// @plug-atlas packages
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from '@plug-atlas/ui'

// Internal imports
import { DeviceProfile, EventCondition } from '@/services/types'
import { isBooleanProfile } from '@/pages/management/devices/sensor/handlers/EventConditionUtils'
import {
  EditableCondition,
  EditableConditionType,
  EditableFieldKey,
  EditableLevel,
} from '@/pages/management/devices/sensor/components/detail/EditableCells'

interface EventConditionCardProps {
  condition: EventCondition
  index: number
  profiles: DeviceProfile[]
  onFieldChange: (index: number, field: keyof EventCondition, value: any) => void
  onRemove: (index: number) => void
  onDelete: (conditionId: number) => Promise<void>
}

export default function EventConditionCard({
  condition,
  index,
  profiles,
  onFieldChange,
  onRemove,
  onDelete,
}: EventConditionCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const isNewCondition = !condition.id
  const isBoolean = isBooleanProfile(profiles, condition.fieldKey)

  const handleDeleteClick = () => {
    if (isNewCondition) {
      onRemove(index)
    } else {
      setIsDeleteDialogOpen(true)
    }
  }

  const handleConfirmDelete = async () => {
    if (condition.id) {
      await onDelete(condition.id)
    }
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <div className={`flex items-center gap-2 px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors ${
        isNewCondition ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200 bg-white'
      }`}>
        {/* Field Key */}
        <div className="flex-1 min-w-[7.5rem]">
          <EditableFieldKey
            value={condition.fieldKey}
            onChange={(value) => onFieldChange(index, 'fieldKey', value)}
            profiles={profiles}
          />
        </div>

        {/* Level */}
        <div className="w-[6.25rem]">
          <EditableLevel
            value={condition.level}
            onChange={(value) => onFieldChange(index, 'level', value)}
            profiles={profiles}
            fieldKey={condition.fieldKey}
          />
        </div>

        {/* Condition Type */}
        <div className="w-[6.25rem]">
          {condition.fieldKey ? (
            isBoolean ? (
              <div className="text-sm text-center font-medium text-gray-700">Boolean</div>
            ) : (
              <EditableConditionType
                value={condition.conditionType}
                onChange={(field, value) => onFieldChange(index, field, value)}
                profiles={profiles}
                fieldKey={condition.fieldKey}
                row={condition}
              />
            )
          ) : (
            <div className="text-gray-400 text-sm text-center">-</div>
          )}
        </div>

        {/* Condition Values */}
        <div className="flex-1 min-w-[9.375rem]">
          {condition.fieldKey ? (
            <EditableCondition
              row={condition}
              onChange={(field, value) => onFieldChange(index, field, value)}
              profiles={profiles}
            />
          ) : (
            <div className="text-gray-400 text-sm text-center">-</div>
          )}
        </div>

        {/* Activate (알림) */}
        <div className="w-[3.75rem] flex justify-center">
          <Button
            variant={condition.activate ? "default" : "outline"}
            size="sm"
            onClick={() => onFieldChange(index, 'activate', !condition.activate)}
            className={`${
              condition.activate
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'border-gray-300 text-gray-500 hover:bg-gray-50'
            } h-8 transition-colors`}
            aria-label={condition.activate ? '활성화됨 (클릭하여 비활성화)' : '비활성화됨 (클릭하여 활성화)'}
            title={condition.activate ? '활성화됨 (클릭하여 비활성화)' : '비활성화됨 (클릭하여 활성화)'}
          >
            {condition.activate ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          </Button>
        </div>

        {/* Notification (SMS) */}
        <div className="w-[3.75rem] flex justify-center">
          <Button
            variant={condition.notificationEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => onFieldChange(index, 'notificationEnabled', !condition.notificationEnabled)}
            className={`${
              condition.notificationEnabled
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'border-gray-300 text-gray-500 hover:bg-gray-50'
            } h-8 transition-colors`}
            aria-label={condition.notificationEnabled ? '알림 활성화됨 (클릭하여 비활성화)' : '알림 비활성화됨 (클릭하여 활성화)'}
            title={condition.notificationEnabled ? '알림 활성화됨 (클릭하여 비활성화)' : '알림 비활성화됨 (클릭하여 활성화)'}
          >
            {condition.notificationEnabled ? <Mail className="h-4 w-4" /> : <MailX className="h-4 w-4" />}
          </Button>
        </div>

        {/* Delete Button */}
        <div className="w-[3.125rem] flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteClick}
            className="text-red-600 hover:text-red-800"
            aria-label={isNewCondition ? '조건 취소' : '조건 삭제'}
            title={isNewCondition ? '조건 취소' : '조건 삭제'}
          >
            {isNewCondition ? <X className="h-3 w-3" /> : <Trash2 className="h-3 w-3" />}
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>조건 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 이벤트 조건을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
