import { Wind, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@plug-atlas/ui'
import { useAirQuality } from '@/services/hooks/useAirQuality'
import { useAllStationsAirQuality } from '@/services/hooks/useAirQuality'
import type { FeatureResponse } from '@/services/types'
import type { AirQualityGrade } from '@/services/types/airQuality'

/** 등급별 라벨 + 색상 */
function getGradeInfo(grade: AirQualityGrade) {
  switch (grade) {
    case '1': return { label: '좋음', color: 'text-blue-500', bg: 'bg-blue-100', dot: 'bg-blue-500' }
    case '2': return { label: '보통', color: 'text-green-500', bg: 'bg-green-100', dot: 'bg-green-500' }
    case '3': return { label: '나쁨', color: 'text-orange-500', bg: 'bg-orange-100', dot: 'bg-orange-500' }
    case '4': return { label: '매우나쁨', color: 'text-red-500', bg: 'bg-red-100', dot: 'bg-red-500' }
  }
}

interface AirQualityCardProps {
  siteId?: string | null
  sensors?: FeatureResponse[]
  variant?: 'detail' | 'overview'
}

/** 등급 문자열 중 가장 나쁜(숫자가 큰) 등급 반환 */
function worstGrade(grades: AirQualityGrade[]): AirQualityGrade {
  return grades.reduce((w, g) => (g > w ? g : w), '1' as AirQualityGrade)
}

/** 전체보기 - 성남시 6개소 평균 PM2.5 / PM10 / O3 */
function AirQualityOverview() {
  const { stations, isLoading, error, refresh } = useAllStationsAirQuality()

  if (error) {
    return (
      <Card className="py-3">
        <CardContent className="flex items-center justify-between px-5 py-0">
          <div className="flex items-center gap-2 text-gray-400">
            <Wind className="size-5" />
            <span className="text-sm">대기질 정보를 불러올 수 없습니다</span>
          </div>
          <button onClick={refresh} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <RefreshCw className="size-4 text-gray-400" />
          </button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading || stations.length === 0) {
    return (
      <Card className="py-3">
        <CardContent className="flex items-center gap-3 px-5 py-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          ))}
        </CardContent>
      </Card>
    )
  }

  const n = stations.length
  const avgPm25 = Math.round(stations.reduce((s, st) => s + st.pm25, 0) / n)
  const avgPm10 = Math.round(stations.reduce((s, st) => s + st.pm10, 0) / n)
  const avgO3 = (stations.reduce((s, st) => s + st.o3, 0) / n).toFixed(3)

  const pm25Info = getGradeInfo(worstGrade(stations.map(s => s.pm25Grade)))
  const pm10Info = getGradeInfo(worstGrade(stations.map(s => s.pm10Grade)))
  const o3Info = getGradeInfo(worstGrade(stations.map(s => s.o3Grade)))

  return (
    <Card className="py-3">
      <CardContent className="flex items-center justify-between px-5 py-0">
        <div className="flex items-center gap-5">
          <span className="text-sm font-medium text-gray-700">성남시 {n}개소</span>

          <div className="h-6 w-px bg-gray-200" />

          {/* PM2.5 */}
          <div className="flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${pm25Info.dot}`} />
            <span className="text-xs text-gray-500">초미세먼지</span>
            <span className="text-sm font-semibold text-gray-700">{avgPm25}</span>
            <span className="text-xs text-gray-400">㎍/㎥</span>
          </div>

          {/* PM10 */}
          <div className="flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${pm10Info.dot}`} />
            <span className="text-xs text-gray-500">미세먼지</span>
            <span className="text-sm font-semibold text-gray-700">{avgPm10}</span>
            <span className="text-xs text-gray-400">㎍/㎥</span>
          </div>

          {/* O3 */}
          <div className="flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${o3Info.dot}`} />
            <span className="text-xs text-gray-500">오존</span>
            <span className="text-sm font-semibold text-gray-700">{avgO3}</span>
            <span className="text-xs text-gray-400">ppm</span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-6">
          <span className="text-[10px] text-gray-300">Provided by 에어코리아</span>
          <button onClick={refresh} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="새로고침">
            <RefreshCw className="size-3.5 text-gray-400" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

/** 공원별 - 상세 대기질 (PM10, PM2.5, O3) */
function AirQualityDetail({ siteId, sensors }: { siteId?: string | null; sensors?: FeatureResponse[] }) {
  const { airQuality, isLoading, error, stationName, observationTime, refresh } = useAirQuality({ siteId, sensors })

  if (error) {
    return (
      <Card className="py-3">
        <CardContent className="flex items-center justify-between px-5 py-0">
          <div className="flex items-center gap-2 text-gray-400">
            <Wind className="size-5" />
            <span className="text-sm">대기질 정보를 불러올 수 없습니다</span>
          </div>
          <button onClick={refresh} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <RefreshCw className="size-4 text-gray-400" />
          </button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading || !airQuality) {
    return (
      <Card className="py-3">
        <CardContent className="flex items-center gap-4 px-5 py-0">
          <div className="size-5 rounded-full bg-gray-200 animate-pulse" />
          <div className="flex-1 flex gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const pm10Info = getGradeInfo(airQuality.pm10Grade)
  const pm25Info = getGradeInfo(airQuality.pm25Grade)
  const o3Info = getGradeInfo(airQuality.o3Grade)

  return (
    <Card className="py-3">
      <CardContent className="flex items-center justify-between px-5 py-0">
        {/* 대기질 정보 */}
        <div className="flex items-center gap-5">
          {/* 측정소명 */}
          <span className="text-sm font-medium text-gray-700">{stationName}</span>

          <div className="h-6 w-px bg-gray-200" />

          {/* PM2.5 초미세먼지 */}
          <div className="flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${pm25Info.dot}`} />
            <span className="text-xs text-gray-500">초미세먼지</span>
            <span className="text-sm font-semibold text-gray-700">{airQuality.pm25}</span>
            <span className="text-xs text-gray-400">㎍/㎥</span>
          </div>

          {/* PM10 미세먼지 */}
          <div className="flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${pm10Info.dot}`} />
            <span className="text-xs text-gray-500">미세먼지</span>
            <span className="text-sm font-semibold text-gray-700">{airQuality.pm10}</span>
            <span className="text-xs text-gray-400">㎍/㎥</span>
          </div>

          {/* O3 오존 */}
          <div className="flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${o3Info.dot}`} />
            <span className="text-xs text-gray-500">오존</span>
            <span className="text-sm font-semibold text-gray-700">{airQuality.o3}</span>
            <span className="text-xs text-gray-400">ppm</span>
          </div>
        </div>

        {/* 출처 + 기준시간 + 새로고침 */}
        <div className="flex items-center gap-2 ml-6">
          <div className="text-right">
            <div className="text-[10px] text-gray-400">{observationTime}</div>
            <div className="text-[10px] text-gray-300">Provided by 에어코리아</div>
          </div>
          <button
            onClick={refresh}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            title="새로고침"
          >
            <RefreshCw className="size-3.5 text-gray-400" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AirQualityCard({ siteId, sensors, variant = 'detail' }: AirQualityCardProps) {
  if (variant === 'overview') {
    return <AirQualityOverview />
  }
  return <AirQualityDetail siteId={siteId} sensors={sensors} />
}
