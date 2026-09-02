import { useState, useMemo } from 'react'
import { AlertCircle, BatteryWarning, Camera, CheckCircle, ChevronDown, Clock, Radio, Scan, TreePine, Users } from 'lucide-react'
import { Cell, Label, Pie, PieChart, Tooltip } from 'recharts'

import { useAdminUsers } from '@plug-atlas/api-hooks'
import { Card, CardContent, CardHeader, CardTitle, DataTable, Dialog, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Spinner, Tabs, TabsList, TabsTrigger } from '@plug-atlas/ui'

import WeatherCard from '@/components/weather/WeatherCard'
import AirQualityCard from '@/components/air-quality/AirQualityCard'
import CesiumMap from '@/components/map/CesiumMap'
import { eventColumns, cctvEventColumns, featureStatusColumns } from '@/pages/main/dashboard/columns'
import { useCctvList, useCctvEvents, useFeatures, useSites } from '@/services/hooks'
import EventDetailModal from '@/pages/main/events/components/modal/EventDetailModal'
import CctvEventDetailModal from '@/pages/main/events/components/modal/CctvEventDetailModal'
import { Event, FeatureResponse } from '@/services/types'
import type { CctvEventResponse } from '@/services/types'
import { useEventStore, useNotificationStore } from '@/stores'
import { getAssetPath } from '@/utils/assetPath'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'parks'>('overview')
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedCctvEvent, setSelectedCctvEvent] = useState<CctvEventResponse | null>(null)
  const [isParkPanelOpen, setIsParkPanelOpen] = useState(true)
  const { data: sites = [] } = useSites()
  const { data: cctvs = [] } = useCctvList()
  const { data: cctvEventsData } = useCctvEvents({ size: 50 }, { refreshInterval: 30_000 })
  const { data: sensors = [] } = useFeatures()
  const { data: users = [] } = useAdminUsers()
  const isEventStoreInitialized = useNotificationStore((state) => state.isInitialized)

  const getEventsBySite = useEventStore((state) => state.getEventsBySite)
  const getAllEvents = useEventStore((state) => state.getAllEvents)

  const events = useMemo(() => {
    if (selectedSiteId) {
      return getEventsBySite(parseInt(selectedSiteId))
    }
    return getAllEvents()
  }, [selectedSiteId, getEventsBySite, getAllEvents, isEventStoreInitialized])

  const cameraNameMap = useMemo(() => {
    const map = new Map<string, string>()
    cctvs.forEach((c) => map.set(c.edsCameraId, c.name))
    return map
  }, [cctvs])

  const handleTabChange = (value: string) => {
    if (value === 'overview' || value === 'parks') {
      setActiveTab(value)
      if (value === 'overview') {
        setSelectedSiteId(null)
      } else if (value === 'parks' && !selectedSiteId && sites.length > 0) {
        const firstSite = sites[0]
        if (firstSite?.id != null) {
          setSelectedSiteId(String(firstSite.id))
        }
      }
    }
  }

  const handleSiteSelect = (siteId: string) => {
    setActiveTab('parks')
    setSelectedSiteId(siteId)
  }

  const stats = useMemo(() => {
    return [
      {
        title: '전체 공원',
        value: sites.length,
        icon: TreePine,
        iconImage: getAssetPath('/images/icons/dashboard/park.png'),
        description: '관리 중인 공원 수',
        iconBg: 'bg-green-100',
      },
      {
        title: 'IoT 센서',
        value: sensors.length,
        icon: Radio,
        description: '설치된 IoT센서',
        iconImage: getAssetPath('/images/icons/dashboard/sensor.png'),
        iconBg: 'bg-yellow-100',
      },
      {
        title: 'CCTV',
        value: cctvs.length,
        icon: Camera,
        description: '설치된 CCTV',
        iconImage: getAssetPath('/images/icons/dashboard/cctv.png'),
        iconBg: 'bg-blue-100',
      },
      {
        title: '관리자',
        value: users.length,
        icon: Users,
        description: '등록된 관리자',
        iconImage: getAssetPath('/images/icons/dashboard/user.png'),
        iconBg: 'bg-purple-100',
      },
    ]
  }, [sites, sensors, cctvs, users])

  const eventStatusStats = useMemo(() => {
    const allEvents = getAllEvents()
    const sevenDaysAgo = Date.now() - 7 * 86_400_000

    const active = allEvents.filter(e => e.status === 'ACTIVE').length
    const inProgress = allEvents.filter(e => e.status === 'IN_PROGRESS').length
    const resolved = allEvents.filter(e =>
      e.status === 'RESOLVED' && new Date(e.occurredAt).getTime() > sevenDaysAgo
    ).length

    return { active, inProgress, resolved, total: active + inProgress + resolved }
  }, [getAllEvents, isEventStoreInitialized])

  const chartData = useMemo(() => [
    { name: '미처리', value: eventStatusStats.active, fill: '#EF4444' },
    { name: '진행중', value: eventStatusStats.inProgress, fill: '#F59E0B' },
    { name: '해결됨', value: eventStatusStats.resolved, fill: '#10B981' },
  ].filter(item => item.value > 0), [eventStatusStats])

  const parkEventSummary = useMemo(() => {
    return sites.map(site => {
      const siteEvents = getEventsBySite(site.id)
      const activeCount = siteEvents.filter(e => e.status === 'ACTIVE').length
      const inProgressCount = siteEvents.filter(e => e.status === 'IN_PROGRESS').length
      const sensorCount = sensors.filter(s => s.siteResponse?.id === site.id).length
      return { site, activeCount, inProgressCount, sensorCount }
    })
  }, [sites, sensors, getEventsBySite, isEventStoreInitialized])

  const filterRecentEvents = (eventList: Event[]) => {
    const sevenDaysAgo = Date.now() - 7 * 86_400_000
    return eventList
      .filter(event => {
        if (!event.status || !event.level || event.level === 'NORMAL') return false
        if (event.status === 'ACTIVE' || event.status === 'IN_PROGRESS') return true
        return new Date(event.occurredAt).getTime() > sevenDaysAgo
      })
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
      .sort((a, b) => a.status === b.status ? 0 : a.status === 'ACTIVE' ? -1 : 1)
      .slice(0, 50)
  }

  const filteredEvents = useMemo(() => {
    if (!selectedSiteId) return []
    return filterRecentEvents(events)
  }, [events, selectedSiteId])

  const allFilteredEvents = useMemo(() => {
    return filterRecentEvents(getAllEvents())
  }, [getAllEvents, isEventStoreInitialized])

  const deviceStats = useMemo(() => {
    if (!selectedSiteId) return { total: 0, connected: 0, disconnected: 0 }

    const siteSensors = sensors.filter(sensor => sensor.siteResponse?.id?.toString() === selectedSiteId)
    const disconnected = siteSensors.filter(s => s.eventStatus === 'DISCONNECTED').length

    return { total: siteSensors.length, connected: siteSensors.length - disconnected, disconnected }
  }, [selectedSiteId, sensors])

  const featureStatusData = useMemo((): FeatureResponse[] => {
    if (!selectedSiteId) return []

    return sensors.filter(
      sensor => sensor.siteResponse?.id?.toString() === selectedSiteId
    ).sort((a, b) => a.name.localeCompare(b.name))
  }, [selectedSiteId, sensors])

  const parkBatteryData = useMemo((): FeatureResponse[] => {
    if (!selectedSiteId) return []

    return sensors
      .filter(sensor =>
        sensor.siteResponse?.id?.toString() === selectedSiteId &&
        sensor.batteryLevel != null &&
        sensor.batteryLevel <= 50
      )
      .sort((a, b) => (a.batteryLevel ?? 100) - (b.batteryLevel ?? 100))
  }, [selectedSiteId, sensors])

  const batteryStats = useMemo(() => {
    const critical = parkBatteryData.filter(s => (s.batteryLevel ?? 100) <= 10).length
    const low = parkBatteryData.filter(s => {
      const lvl = s.batteryLevel ?? 100
      return lvl > 10 && lvl <= 20
    }).length
    return { critical, low, total: parkBatteryData.length }
  }, [parkBatteryData])

  const OverviewIcon = ({ isActive }: { isActive: boolean }) => {
    const iconPath = isActive
      ? getAssetPath('/images/icons/dashboard/active_tab_overview.png')
      : getAssetPath('/images/icons/dashboard/tab_overview.png')

    return (
      <img
        src={iconPath}
        alt="전체보기"
        className="size-5"
      />
    )
  }

  const ParkIcon = ({ isActive }: { isActive: boolean }) => {
    const iconPath = isActive
      ? getAssetPath('/images/icons/dashboard/active_tab_park.png')
      : getAssetPath('/images/icons/dashboard/tab_park.png')

    return (
      <img
        src={iconPath}
        alt="공원별 보기"
        className="size-5"
      />
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] gap-3">
      <div className="flex items-center gap-4 shrink-0">
        <Tabs className="shadow-md inline-flex rounded-xl shrink-0" value={activeTab} onValueChange={handleTabChange} variant="buttons">
          <TabsList className="justify-start gap-0 !border-white rounded-xl">
            <TabsTrigger
              value="overview"
              icon={<OverviewIcon isActive={activeTab === 'overview'} />}
              className={`rounded-l-xl rounded-r-none rounded-bl-xl rounded-tr-none border-0 data-[state=active]:bg-white/80 data-[state=active]:shadow-none ${activeTab === 'overview' ? 'text-primary' : 'text-gray-600'}`}
            >
              <span className={`${activeTab === 'overview' ? 'text-primary' : 'text-gray-600'}`}>전체보기</span>
            </TabsTrigger>
            <TabsTrigger
              value="parks"
              icon={<ParkIcon isActive={activeTab === 'parks'} />}
              className={`!border-0 !border-l !border-gray-200 rounded-l-none rounded-r-lg data-[state=active]:bg-white/80 data-[state=active]:shadow-none ${activeTab === 'parks' ? 'text-primary' : 'text-gray-600'}`}
            >
              <span className={`${activeTab === 'parks' ? 'text-primary' : 'text-gray-600'}`}>
                공원별 보기
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === 'parks' && (
          <Select value={selectedSiteId || ''} onValueChange={setSelectedSiteId}>
            <SelectTrigger className="w-48 bg-white shadow-md shrink-0">
              <SelectValue placeholder="공원 선택" />
            </SelectTrigger>
            <SelectContent>
              {sites.map((site) => (
                <SelectItem key={site.id} value={site.id.toString()}>{site.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex gap-4 ml-auto">
          <WeatherCard
            siteId={activeTab === 'parks' ? selectedSiteId : null}
            sensors={sensors}
          />
          <AirQualityCard
            siteId={activeTab === 'parks' ? selectedSiteId : null}
            sensors={sensors}
            variant={activeTab === 'overview' ? 'overview' : 'detail'}
          />
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-12 gap-3 flex-1 min-h-0">
          {/* 좌측 — 지도. 공원 목록은 지도 위 오버레이라 공원이 늘어도 레이아웃 공간을 쓰지 않는다 */}
          <Card className="col-span-7 overflow-hidden relative">
            <CesiumMap
              sites={sites}
              activeTab={activeTab}
              selectedSiteId={selectedSiteId}
              onSiteSelect={handleSiteSelect}
              sensors={sensors}
              className="h-full w-full"
            />

            <div className="absolute top-4 left-4 z-10 w-64 rounded-lg bg-white/85 backdrop-blur-md shadow-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setIsParkPanelOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-white/60 transition-colors"
              >
                <span className="text-xs font-bold text-gray-900">
                  공원 현황
                  <span className="ml-1.5 font-normal text-gray-500">{parkEventSummary.length}</span>
                </span>
                <ChevronDown className={`size-4 text-gray-500 transition-transform ${isParkPanelOpen ? '' : '-rotate-90'}`} />
              </button>

              {isParkPanelOpen && (
                /* 한 행 32px 기준 5개까지 보이고 그 이상은 스크롤 */
                <div className="max-h-40 overflow-y-auto border-t border-gray-200/70">
                  {parkEventSummary.length === 0 ? (
                    <p className="px-3 py-3 text-xs text-gray-500">등록된 공원이 없습니다.</p>
                  ) : (
                    parkEventSummary.map(({ site, activeCount, inProgressCount, sensorCount }) => (
                      <button
                        key={site.id}
                        type="button"
                        onClick={() => handleSiteSelect(site.id.toString())}
                        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-white/70 transition-colors"
                      >
                        <span className="flex items-center gap-1.5 min-w-0">
                          <TreePine className="size-3.5 text-green-600 shrink-0" />
                          <span className="text-xs font-medium truncate">{site.name}</span>
                          <span className="text-[10px] text-gray-400 shrink-0">{sensorCount}</span>
                        </span>
                        {activeCount === 0 && inProgressCount === 0 ? (
                          <span className="text-[10px] font-medium text-green-600 shrink-0">정상</span>
                        ) : (
                          <span className="flex items-center gap-1 shrink-0">
                            {activeCount > 0 && (
                              <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">{activeCount}</span>
                            )}
                            {inProgressCount > 0 && (
                              <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">{inProgressCount}</span>
                            )}
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* 우측 — 실시간 이벤트 레일 */}
          <div className="col-span-5 flex flex-col gap-3 min-h-0">
            {/* 거의 변하지 않는 지표는 칩 한 줄로 */}
            <Card className="shrink-0">
              <CardContent className="flex items-center justify-between gap-2 px-4 py-2.5">
                {stats.map((stat) => (
                  <div key={stat.title} className="flex items-center gap-2 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${stat.iconBg}`}>
                      <img src={stat.iconImage} alt={stat.title} className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-bold leading-none">{stat.value}</p>
                      <p className="text-[10px] text-gray-500 truncate">{stat.title}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shrink-0">
              <CardHeader className="px-4 py-2 shrink-0">
                <CardTitle className="text-base font-bold">이벤트 현황</CardTitle>
              </CardHeader>
              <CardContent className="shrink-0 pb-2">
                {!isEventStoreInitialized ? (
                <div className="flex items-center justify-center gap-2 text-gray-500 py-4">
                  <Spinner size="sm" />
                  <span>이벤트 로딩 중...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                    <PieChart width={120} height={120}>
                      <Tooltip />
                      <Pie
                        data={eventStatusStats.total === 0
                          ? [{ name: '정상', value: 1, fill: '#10B981' }]
                          : chartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={30}
                        outerRadius={48}
                        strokeWidth={2}
                        stroke="#fff"
                      >
                        {(eventStatusStats.total === 0
                          ? [{ name: '정상', value: 1, fill: '#10B981' }]
                          : chartData
                        ).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                        <Label
                          position="center"
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                  {eventStatusStats.total === 0 ? (
                                    <>
                                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 2} className="fill-green-600 text-[10px] font-bold">이상</tspan>
                                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 12} className="fill-green-600 text-[10px] font-bold">없음</tspan>
                                    </>
                                  ) : (
                                    <>
                                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-lg font-bold">{eventStatusStats.total}</tspan>
                                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 14} className="fill-muted-foreground text-[10px]">총 이벤트</tspan>
                                    </>
                                  )}
                                </text>
                              )
                            }
                          }}
                        />
                      </Pie>
                    </PieChart>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 border-l-4 border-red-500">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="size-3.5 text-red-600" />
                        <span className="text-xs font-medium text-red-900">미처리</span>
                      </div>
                      <span className="text-base font-bold text-red-700">{eventStatusStats.active}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border-l-4 border-amber-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-amber-600" />
                        <span className="text-xs font-medium text-amber-900">진행중</span>
                      </div>
                      <span className="text-base font-bold text-amber-700">{eventStatusStats.inProgress}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-green-50 border-l-4 border-green-500">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="size-3.5 text-green-600" />
                        <span className="text-xs font-medium text-green-900">해결됨</span>
                      </div>
                      <span className="text-base font-bold text-green-700">{eventStatusStats.resolved}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            </Card>

            <Card padding="none" className="flex flex-col overflow-hidden flex-1 min-h-0">
              <CardHeader className='px-4 py-2 shrink-0'>
                <CardTitle className="text-sm font-bold">이벤트 리스트 <span className="text-xs font-normal text-gray-400">최근 7일</span></CardTitle>
              </CardHeader>
              <CardContent className='px-2 pb-2 pt-0 flex-1 min-h-0'>
                {allFilteredEvents.length === 0 ? (
                  <div className="flex items-center justify-center text-gray-500 h-full">
                    이벤트가 없습니다.
                  </div>
                ) : (
                  <DataTable
                    density="compact"
                    stickyHeader={true}
                    columns={eventColumns}
                    data={allFilteredEvents}
                    onRowClick={(row) => setSelectedEvent(row)}
                  />
                )}
              </CardContent>
            </Card>


            <Card padding="none" className="flex flex-col overflow-hidden flex-1 min-h-0">
              <CardHeader className='px-4 py-2 shrink-0'>
                <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                  <Scan className="size-4 text-blue-500" />
                  AI EDGE 이벤트
                </CardTitle>
              </CardHeader>
              <CardContent className='px-2 pb-2 pt-0 flex-1 min-h-0'>
                {!cctvEventsData?.content?.length ? (
                  <div className="flex items-center justify-center text-gray-500 h-full">
                    AI EDGE 이벤트가 없습니다.
                  </div>
                ) : (
                  <DataTable
                    density="compact"
                    stickyHeader={true}
                    columns={cctvEventColumns}
                    data={cctvEventsData.content}
                    onRowClick={(row) => setSelectedCctvEvent(row)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'parks' && (
        /* 공원별 탭은 이미 대상 공원이 정해진 상태라 지도는 위치 확인용 보조,
           주 데이터는 그 공원의 장치·이벤트다. 개요 탭과 지도/데이터 비중을 반대로 둔다. */
        <div className="grid grid-cols-12 gap-3 flex-1 min-h-0">
          {/* 좌측 — 지도 + 장비 요약 오버레이 (개요 탭 공원 오버레이와 같은 자리) */}
          <Card className="col-span-5 overflow-hidden relative">
            <CesiumMap
              sites={sites}
              activeTab={activeTab}
              selectedSiteId={selectedSiteId}
              onSiteSelect={handleSiteSelect}
              sensors={sensors}
              className="h-full w-full"
            />

            <div className="absolute top-4 left-4 z-10 rounded-lg bg-white/85 backdrop-blur-md shadow-lg px-3 py-2">
              <p className="text-xs font-bold text-gray-900 mb-1">
                {sites.find(site => site.id.toString() === selectedSiteId)?.name ?? '공원 미선택'}
              </p>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-gray-500">장비 <span className="font-bold text-gray-800">{deviceStats.total}</span></span>
                <span className="text-gray-300">|</span>
                <span className="text-green-600">정상 <span className="font-bold">{deviceStats.connected}</span></span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">끊김 <span className="font-bold text-red-500">{deviceStats.disconnected}</span></span>
              </div>
            </div>
          </Card>

          {/* 우측 — 장치·이벤트 데이터 레일 */}
          <div className="col-span-7 flex flex-col gap-3 min-h-0">
            {selectedSiteId ? (
              <Card padding="none" className="flex flex-col overflow-hidden flex-1 min-h-0">
                <CardHeader className="px-4 py-2 shrink-0">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    {sites.find(site => site.id.toString() === selectedSiteId)?.name} | 장치 현황
                    {(batteryStats.critical > 0 || batteryStats.low > 0) && (
                      <span className="flex items-center gap-1.5 text-xs font-normal">
                        <BatteryWarning className="size-4 text-orange-500" />
                        {batteryStats.critical > 0 && (
                          <span className="text-red-500 font-medium">교체필요 {batteryStats.critical}</span>
                        )}
                        {batteryStats.critical > 0 && batteryStats.low > 0 && <span className="text-gray-300">·</span>}
                        {batteryStats.low > 0 && (
                          <span className="text-orange-500 font-medium">교체권장 {batteryStats.low}</span>
                        )}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2 pb-2 pt-0 flex-1 min-h-0 flex flex-col">
                  <div className="flex-1 min-h-0">
                    {featureStatusData.length === 0 ? (
                      <div className="flex items-center justify-center text-gray-500 h-full">
                        장치가 없습니다.
                      </div>
                    ) : (
                      <DataTable
                        columns={featureStatusColumns}
                        data={featureStatusData}
                        stickyHeader={true}
                        className="h-full"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex-1 min-h-0">
                <CardContent className="flex items-center justify-center h-full text-gray-400">
                  공원을 선택해주세요.
                </CardContent>
              </Card>
            )}

            <Card padding="none" className="flex flex-col overflow-hidden flex-1 min-h-0">
              <CardHeader className='px-4 py-2 shrink-0'>
                <CardTitle className="text-sm font-bold">이벤트 리스트 <span className="text-xs font-normal text-gray-400">최근 7일</span></CardTitle>
              </CardHeader>
              <CardContent className='px-2 pb-2 pt-0 flex-1 min-h-0'>
                {filteredEvents.length === 0 ? (
                  <div className="flex items-center justify-center text-gray-500 h-full">
                    {selectedSiteId ? '이벤트가 없습니다.' : '공원을 선택해주세요.'}
                  </div>
                ) : (
                  <DataTable
                    density="compact"
                    stickyHeader={true}
                    columns={eventColumns}
                    data={filteredEvents}
                    onRowClick={(row) => setSelectedEvent(row)}
                  />
                )}
              </CardContent>
            </Card>

            <Card padding="none" className="flex flex-col overflow-hidden flex-1 min-h-0">
              <CardHeader className='px-4 py-2 shrink-0'>
                <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                  <Scan className="size-4 text-blue-500" />
                  AI EDGE 이벤트
                </CardTitle>
              </CardHeader>
              <CardContent className='px-2 pb-2 pt-0 flex-1 min-h-0'>
                {!cctvEventsData?.content?.length ? (
                  <div className="flex items-center justify-center text-gray-500 h-full">
                    AI EDGE 이벤트가 없습니다.
                  </div>
                ) : (
                  <DataTable
                    density="compact"
                    stickyHeader={true}
                    columns={cctvEventColumns}
                    data={cctvEventsData.content}
                    onRowClick={(row) => setSelectedCctvEvent(row)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Dialog
        open={selectedEvent !== null}
        onOpenChange={(open) => { if (!open) setSelectedEvent(null) }}
      >
        {selectedEvent && <EventDetailModal event={selectedEvent} />}
      </Dialog>

      <CctvEventDetailModal
        event={selectedCctvEvent}
        cameraName={selectedCctvEvent ? (cameraNameMap.get(selectedCctvEvent.cameraId) || selectedCctvEvent.cameraId) : ''}
        cameraLon={selectedCctvEvent ? cctvs.find((c) => c.edsCameraId === selectedCctvEvent.cameraId)?.lon : undefined}
        cameraLat={selectedCctvEvent ? cctvs.find((c) => c.edsCameraId === selectedCctvEvent.cameraId)?.lat : undefined}
        open={selectedCctvEvent !== null}
        onOpenChange={(open) => { if (!open) setSelectedCctvEvent(null) }}
      />
    </div>
  )
}
