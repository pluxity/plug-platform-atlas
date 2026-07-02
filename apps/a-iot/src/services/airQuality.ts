/**
 * 에어코리아 실시간 대기오염 API 서비스
 * 성남시 측정소 기반 대기질 데이터를 가져옵니다.
 */
import type { AirKoreaResponse, AirQualityData, AirStation } from './types/airQuality'

const AIRKOREA_SERVICE_KEY = import.meta.env.VITE_AIRKOREA_SERVICE_KEY as string
const BASE_PATH = ((import.meta.env.VITE_BASE_PATH as string) || '').replace(/\/+$/, '')

/** 성남시 대기질 측정소 목록 (위경도 포함) */
export const SEONGNAM_STATIONS: AirStation[] = [
  { name: '수내동', latitude: 37.3825, longitude: 127.1145 },
  { name: '복정동', latitude: 37.4686, longitude: 127.1265 },
  { name: '단대동', latitude: 37.4447, longitude: 127.1577 },
  { name: '상대원동', latitude: 37.4335, longitude: 127.1543 },
  { name: '정자동', latitude: 37.3660, longitude: 127.1085 },
  { name: '모란역', latitude: 37.4328, longitude: 127.1290 },
]

export const DEFAULT_STATION: AirStation = SEONGNAM_STATIONS[0]!

/**
 * 유클리드 거리로 가장 가까운 측정소 반환
 */
export function findNearestStation(lat: number, lon: number): AirStation {
  let nearest = DEFAULT_STATION
  let minDist = Infinity

  for (const station of SEONGNAM_STATIONS) {
    const dLat = station.latitude - lat
    const dLon = station.longitude - lon
    const dist = dLat * dLat + dLon * dLon
    if (dist < minDist) {
      minDist = dist
      nearest = station
    }
  }

  return nearest
}

/**
 * 에어코리아 실시간 측정정보 조회 API 호출
 * 주의: serviceKey는 이미 URL-encoded 상태이므로 URLSearchParams에 넣지 않음 (이중 인코딩 방지)
 */
export async function fetchAirQualityData(stationName: string): Promise<AirQualityData> {
  const params = new URLSearchParams({
    returnType: 'json',
    numOfRows: '1',
    pageNo: '1',
    stationName,
    dataTerm: 'DAILY',
    ver: '1.0',
  })

  const url = `${BASE_PATH}/airkorea-api/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?serviceKey=${AIRKOREA_SERVICE_KEY}&${params.toString()}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`에어코리아 API 요청 실패: ${response.status}`)
  }

  const data: AirKoreaResponse = await response.json()

  if (data.response.header.resultCode !== '00') {
    throw new Error(`에어코리아 API 오류: ${data.response.header.resultMsg}`)
  }

  const items = data.response.body.items
  if (!items || items.length === 0) {
    throw new Error('에어코리아 API: 측정 데이터 없음')
  }

  const item = items[0]!

  const safeParseFloat = (val: string): number => {
    const num = parseFloat(val)
    return isNaN(num) ? 0 : num
  }

  const safeGrade = (val: string): '1' | '2' | '3' | '4' => {
    if (val === '1' || val === '2' || val === '3' || val === '4') return val
    return '1'
  }

  return {
    pm10: safeParseFloat(item.pm10Value),
    pm25: safeParseFloat(item.pm25Value),
    o3: safeParseFloat(item.o3Value),
    khaiValue: safeParseFloat(item.khaiValue),
    khaiGrade: safeGrade(item.khaiGrade),
    pm10Grade: safeGrade(item.pm10Grade),
    pm25Grade: safeGrade(item.pm25Grade),
    o3Grade: safeGrade(item.o3Grade),
    dataTime: item.dataTime,
    stationName,
  }
}
