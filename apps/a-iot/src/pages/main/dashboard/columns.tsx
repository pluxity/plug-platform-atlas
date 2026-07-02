import { Badge, Column } from '@plug-atlas/ui'
import { getLevelInfo } from '@/pages/main/events/utils/levelUtils'
import { getStatusBadgeStyle, getStatusInfo } from '@/pages/main/events/utils/statusUtils'
import { Event, FeatureResponse } from '@/services/types'
import type { CctvEventResponse, CctvEventType, CctvEventStatus } from '@/services/types'
import { getCctvEventTypeLabel, getCctvEventStatusInfo } from '@/pages/main/events/utils/cctvEventUtils'

function getRelativeTime(dateStr: string): string {
  const now = Date.now()
  const target = new Date(dateStr).getTime()
  const diff = now - target
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)

  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  if (days === 1) return '어제'
  if (days < 7) return `${days}일 전`
  return `${Math.floor(days / 7)}주 전`
}

export const batteryAlarmColumns: Column<FeatureResponse>[] = [
  {
    key: 'name',
    header: '장치 이름',
    cell: (value) => value ? String(value) : '-',
  },
  {
    key: 'batteryLevel',
    header: '배터리 잔량',
    cell: (value) => (
      <div>
        {value ? `${value}%` : '-'}
      </div>
    ),
  },
];

export const eventColumns: Column<Event>[] = [
  {
    key: 'deviceId',
    header: '디바이스 ID',
    cell: (value) => (
      value ? String(value) : '-'
    ),
  },
  {
    key: 'status',
    header: '상태',
    cell: (value, row) => {
      const statusInfo = getStatusInfo(String(value))
      const StatusIcon = statusInfo.icon
      return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium ${getStatusBadgeStyle(row.status)}`}>
          <StatusIcon className="h-3.5 w-3.5" />
          <span>{statusInfo.text}</span>
        </div>
      )
    },
  },
  {
    key: 'level',
    header: '심각도',
    cell: (value) => {
      const levelInfo = getLevelInfo(String(value))
      return (
        <div className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-sm shadow-sm ${levelInfo.color}`}>
          {levelInfo.text}
        </div>
      )
    },
  },
  {
    key: 'occurredAt',
    header: '발생시간',
    cell: (_, row) => {
      if (!row.occurredAt) return '-'
      const absolute = new Date(row.occurredAt).toLocaleString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
      })
      return (
        <span title={absolute}>{getRelativeTime(row.occurredAt)}</span>
      )
    },
  },
];

function getBatteryColor(level: number): string {
  if (level <= 10) return 'bg-red-500'
  if (level <= 20) return 'bg-orange-500'
  if (level <= 50) return 'bg-yellow-500'
  return 'bg-green-500'
}

function getBatteryTextColor(level: number): string {
  if (level <= 10) return 'text-red-600 font-bold'
  if (level <= 20) return 'text-orange-600 font-bold'
  if (level <= 50) return 'text-yellow-600'
  return 'text-green-600'
}

export const parkBatteryColumns: Column<FeatureResponse>[] = [
  {
    key: 'name',
    header: '장치명',
    cell: (_, row) => (
      <span className="text-xs font-medium">{row.name || '-'}</span>
    ),
  },
  {
    key: 'batteryLevel',
    header: '배터리',
    cell: (_, row) => {
      const level = row.batteryLevel
      if (level == null) return <span className="text-xs text-gray-400">-</span>
      return (
        <div className="flex items-center gap-2 min-w-[100px]">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${getBatteryColor(level)}`}
              style={{ width: `${level}%` }}
            />
          </div>
          <span className={`text-xs tabular-nums w-8 text-right ${getBatteryTextColor(level)}`}>{level}%</span>
        </div>
      )
    },
  },
  {
    key: 'eventStatus',
    header: '상태',
    cell: (_, row) => {
      const level = row.batteryLevel
      if (level == null) return '-'
      if (level <= 10) return <Badge variant="destructive" className="text-[10px] px-1.5">교체 필요</Badge>
      if (level <= 20) return <Badge className="text-[10px] px-1.5 bg-orange-100 text-orange-700 hover:bg-orange-100">교체 권장</Badge>
      return <Badge variant="secondary" className="text-[10px] px-1.5">정상</Badge>
    },
  },
]

export const cctvEventColumns: Column<CctvEventResponse>[] = [
  {
    key: 'cameraId',
    header: '카메라',
    cell: (value) => (
      <span className="text-xs font-mono">{value ? String(value) : '-'}</span>
    ),
  },
  {
    key: 'eventType',
    header: '이벤트',
    cell: (value) => (
      <span className="text-xs font-medium">{getCctvEventTypeLabel(value as CctvEventType)}</span>
    ),
  },
  {
    key: 'eventStatus',
    header: '상태',
    cell: (value) => {
      const info = getCctvEventStatusInfo(value as CctvEventStatus)
      return <Badge className={`text-[10px] px-1.5 ${info.className}`}>{info.label}</Badge>
    },
  },
  {
    key: 'createdAt',
    header: '발생시간',
    cell: (_, row) => {
      if (!row.createdAt) return '-'
      const absolute = new Date(row.createdAt).toLocaleString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
      })
      return <span title={absolute}>{getRelativeTime(row.createdAt)}</span>
    },
  },
]

export const featureStatusColumns: Column<FeatureResponse>[] = [
  {
    key: 'name',
    header: '장치명',
    cell: (_, row) => (
      row.name ? String(row.name) : '-'
    ),
  },
  {
    key: 'deviceId',
    header: '디바이스 ID',
    cell: (_, row) => (
      row.deviceId ? String(row.deviceId) : '-'
    ),
  },
  {
    key: 'eventStatus',
    header: '연결 상태',
    cell: (_, row) => {
      const isDisconnected = row.eventStatus === 'DISCONNECTED'
      return (
        <Badge variant={isDisconnected ? 'destructive' : 'secondary'}>
          {isDisconnected ? '연결 끊김' : '정상'}
        </Badge>
      )
    }
  },
  {
    key: 'batteryLevel',
    header: '배터리',
    cell: (_, row) => (
      row.batteryLevel != null ? `${row.batteryLevel}%` : '-'
    ),
  },
];
