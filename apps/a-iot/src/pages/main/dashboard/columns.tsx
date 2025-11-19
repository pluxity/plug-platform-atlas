// @plug-atlas packages
import { Badge, Column } from '@plug-atlas/ui'

// Internal imports
import { getLevelInfo } from '@/pages/main/events/utils/levelUtils'
import { getStatusBadgeStyle, getStatusInfo } from '@/pages/main/events/utils/statusUtils'
import { Event, FeatureResponse } from '@/services/types'

/**
 * 배터리 알람 테이블 컬럼 정의
 */
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

/**
 * 이벤트 현황 테이블 컬럼 정의
 */
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
    cell: (_, row) => (
      row.occurredAt ? new Date(row.occurredAt).toLocaleString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }) : '-'
    ),
  },
];

/**
 * 장치 상태 테이블 컬럼 정의
 */
export const featureStatusColumns: Column<FeatureResponse>[] = [
  {
    key: 'siteResponse',
    header: '공원명',
    cell: (_, row) => (
      row.siteResponse?.name ? String(row.siteResponse?.name) : '-'
    )
  },
  {
    key: 'deviceId',
    header: '디바이스 코드',
    cell: (_, row) => (
      row.deviceId ? String(row.deviceId) : '-'
    ),
  },
  {
    key: 'name',
    header: '디바이스 이름',
    cell: (_, row) => (
      row.name ? String(row.name) : '-'
    ),
  },
  {
    key: 'eventStatus',
    header: '장치 상태',
    cell: (_, row) => (
      row.eventStatus ? <Badge variant='secondary'>{row.eventStatus}</Badge> : '-'
    )
  },
];
