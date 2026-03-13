import { Wind, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@plug-atlas/ui'
import { useAirQuality } from '@/services/hooks/useAirQuality'
import type { FeatureResponse } from '@/services/types'
import type { AirQualityGrade } from '@/services/types/airQuality'

/** 등급별 라벨 + 색상 */
function getGradeInfo(grade: AirQualityGrade) {
  switch (grade) {
    case '1': return { label: '좋음', color: 'text-blue-500', bg: 'bg-blue-100' }
    case '2': return { label: '보통', color: 'text-green-500', bg: 'bg-green-100' }
    case '3': return { label: '나쁨', color: 'text-orange-500', bg: 'bg-orange-100' }
    case '4': return { label: '매우나쁨', color: 'text-red-500', bg: 'bg-red-100' }
  }
}

interface AirQualityCardProps {
  siteId?: string | null
  sensors?: FeatureResponse[]
}

export default function AirQualityCard({ siteId, sensors }: AirQualityCardProps) {
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

  const khaiInfo = getGradeInfo(airQuality.khaiGrade)
  const pm10Info = getGradeInfo(airQuality.pm10Grade)
  const pm25Info = getGradeInfo(airQuality.pm25Grade)

  return (
    <Card className="py-3">
      <CardContent className="flex items-center justify-between px-5 py-0">
        {/* 대기질 정보 */}
        <div className="flex items-center gap-6">
          {/* 측정소명 */}
          <span className="text-sm font-medium text-gray-700">{stationName}</span>

          <div className="h-6 w-px bg-gray-200" />

          {/* 통합대기환경지수 (CAI) */}
          <div className="flex items-center gap-2">
            <Wind className={`size-6 ${khaiInfo.color}`} />
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{airQuality.khaiValue}</span>
              <span className="text-sm text-gray-500">CAI</span>
            </div>
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${khaiInfo.bg} ${khaiInfo.color}`}>
              {khaiInfo.label}
            </span>
          </div>

          <div className="h-6 w-px bg-gray-200" />

          {/* PM10 미세먼지 */}
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-medium ${pm10Info.color}`}>PM10</span>
            <span className="text-sm text-gray-600">{airQuality.pm10}㎍/㎥</span>
          </div>

          {/* PM2.5 초미세먼지 */}
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-medium ${pm25Info.color}`}>PM2.5</span>
            <span className="text-sm text-gray-600">{airQuality.pm25}㎍/㎥</span>
          </div>
        </div>

        {/* 기준시간 + 새로고침 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{observationTime} 기준</span>
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
