/** 에어코리아 실시간 대기오염 API 타입 정의 */

/** 대기질 등급 (1=좋음, 2=보통, 3=나쁨, 4=매우나쁨) */
export type AirQualityGrade = '1' | '2' | '3' | '4'

/** 측정소 정보 (위경도 포함) */
export interface AirStation {
  name: string
  latitude: number
  longitude: number
}

/** API 원본 응답 항목 (모두 문자열) */
export interface AirQualityItem {
  dataTime: string
  mangName: string
  so2Value: string
  coValue: string
  o3Value: string
  no2Value: string
  pm10Value: string
  pm25Value: string
  khaiValue: string
  khaiGrade: string
  so2Grade: string
  coGrade: string
  o3Grade: string
  no2Grade: string
  pm10Grade: string
  pm25Grade: string
  pm10Value24: string
  pm25Value24: string
}

/** data.go.kr 응답 래퍼 */
export interface AirKoreaResponse {
  response: {
    header: {
      resultCode: string
      resultMsg: string
    }
    body: {
      totalCount: number
      items: AirQualityItem[]
      pageNo: number
      numOfRows: number
    }
  }
}

/** 파싱된 대기질 데이터 */
export interface AirQualityData {
  pm10: number          // 미세먼지 (㎍/㎥)
  pm25: number          // 초미세먼지 (㎍/㎥)
  khaiValue: number     // 통합대기환경지수 (CAI)
  khaiGrade: AirQualityGrade
  pm10Grade: AirQualityGrade
  pm25Grade: AirQualityGrade
  dataTime: string      // 측정일시
  stationName: string   // 측정소명
}
