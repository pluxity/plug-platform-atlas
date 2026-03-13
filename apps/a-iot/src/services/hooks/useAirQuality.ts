/**
 * 에어코리아 대기오염 데이터 SWR 훅
 * 매 정시 +10분(HH:10)에 자동 갱신
 */
import { useEffect, useRef, useCallback, useMemo } from 'react'
import useSWR from 'swr'
import { fetchAirQualityData, findNearestStation, DEFAULT_STATION } from '../airQuality'
import type { AirQualityData } from '../types/airQuality'
import type { FeatureResponse } from '../types/feature'

/** 다음 정시 10분(HH:10)까지 남은 ms 계산 */
function msUntilNextRefresh(): number {
  const now = new Date()
  const next = new Date(now)
  next.setMinutes(10, 0, 0)

  if (now.getMinutes() >= 10) {
    next.setHours(next.getHours() + 1)
  }

  return next.getTime() - now.getTime()
}

/** 센서 목록에서 가장 가까운 측정소 계산 */
function getStationFromSensors(sensors: FeatureResponse[], siteId: string) {
  const siteSensors = sensors.filter(
    (s) => s.siteResponse?.id?.toString() === siteId && s.latitude != null && s.longitude != null,
  )

  if (siteSensors.length === 0) return null

  const sensor = siteSensors[0]!
  return findNearestStation(sensor.latitude!, sensor.longitude!)
}

interface UseAirQualityOptions {
  siteId?: string | null
  sensors?: FeatureResponse[]
}

export function useAirQuality(options: UseAirQualityOptions = {}) {
  const { siteId, sensors = [] } = options
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const station = useMemo(() => {
    if (siteId && sensors.length > 0) {
      return getStationFromSensors(sensors, siteId) ?? DEFAULT_STATION
    }
    return DEFAULT_STATION
  }, [siteId, sensors])

  const swrKey = `airquality-${station.name}`

  const { data, error, isLoading, mutate } = useSWR<AirQualityData>(
    swrKey,
    () => fetchAirQualityData(station.name),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5 * 60 * 1000,
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
        schedule()
      }, ms)
    }

    schedule()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [mutate])

  return {
    airQuality: data ?? null,
    isLoading,
    error,
    stationName: station.name,
    observationTime: data?.dataTime ?? null,
    refresh,
  }
}
