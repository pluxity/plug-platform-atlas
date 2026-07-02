import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  DatePicker, Badge, DataTable,
} from '@plug-atlas/ui'
import type { Column } from '@plug-atlas/ui'
import { useCctvEvents, useInfiniteCctvEvents, useCctvList } from '@/services/hooks'
import type { CctvEventResponse } from '@/services/types'
import { getCctvEventTypeLabel, getCctvEventStatusInfo, cctvEventTypeOptions } from '../utils/cctvEventUtils'
import { formatDate, startOfDay, endOfDay, subtractDays } from '../utils/timeUtils'
import { type DateRange } from 'react-day-picker'
import CctvEventDetailModal from './modal/CctvEventDetailModal'

type Interval = 'HOUR' | 'DAY' | 'WEEK' | 'MONTH'

const intervalOptions = [
  { value: 'HOUR', label: '시간별' },
  { value: 'DAY', label: '일별' },
  { value: 'WEEK', label: '주별' },
  { value: 'MONTH', label: '월별' },
]

const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  value: (i + 1).toString(),
  label: `${i + 1}월`,
}))

function getYearOptions() {
  const cur = new Date().getFullYear()
  return Array.from({ length: 11 }, (_, i) => (cur - 5 + i).toString())
}

function getChartRange(
  interval: Interval,
  selectedDate: Date | undefined,
  dateRange: DateRange | undefined,
  selectedYear: string,
  selectedMonth: string,
) {
  const today = new Date()
  switch (interval) {
    case 'HOUR': {
      const d = selectedDate ?? today
      return { from: startOfDay(d), to: endOfDay(d) }
    }
    case 'DAY': {
      const f = dateRange?.from ?? subtractDays(today, 7)
      const t = dateRange?.to ?? today
      return { from: startOfDay(f), to: endOfDay(t) }
    }
    case 'WEEK': {
      const y = parseInt(selectedYear), m = parseInt(selectedMonth)
      return { from: new Date(y, m - 1, 1), to: new Date(y, m, 0, 23, 59, 59) }
    }
    case 'MONTH': {
      const y = parseInt(selectedYear)
      return { from: new Date(y, 0, 1), to: new Date(y, 11, 31, 23, 59, 59) }
    }
  }
}

function buildChartData(events: CctvEventResponse[], interval: Interval, fromDate: Date, toDate: Date) {
  const buckets = new Map<string, { 발생: number; 진행중: number; 종료: number }>()
  const init = () => ({ 발생: 0, 진행중: 0, 종료: 0 })

  switch (interval) {
    case 'HOUR':
      for (let h = 0; h < 24; h++) buckets.set(`${h.toString().padStart(2, '0')}시`, init())
      break
    case 'DAY': {
      const c = new Date(fromDate)
      while (c <= toDate) {
        buckets.set(`${(c.getMonth() + 1).toString().padStart(2, '0')}/${c.getDate().toString().padStart(2, '0')}`, init())
        c.setDate(c.getDate() + 1)
      }
      break
    }
    case 'WEEK': {
      const c = new Date(fromDate); let w = 1
      while (c <= toDate) { buckets.set(`${w}주차`, init()); c.setDate(c.getDate() + 7); w++ }
      break
    }
    case 'MONTH':
      for (let m = 1; m <= 12; m++) buckets.set(`${m}월`, init())
      break
  }

  for (const e of events) {
    const d = new Date(e.createdAt)
    let key: string
    switch (interval) {
      case 'HOUR': key = `${d.getHours().toString().padStart(2, '0')}시`; break
      case 'DAY': key = `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`; break
      case 'WEEK': key = `${Math.ceil(d.getDate() / 7)}주차`; break
      case 'MONTH': key = `${d.getMonth() + 1}월`; break
    }
    const b = buckets.get(key)
    if (!b) continue
    if (e.eventStatus === 'STARTED') b['발생']++
    else if (e.eventStatus === 'IN_PROGRESS') b['진행중']++
    else b['종료']++
  }

  return Array.from(buckets.entries()).map(([timestamp, counts]) => ({ timestamp, ...counts }))
}

