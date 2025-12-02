/**
 * 성남시 행정구역 GeoJSON 서비스
 * 로컬 파일에서 데이터를 로드합니다.
 */

// 성남시 행정구역 코드
export const SEONGNAM_DISTRICT_CODES = {
  CITY: '41130',    // 성남시 전체
  SUJEONG: '41131', // 수정구
  JUNGWON: '41133', // 중원구
  BUNDANG: '41135', // 분당구
} as const

// 구별 색상 정의
export const DISTRICT_COLORS: Record<string, { fill: string; outline: string }> = {
  '41131': { fill: 'rgba(59, 130, 246, 0.2)', outline: '#3B82F6' },  // 수정구 - 파랑
  '41133': { fill: 'rgba(34, 197, 94, 0.2)', outline: '#22C55E' },   // 중원구 - 초록
  '41135': { fill: 'rgba(168, 85, 247, 0.2)', outline: '#A855F7' },  // 분당구 - 보라
}

export interface VWorldFeature {
  type: 'Feature'
  properties: {
    sig_cd: string      // 시군구 코드
    sig_kor_nm: string  // 시군구 한글명
    sig_eng_nm?: string // 시군구 영문명
    full_nm?: string    // 전체 주소
  }
  geometry: {
    type: 'MultiPolygon' | 'Polygon'
    coordinates: number[][][] | number[][][][]
  }
}

export interface VWorldFeatureCollection {
  type: 'FeatureCollection'
  features: VWorldFeature[]
  bbox?: number[]
}

/**
 * 성남시 3개 구의 경계 데이터를 로컬 파일에서 로드합니다.
 * 파일 경로: /data/seongnam-districts.geojson
 */
export async function fetchSeongnamDistricts(): Promise<VWorldFeatureCollection | null> {
  try {
    const response = await fetch('/data/seongnam-districts.geojson')
    if (!response.ok) {
      console.warn('GeoJSON 파일을 찾을 수 없습니다:', response.status)
      return null
    }
    const data = await response.json()
    console.log('성남시 행정구역 데이터 로드 완료:', data.features?.length, '개 구')
    return data
  } catch (error) {
    console.error('GeoJSON 파일 로드 실패:', error)
    return null
  }
}
