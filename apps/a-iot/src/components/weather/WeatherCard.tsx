import {
  CloudRain,
  CloudSnow,
  Droplets,
  RefreshCw,
  Sun,
  Wind,
  CloudDrizzle,
  CloudSun,
} from 'lucide-react'
import { Card, CardContent } from '@plug-atlas/ui'
import { useWeather } from '@/services/hooks/useWeather'
import type { FeatureResponse } from '@/services/types'

/** 풍향(°) → 한국식 방위 변환 */
function degreeToDirection(deg: number): string {
  const directions = [
    '북풍', '북북동풍', '북동풍', '동북동풍',
    '동풍', '동남동풍', '남동풍', '남남동풍',
    '남풍', '남남서풍', '남서풍', '서남서풍',
    '서풍', '서북서풍', '북서풍', '북북서풍',
  ]
  const idx = Math.round(deg / 22.5) % 16
  return directions[idx] ?? '북풍'
}

/** 강수형태 코드 → 아이콘 + 라벨 */
function getPrecipInfo(pty: number) {
  switch (pty) {
    case 1: return { icon: CloudRain, label: '비', color: 'text-blue-600' }
    case 2: return { icon: CloudDrizzle, label: '비/눈', color: 'text-indigo-600' }
    case 3: return { icon: CloudSnow, label: '눈', color: 'text-sky-500' }
    case 5: return { icon: Droplets, label: '빗방울', color: 'text-blue-400' }
    case 6: return { icon: CloudDrizzle, label: '빗방울눈날림', color: 'text-indigo-400' }
    case 7: return { icon: CloudSnow, label: '눈날림', color: 'text-sky-400' }
    default: return { icon: Sun, label: '강수 없음', color: 'text-amber-500' }
  }
}

interface WeatherCardProps {
  siteId?: string | null
  sensors?: FeatureResponse[]
}

export default function WeatherCard({ siteId, sensors }: WeatherCardProps) {
  const { weather, isLoading, error, observationTime, gridName, refresh } = useWeather({ siteId, sensors })

  if (error) {
    return (
      <Card className="py-3">
        <CardContent className="flex items-center justify-between px-5 py-0">
          <div className="flex items-center gap-2 text-gray-400">
            <CloudSun className="size-5" />
            <span className="text-sm">날씨 정보를 불러올 수 없습니다</span>
          </div>
          <button onClick={refresh} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <RefreshCw className="size-4 text-gray-400" />
          </button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading || !weather) {
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

  const precip = getPrecipInfo(weather.precipType)
  const PrecipIcon = precip.icon
  const windDir = degreeToDirection(weather.windDirection)

  return (
    <Card className="py-3">
      <CardContent className="flex items-center justify-between px-5 py-0">
        {/* 날씨 정보 */}
        <div className="flex items-center gap-6">
          {/* 지역명 */}
          <span className="text-sm font-medium text-gray-700">{gridName}</span>

          <div className="h-6 w-px bg-gray-200" />

          {/* 강수형태 아이콘 + 기온 */}
          <div className="flex items-center gap-2">
            <PrecipIcon className={`size-6 ${precip.color}`} />
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{weather.temperature}</span>
              <span className="text-sm text-gray-500">°C</span>
            </div>
            <span className={`text-xs font-medium ${precip.color}`}>{precip.label}</span>
          </div>

          <div className="h-6 w-px bg-gray-200" />

          {/* 습도 */}
          <div className="flex items-center gap-1.5">
            <Droplets className="size-4 text-blue-400" />
            <span className="text-sm text-gray-600">{weather.humidity}%</span>
          </div>

          {/* 바람 */}
          <div className="flex items-center gap-1.5">
            <Wind className="size-4 text-teal-500" />
            <span className="text-sm text-gray-600">{windDir} {weather.windSpeed}m/s</span>
          </div>

          {/* 강수량 */}
          {weather.rainfall > 0 && (
            <div className="flex items-center gap-1.5">
              <CloudRain className="size-4 text-blue-500" />
              <span className="text-sm text-gray-600">{weather.rainfall}mm</span>
            </div>
          )}
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
