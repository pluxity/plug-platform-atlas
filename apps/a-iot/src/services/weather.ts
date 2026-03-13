/**
 * KMA 초단기실황조회 API 서비스
 * 성남시 날씨 데이터를 가져옵니다.
 */
import type { KmaGridPoint, KmaResponse, WeatherData } from './types/weather'

export const SEONGNAM_GRID: KmaGridPoint = { name: '성남시', nx: 63, ny: 124 }

const KMA_AUTH_KEY = import.meta.env.VITE_KMA_AUTH_KEY as string

/**
 * 위경도(WGS84) → KMA 격자 좌표 변환
 * Lambert Conformal Conic Projection 기반 (기상청 제공 변환식)
 */
export function latLonToGrid(lat: number, lon: number): { nx: number; ny: number } {
  const RE = 6371.00877     // 지구 반경 (km)
  const GRID = 5.0          // 격자 간격 (km)
  const SLAT1 = 30.0        // 투영 위도1 (°)
  const SLAT2 = 60.0        // 투영 위도2 (°)
  const OLON = 126.0        // 기준점 경도 (°)
  const OLAT = 38.0         // 기준점 위도 (°)
  const XO = 43             // 기준점 X좌표 (격자)
  const YO = 136            // 기준점 Y좌표 (격자)

  const DEGRAD = Math.PI / 180.0

  const re = RE / GRID
  const slat1 = SLAT1 * DEGRAD
  const slat2 = SLAT2 * DEGRAD
  const olon = OLON * DEGRAD
  const olat = OLAT * DEGRAD

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5)
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn)

  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5)
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn

  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5)
  ro = (re * sf) / Math.pow(ro, sn)

  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5)
  ra = (re * sf) / Math.pow(ra, sn)

  let theta = lon * DEGRAD - olon
  if (theta > Math.PI) theta -= 2.0 * Math.PI
  if (theta < -Math.PI) theta += 2.0 * Math.PI
  theta *= sn

  const nx = Math.floor(ra * Math.sin(theta) + XO + 0.5)
  const ny = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5)

  return { nx, ny }
}

/**
 * 현재 시각 기준 요청할 base_date/base_time 계산
 * 초단기실황은 매시 정각 발표, API 제공은 약 10분 후
 * 현재 시각이 정시+40분 이전이면 이전 시간 데이터를 요청
 */
export function getKmaBaseDateTime(now = new Date()): { baseDate: string; baseTime: string } {
  const minutes = now.getMinutes()

  // 40분 이전이면 이전 시간 데이터
  if (minutes < 40) {
    now = new Date(now.getTime() - 60 * 60 * 1000)
  }

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')

  return {
    baseDate: `${year}${month}${day}`,
    baseTime: `${hour}00`,
  }
}

/**
 * KMA 초단기실황조회 API 호출
 */
export async function fetchWeatherData(grid: KmaGridPoint = SEONGNAM_GRID): Promise<WeatherData> {
  const { baseDate, baseTime } = getKmaBaseDateTime()

  const params = new URLSearchParams({
    authKey: KMA_AUTH_KEY,
    numOfRows: '10',
    pageNo: '1',
    dataType: 'JSON',
    base_date: baseDate,
    base_time: baseTime,
    nx: String(grid.nx),
    ny: String(grid.ny),
  })

  const url = `/kma-api/api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtNcst?${params.toString()}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`KMA API 요청 실패: ${response.status}`)
  }

  const data: KmaResponse = await response.json()

  if (data.response.header.resultCode !== '00') {
    throw new Error(`KMA API 오류: ${data.response.header.resultMsg}`)
  }

  const items = data.response.body.items.item

  const getValue = (category: string): number => {
    const item = items.find((i) => i.category === category)
    return item ? parseFloat(item.obsrValue) : 0
  }

  return {
    temperature: getValue('T1H'),
    humidity: getValue('REH'),
    windSpeed: getValue('WSD'),
    windDirection: getValue('VEC'),
    rainfall: getValue('RN1'),
    precipType: getValue('PTY'),
    eastWestWind: getValue('UUU'),
    northSouthWind: getValue('VVV'),
    baseDate,
    baseTime,
  }
}