export default function CctvEventSection() {
  const today = new Date()

  // 차트 컨트롤
  const [interval, setInterval] = useState<Interval>('HOUR')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today)
  const [chartDateRange, setChartDateRange] = useState<DateRange | undefined>(undefined)
  const [selectedYear, setSelectedYear] = useState(today.getFullYear().toString())
  const [selectedMonth, setSelectedMonth] = useState((today.getMonth() + 1).toString())

  // 목록 컨트롤
  const [eventTypeFilter, setEventTypeFilter] = useState('all')
  const [cameraFilter, setCameraFilter] = useState('all')
  const [listDateRange, setListDateRange] = useState<DateRange | undefined>(undefined)
  const [selectedEvent, setSelectedEvent] = useState<CctvEventResponse | null>(null)

  // 무한스크롤 감지
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (interval === 'DAY' && !chartDateRange) {
      setChartDateRange({ from: subtractDays(today, 7), to: today })
    }
  }, [interval])

  const dayRangeExceeded = useMemo(() => {
    if (interval !== 'DAY' || !chartDateRange?.from || !chartDateRange?.to) return false
    return (chartDateRange.to.getTime() - chartDateRange.from.getTime()) / 86_400_000 > 7
  }, [interval, chartDateRange])

  const chartRange = useMemo(
    () => getChartRange(interval, selectedDate, chartDateRange, selectedYear, selectedMonth),
    [interval, selectedDate, chartDateRange, selectedYear, selectedMonth],
  )
  const chartFrom = formatDate(chartRange.from, 'yyyyMMddHHmmss')
  const chartTo = formatDate(chartRange.to, 'yyyyMMddHHmmss')

  const listParams = useMemo(() => {
    const f = listDateRange?.from ?? subtractDays(new Date(), 7)
    const t = listDateRange?.to ?? new Date()
    return {
      from: formatDate(startOfDay(f), 'yyyyMMddHHmmss'),
      to: formatDate(endOfDay(t), 'yyyyMMddHHmmss'),
    }
  }, [listDateRange])

  const { data: chartEventsData } = useCctvEvents(
    { page: 1, size: 9999, from: chartFrom, to: chartTo },
    { refreshInterval: 30_000 },
  )
  const { events, isLoading, hasMore, loadMore, isValidating } = useInfiniteCctvEvents(
    listParams, 20, { refreshInterval: 30_000 },
  )
  const { data: cameras = [] } = useCctvList()

  const cameraNameMap = useMemo(() => {
    const map = new Map<string, string>()
    cameras.forEach((c) => map.set(c.edsCameraId, c.name))
    return map
  }, [cameras])

  const chartData = useMemo(() => {
    if (!chartEventsData?.content?.length) return []
    return buildChartData(chartEventsData.content, interval, chartRange.from, chartRange.to)
  }, [chartEventsData, interval, chartRange])

  const filteredEvents = useMemo(() => {
    let list = events
    if (eventTypeFilter !== 'all') list = list.filter((e) => e.eventType === eventTypeFilter)
    if (cameraFilter !== 'all') list = list.filter((e) => e.cameraId === cameraFilter)
    return list
  }, [events, eventTypeFilter, cameraFilter])

  const uniqueCameras = useMemo(() => {
    const ids = new Set(events.map((e) => e.cameraId))
    return Array.from(ids).map((id) => ({ id, name: cameraNameMap.get(id) || id }))
  }, [events, cameraNameMap])

  const yearOptions = getYearOptions()

  // 스크롤 하단 감지 → 자동 더보기
  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el || !hasMore || isValidating) return
    const { scrollTop, scrollHeight, clientHeight } = el
    if (scrollHeight - scrollTop - clientHeight < 100) {
      loadMore()
    }
  }, [hasMore, isValidating, loadMore])

  // 컨텐츠가 스크롤 영역을 못 채울 때 자동 로드
  useEffect(() => {
    const el = scrollRef.current
    if (!el || !hasMore || isValidating || isLoading) return
    if (el.scrollHeight <= el.clientHeight) {
      loadMore()
    }
  }, [events.length, hasMore, isValidating, isLoading, loadMore])

  const columns: Column<CctvEventResponse>[] = [
    {
      key: 'cameraId',
      header: '카메라',
      cell: (_, row) => {
        const name = cameraNameMap.get(row.cameraId)
        return (
          <div>
            <div className="text-sm font-medium">{name || row.cameraId}</div>
            {name && <div className="text-xs text-gray-400 font-mono">{row.cameraId}</div>}
          </div>
        )
      },
    },
    {
      key: 'eventType',
      header: '이벤트',
      cell: (_, row) => (
        <span className="text-sm font-medium">{getCctvEventTypeLabel(row.eventType)}</span>
      ),
    },
    {
      key: 'eventStatus',
      header: '상태',
      cell: (_, row) => {
        const info = getCctvEventStatusInfo(row.eventStatus)
        return <Badge className={`text-xs ${info.className}`}>{info.label}</Badge>
      },
    },
    {
      key: 'eventZoneName',
      header: '이벤트 구역',
      cell: (value) => value ? String(value) : '-',
    },
    {
      key: 'detectedVehicleNumber',
      header: '차량번호',
      cell: (value) => value ? (
        <Badge variant="outline" className="text-xs">{String(value)}</Badge>
      ) : '-',
    },
    {
      key: 'createdAt',
      header: '발생시간',
      cell: (_, row) => {
        if (!row.createdAt) return '-'
        return new Date(row.createdAt).toLocaleString('ko-KR', {
          month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit',
        })
      },
    },
  ]

  return (
    <div className="flex flex-col h-full gap-4">
      {/* ── 차트 영역 (고정 높이) ── */}
      <div className="shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold">통계 및 차트</h2>
          <div className="flex gap-2">
            <Select value={interval} onValueChange={(v) => setInterval(v as Interval)}>
              <SelectTrigger className="w-24 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {intervalOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>

            {interval === 'HOUR' && (
              <DatePicker mode="single" value={selectedDate} onChange={setSelectedDate} placeholder="날짜 선택" />
            )}
            {interval === 'DAY' && (
              <div className="flex items-center gap-2">
                <DatePicker mode="range" value={chartDateRange} onChange={setChartDateRange} placeholder="날짜 범위 (최대 7일)" />
                {dayRangeExceeded && <span title="최대 7일까지 선택 가능합니다"><AlertCircle className="h-4 w-4 text-red-500 shrink-0" /></span>}
              </div>
            )}
            {interval === 'WEEK' && (
              <>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-24 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{yearOptions.map((y) => <SelectItem key={y} value={y}>{y}년</SelectItem>)}</SelectContent>
                </Select>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-20 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{monthOptions.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                </Select>
              </>
            )}
            {interval === 'MONTH' && (
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-24 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{yearOptions.map((y) => <SelectItem key={y} value={y}>{y}년</SelectItem>)}</SelectContent>
              </Select>
            )}
          </div>
        </div>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 10, right: 5, left: -60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="timestamp" stroke="#6b7280" style={{ fontSize: '11px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '11px' }} />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="발생" stackId="stack" fill="#dc2626" />
              <Bar dataKey="진행중" stackId="stack" fill="#f59e0b" />
              <Bar dataKey="종료" stackId="stack" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[220px] text-gray-400 text-sm">차트 데이터가 없습니다.</div>
        )}
      </div>

      {/* ── 이벤트 목록 (나머지 영역, 내부 스크롤) ── */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex items-center justify-between shrink-0 mb-2">
          <h2 className="text-base font-bold">이벤트 목록</h2>
          <div className="flex gap-2">
            <DatePicker mode="range" value={listDateRange} onChange={setListDateRange} placeholder="날짜 범위 선택" />
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="이벤트 타입" /></SelectTrigger>
              <SelectContent>
                {cctvEventTypeOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={cameraFilter} onValueChange={setCameraFilter}>
              <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="카메라" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카메라</SelectItem>
                {uniqueCameras.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 min-h-0 overflow-y-auto"
        >
          {filteredEvents.length === 0 && !isLoading ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
              AI EDGE 이벤트가 없습니다.
            </div>
          ) : (
            <DataTable
              data={filteredEvents}
              columns={columns}
              onRowClick={(row) => setSelectedEvent(row)}
              stickyHeader
            />
          )}

          {(isLoading || isValidating) && hasMore && (
            <div className="flex items-center justify-center gap-2 py-4 text-gray-400 text-sm">
              <Loader2 className="size-4 animate-spin" />
              <span>로딩 중...</span>
            </div>
          )}
        </div>
      </div>

      <CctvEventDetailModal
        event={selectedEvent}
        cameraName={selectedEvent ? (cameraNameMap.get(selectedEvent.cameraId) || selectedEvent.cameraId) : ''}
        cameraLon={selectedEvent ? cameras.find((c) => c.edsCameraId === selectedEvent.cameraId)?.lon : undefined}
        cameraLat={selectedEvent ? cameras.find((c) => c.edsCameraId === selectedEvent.cameraId)?.lat : undefined}
        open={selectedEvent !== null}
        onOpenChange={(open) => { if (!open) setSelectedEvent(null) }}
      />
    </div>
  )
}
