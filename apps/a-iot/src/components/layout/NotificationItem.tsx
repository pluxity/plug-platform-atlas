import { useEventStore } from '../../stores'
import { getLevelInfo } from '../../pages/main/events/utils/levelUtils'
import { getAssetPath } from '../../utils/assetPath'
import type { Notification, Event } from '../../services/types'

const getLevelColor = (level?: string) => {
  switch (level) {
    case 'DANGER':
      return 'text-red-700'
    case 'WARNING':
      return 'text-orange-700'
    case 'CAUTION':
      return 'text-amber-600'
    case 'DISCONNECTED':
      return 'text-purple-700'
    default:
      return 'text-gray-600'
  }
}

const getRelativeTime = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return '방금 전'
  if (diffMins < 60) return `${diffMins}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  return `${diffDays}일 전`
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onItemClick,
}: {
  notification: Notification
  onMarkAsRead?: (id: string) => void
  onItemClick: (event: Event) => void
}) {
  const getEvent = useEventStore((state) => state.getEvent)

  const initialPayload =
    notification.type === 'sensor-alarm' ? (notification.payload as Event) : null

  const payload = initialPayload?.eventId
    ? (getEvent(initialPayload.eventId) ?? initialPayload)
    : initialPayload

  const handleClick = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id)
    }
    if (payload) {
      onItemClick(payload)
    }
  }

  const currentLevel = payload?.level ?? notification.level

  const getLevelIconPath = () => {
    switch (currentLevel) {
      case 'DANGER':
        return getAssetPath('/images/icons/notification/danger.svg')
      case 'WARNING':
        return getAssetPath('/images/icons/notification/warning.svg')
      case 'CAUTION':
        return getAssetPath('/images/icons/notification/caution.svg')
      case 'DISCONNECTED':
        return getAssetPath('/images/icons/notification/danger.svg')
      default:
        return getAssetPath('/images/icons/notification/caution.svg')
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-2xl p-5 outline outline-offset-[-1px] outline-neutral-200 cursor-pointer hover:bg-gray-50 transition-colors ${
        !notification.read ? 'bg-blue-50/30' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center flex-1 min-w-0">
          <span className="text-sm font-bold text-zinc-800 truncate">
            {payload?.profileDescription || payload?.sensorDescription || '센서'}{' '}
            {getLevelInfo(currentLevel || '').text} 발생
          </span>
        </div>
        <span className="text-xs text-neutral-400 whitespace-nowrap ml-2">
          {getRelativeTime(notification.timestamp)}
        </span>
      </div>
      <div className="flex gap-2.5 items-center">
        <img
          src={getLevelIconPath()}
          alt={currentLevel || 'notification'}
          className="w-7 h-7 flex-shrink-0"
        />
        <div className="space-y-1">
          <div className="text-sm text-zinc-800 m-0">{payload?.siteName || '알 수 없음'}</div>
          <div className={`text-xs ${getLevelColor(currentLevel)}`}>
            {payload?.sensorDescription || ''}: {payload?.deviceId || ''}
          </div>
        </div>
      </div>
    </div>
  )
}
