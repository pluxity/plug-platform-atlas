import useSWR from 'swr'
import { useApiClient } from '@plug-atlas/api-hooks'
import { Button, DialogContent, DialogDescription, DialogHeader, DialogTitle, Spinner } from '@plug-atlas/ui'
import { useFeatureLatestData } from '@/services/hooks/useFeature'
import type { Event, FeatureResponse } from '@/services/types'
import { isSensorEvent } from '@/lib/event-presentation'
import { EVENT_SUMMARY_KEY } from '@/lib/event-summary'
import { getLevelInfo } from '@/pages/main/events/utils/levelUtils'

export default function SensorStatusModal({ sensor, onEventSelect }: {
  sensor: FeatureResponse
  onEventSelect: (event: Event) => void
}) {
  const client = useApiClient()
  const latest = useFeatureLatestData(sensor.deviceId, { refreshInterval: 10_000 })
  // Use the complete summary, not the dashboard's currently loaded event page.
  // Old unresolved events must also remain actionable from their sensor.
  const events = useSWR(EVENT_SUMMARY_KEY, async () => {
    const response = await client.get<{ data: Partial<Record<Event['status'], Event[]>> }>(EVENT_SUMMARY_KEY)
    if (!response.data || (response.data.ACTIVE != null && !Array.isArray(response.data.ACTIVE)) ||
      (response.data.IN_PROGRESS != null && !Array.isArray(response.data.IN_PROGRESS))) {
      throw new Error('이벤트 정보를 불러오지 못했습니다.')
    }
    return [...(response.data.ACTIVE ?? []), ...(response.data.IN_PROGRESS ?? [])]
  }, { refreshInterval: 30_000 })
  const sensorEvents = (events.data ?? []).filter(event =>
    isSensorEvent(event) && event.deviceId === sensor.deviceId &&
    (sensor.siteResponse?.id == null || event.siteId === sensor.siteResponse.id)
  )
  const level = getLevelInfo(sensor.eventStatus ?? '')
  const metrics = Object.entries(latest.data?.metrics ?? {})

  return <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
    <DialogHeader>
      <DialogTitle>{sensor.name || sensor.deviceId}</DialogTitle>
      <DialogDescription>IoT 센서의 현재 상태와 최신 측정값을 확인합니다.</DialogDescription>
    </DialogHeader>
    <div className="space-y-6 p-6">
      <section className="space-y-3 rounded-lg border bg-muted/30 p-4" aria-label="센서 상태">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">현재 상태</h3>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${level.badgeColor}`}>{level.text}</span>
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground">공원</dt><dd>{sensor.siteResponse?.name || '미등록'}</dd>
          <dt className="text-muted-foreground">장비 ID</dt><dd className="break-all">{sensor.deviceId}</dd>
          <dt className="text-muted-foreground">배터리</dt><dd>{sensor.batteryLevel == null ? '-' : `${sensor.batteryLevel}%`}</dd>
        </dl>
      </section>
      <section className="space-y-3" aria-label="최신 측정값">
        <h3 className="text-sm font-semibold">최신 측정값</h3>
        {latest.isLoading ? <div role="status" className="flex items-center gap-2 text-sm"><Spinner className="size-4" />측정값을 불러오는 중입니다.</div>
          : latest.error ? <div role="alert" className="text-sm text-destructive">측정값을 불러오지 못했습니다.<Button variant="link" size="sm" onClick={() => void latest.mutate()}>다시 시도</Button></div>
          : metrics.length === 0 ? <p className="rounded-lg border p-4 text-sm text-muted-foreground">수신된 측정값이 없습니다.</p>
          : <div className="grid grid-cols-2 gap-3">{metrics.map(([key, metric]) => {
            const profile = sensor.deviceTypeResponse?.profiles?.find(item => item.fieldKey === key)
            return <div key={key} className="min-w-0 rounded-lg border p-4">
              <p className="break-words text-xs text-muted-foreground">{profile?.description || key}</p>
              <p className="mt-2 break-words text-2xl font-semibold tabular-nums">{typeof metric.value === 'number' && Number.isFinite(metric.value) ? metric.value.toLocaleString('ko-KR', { maximumFractionDigits: 6 }) : '-'}<span className="ml-1 text-sm font-normal text-muted-foreground">{metric.unit || profile?.fieldUnit}</span></p>
            </div>
          })}</div>}
        {latest.data?.timestamp && <p className="text-xs text-muted-foreground">측정 시각: {new Date(latest.data.timestamp).toLocaleString('ko-KR')}</p>}
      </section>
      <section className="space-y-3" aria-label="조치할 이벤트">
        <h3 className="text-sm font-semibold">조치할 이벤트</h3>
        {events.isLoading ? <p role="status" className="text-sm text-muted-foreground">이벤트를 확인하는 중입니다.</p>
          : events.error ? <div role="alert" className="text-sm text-destructive">이벤트를 불러오지 못했습니다.<Button variant="link" size="sm" onClick={() => void events.mutate()}>다시 시도</Button></div>
          : sensorEvents.length === 0 ? <p className="rounded-lg border p-4 text-sm text-muted-foreground">조치할 이벤트가 없습니다.</p>
          : sensorEvents.map(event => <div key={event.eventId} className="flex items-center justify-between gap-3 rounded-lg border p-4">
            <div className="min-w-0 space-y-1">
              <p className="break-words text-sm font-medium">{event.title || event.eventName || event.profileDescription || '센서 이벤트'}</p>
              <p className="text-xs text-muted-foreground">{getLevelInfo(event.level).text} · {event.status === 'ACTIVE' ? '미처리' : '진행 중'}</p>
              <p className="text-xs text-muted-foreground">{new Date(event.occurredAt).toLocaleString('ko-KR')}</p>
            </div>
            <Button size="sm" className="shrink-0" onClick={() => onEventSelect(event)}>조치하기</Button>
          </div>)}
      </section>
    </div>
  </DialogContent>
}
