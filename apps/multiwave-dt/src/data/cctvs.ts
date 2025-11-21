export interface CctvLocation {
  id: string
  name: string
  latitude: number
  longitude: number
  altitude?: number
  status?: 'active' | 'inactive' | 'maintenance'
  description?: string
}

// CCTV 카메라 위치 데이터
// 기준 좌표: 128.573323, 38.066044 주변
export const cctvs: CctvLocation[] = [
  {
    id: 'cctv-001',
    name: 'CCTV #1',
    latitude: 38.066044,
    longitude: 128.573323,
    altitude: 0,
    status: 'active',
    description: '중앙 기준점',
  },
  {
    id: 'cctv-002',
    name: 'CCTV #2',
    latitude: 38.067044,
    longitude: 128.574323,
    altitude: 0,
    status: 'active',
    description: '북동쪽 지역',
  },
  {
    id: 'cctv-003',
    name: 'CCTV #3',
    latitude: 38.065044,
    longitude: 128.574323,
    altitude: 0,
    status: 'active',
    description: '남동쪽 지역',
  },
  {
    id: 'cctv-004',
    name: 'CCTV #4',
    latitude: 38.067044,
    longitude: 128.572323,
    altitude: 0,
    status: 'active',
    description: '북서쪽 지역',
  },
  {
    id: 'cctv-005',
    name: 'CCTV #5',
    latitude: 38.065044,
    longitude: 128.572323,
    altitude: 0,
    status: 'active',
    description: '남서쪽 지역',
  },
  {
    id: 'cctv-006',
    name: 'CCTV #6',
    latitude: 38.066544,
    longitude: 128.573323,
    altitude: 0,
    status: 'active',
    description: '북쪽 경계',
  },
  {
    id: 'cctv-007',
    name: 'CCTV #7',
    latitude: 38.065544,
    longitude: 128.573323,
    altitude: 0,
    status: 'active',
    description: '남쪽 경계',
  },
  {
    id: 'cctv-008',
    name: 'CCTV #8',
    latitude: 38.066044,
    longitude: 128.574323,
    altitude: 0,
    status: 'active',
    description: '동쪽 경계',
  },
  {
    id: 'cctv-009',
    name: 'CCTV #9',
    latitude: 38.066044,
    longitude: 128.572323,
    altitude: 0,
    status: 'active',
    description: '서쪽 경계',
  },
  {
    id: 'cctv-010',
    name: 'CCTV #10',
    latitude: 38.066544,
    longitude: 128.573823,
    altitude: 0,
    status: 'active',
    description: '북동 모니터링',
  },
]
