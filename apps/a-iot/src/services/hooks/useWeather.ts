/**
 * 기상청 초단기실황 날씨 데이터 SWR 훅
 * 매 정시 +10분(HH:10)에 자동 갱신
 */
import { useEffect, useRef, useCallback, useMemo } from 'react'
import useSWR from 'swr'
import { fetchWeatherData, SEONGNAM_GRID, getKmaBaseDateTime, latLonToGrid } from '../weather'
import type { KmaGridPoint, WeatherData } from '../types/weather'
import type { FeatureResponse } from '../types/feature'

/** 다음 정시 10분(HH:10)까지 남은 ms 계산 */
function msUntilNextRefresh(): number {
  const now = new Date()
  const next = new Date(now)
  next.setMinutes(10, 0, 0)

  // 이미 10분이 지났으면 다음 시간의 10분
  if (now.getMinutes() >= 10) {
    next.setHours(next.getHours() + 1)
  }

  return next.getTime() - now.getTime()
}

/** 센서 목록에서 공원의 대표 격자 좌표를 계산 (첫 번째 유효 좌표 사용) */
function getGridFromSensors(sensors: FeatureResponse[], siteId: string): KmaGridPoint | null {
  const siteSensors = sensors.filter(
    (s) => s.siteResponse?.id?.toString() === siteId && s.latitude != null && s.longitude != null,
  )

  if (siteSensors.length === 0) return null

  const sensor = siteSensors[0]!
  const { nx, ny } = latLonToGrid(sensor.latitude!, sensor.longitude!)
  const siteName = sensor.siteResponse?.name ?? siteId

  return { name: siteName, nx, ny }
}

interface UseWeatherOptions {
  /** 선택된 공원 ID (없으면 성남시 전체) */
  siteId?: string | null
  /** 센서 목록 (공원별 격자 계산용) */
  sensors?: FeatureResponse[]
}

export function useWeather(options: UseWeatherOptions = {}) {
  const { siteId, sensors = [] } = options
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const grid: KmaGridPoint = useMemo(() => {
    if (siteId && sensors.length > 0) {
      return getGridFromSensors(sensors, siteId) ?? SEONGNAM_GRID
    }
    return SEONGNAM_GRID
  }, [siteId, sensors])

  const swrKey = () => {
    const { baseDate, baseTime } = getKmaBaseDateTime()
    return `weather-${grid.nx}-${grid.ny}-${baseDate}-${baseTime}`
  }

  const { data, error, isLoading, mutate } = useSWR<WeatherData>(
    swrKey(),
    () => fetchWeatherData(grid),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5 * 60 * 1000, // 5분
      errorRetryCount: 3,
    },
  )

  const refresh = useCallback(() => mutate(), [mutate])

  // 다음 HH:10에 자동 갱신 스케줄
  useEffect(() => {
    function schedule() {
      if (timerRef.current) clearTimeout(timerRef.current)
      const ms = msUntilNextRefresh()
      timerRef.current = setTimeout(() => {
        mutate()
        schedule() // 다음 갱신 재스케줄
      }, ms)
    }

    schedule()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [mutate])

  const observationTime = data
    ? `${data.baseDate.slice(0, 4)}-${data.baseDate.slice(4, 6)}-${data.baseDate.slice(6, 8)} ${data.baseTime.slice(0, 2)}:${data.baseTime.slice(2, 4)}`
    : null

  return {
    weather: data ?? null,
    isLoading,
    error,
    observationTime,
    gridName: grid.name,
    refresh,
  }
}
