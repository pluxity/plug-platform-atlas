/** KMA 초단기실황조회 API 타입 정의 */

export type KmaCategory = 'T1H' | 'RN1' | 'UUU' | 'VVV' | 'REH' | 'PTY' | 'VEC' | 'WSD'

export interface KmaObservationItem {
  baseDate: string
  baseTime: string
  category: KmaCategory
  nx: number
  ny: number
  obsrValue: string
}

export interface KmaResponse {
  response: {
    header: {
      resultCode: string
      resultMsg: string
    }
    body: {
      dataType: string
      items: {
        item: KmaObservationItem[]
      }
      totalCount: number
    }
  }
}

export interface WeatherData {
  temperature: number    // T1H: 기온 (°C)
  humidity: number       // REH: 습도 (%)
  windSpeed: number      // WSD: 풍속 (m/s)
  windDirection: number  // VEC: 풍향 (°)
  rainfall: number       // RN1: 1시간 강수량 (mm)
  precipType: number     // PTY: 강수형태 (0=없음, 1=비, 2=비/눈, 3=눈, 5=빗방울, 6=빗방울눈날림, 7=눈날림)
  eastWestWind: number   // UUU: 동서바람성분 (m/s)
  northSouthWind: number // VVV: 남북바람성분 (m/s)
  baseDate: string
  baseTime: string
}

export interface KmaGridPoint {
  name: string
  nx: number
  ny: number
}
