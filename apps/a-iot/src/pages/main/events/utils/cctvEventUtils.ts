import type { CctvEventType, CctvEventStatus } from '@/services/types'

export const CCTV_EVENT_TYPE_LABELS: Partial<Record<CctvEventType, string>> = {
  LOITERING: '배회',
  ENTER: '진입',
  EXIT: '이탈',
  STOP: '정지',
  PATH_PASS: '경로 통과',
  DIRECTIONAL_MOVE: '방향 이동',
  LINE_CROSS: '라인 통과',
  MULTI_LINE_CROSS: '다중 라인 통과',
  SMOKE: '연기',
  FLAME: '화재',
  FALL_DOWN: '쓰러짐',
  CROWD: '군중',
  CROWD_DENSITY: '군중 밀집',
  VIOLENCE: '폭력',
  ABANDONED: '유기물',
  REMOVED: '물체 제거',
  LEFT_ALONE: '방치',
  VEHICLE_ACCIDENT: '차량사고',
  VEHICLE_STOP: '차량정지',
  VEHICLE_PARKING: '불법주차',
  VEHICLE_TAILGATING: '차량 밀착',
  TRAFFIC_JAM: '교통정체',
  JAYWALKING: '무단횡단',
  PEDESTRIAN_DANGER: '보행자 위험',
  PEDESTRIAN_STATISTICS: '보행자 통계',
  NO_HELMET: '안전모 미착용',
  NO_SAFETY_VEST: '안전조끼 미착용',
  NO_MASK: '마스크 미착용',
  WEAPON_THREAT: '흉기 위협',
  LICENSE_PLATE_RECOGNITION: '번호판 인식',
  VEHICLE_PLATE: '차량 번호판',
  FACE_RECOGNITION: '얼굴 인식',
  GAUGE_RECOGNITION: '게이지 인식',
  ACTION_RECOGNITION: '행동 인식',
  DANGER_WATER_LEVEL: '위험 수위',
  AREA_COLOR: '영역 색상 변화',
  COLOR_CHANGE: '색상 변화',
  STAY: '체류',
  STAY_OVERCROWDED: '체류 과밀',
  STAY_TIMEOUT: '체류 시간 초과',
  STAY_ALONE: '단독 체류',
  APPROACH: '접근',
  SEPARATE: '이탈',
  FLASHLIGHT: '손전등',
  SAFETY_HOOK_UNLATCHED: '안전고리 미체결',
  NO_KORAIL_UNIFORM: '코레일 유니폼 미착용',
  FARE_EVASION: '무임 승차',
  CAKE_RECOGNITION: '케이크 인식',
}

export const CCTV_EVENT_STATUS_MAP: Record<CctvEventStatus, { label: string; className: string }> = {
  STARTED: { label: '발생', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
  IN_PROGRESS: { label: '진행중', className: 'bg-amber-100 text-amber-700 hover:bg-amber-100' },
  ENDED: { label: '종료', className: 'bg-gray-100 text-gray-600 hover:bg-gray-100' },
}

export function getCctvEventTypeLabel(type: CctvEventType): string {
  return CCTV_EVENT_TYPE_LABELS[type] ?? type
}

export function getCctvEventStatusInfo(status: CctvEventStatus) {
  return CCTV_EVENT_STATUS_MAP[status] ?? { label: status, className: 'bg-gray-100 text-gray-600' }
}

// 필터 드롭다운용 주요 이벤트 타입 옵션
export const cctvEventTypeOptions = [
  { value: 'all', label: '전체 이벤트' },
  { value: 'LOITERING', label: '배회' },
  { value: 'ENTER', label: '진입' },
  { value: 'EXIT', label: '이탈' },
  { value: 'LINE_CROSS', label: '라인 통과' },
  { value: 'SMOKE', label: '연기' },
  { value: 'FLAME', label: '화재' },
  { value: 'FALL_DOWN', label: '쓰러짐' },
  { value: 'CROWD', label: '군중' },
  { value: 'VIOLENCE', label: '폭력' },
  { value: 'ABANDONED', label: '유기물' },
  { value: 'VEHICLE_ACCIDENT', label: '차량사고' },
  { value: 'VEHICLE_PARKING', label: '불법주차' },
  { value: 'JAYWALKING', label: '무단횡단' },
  { value: 'PEDESTRIAN_DANGER', label: '보행자 위험' },
  { value: 'NO_HELMET', label: '안전모 미착용' },
  { value: 'WEAPON_THREAT', label: '흉기 위협' },
]
