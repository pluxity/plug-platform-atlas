// External packages
import { useState, useMemo } from 'react'
import { AlertCircle, BatteryWarning, Camera, CheckCircle, Clock, Radio, TreePine, Users } from 'lucide-react'
import { Cell, Label, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

// @plug-atlas packages
import { useAdminUsers } from '@plug-atlas/api-hooks'
import { Card, CardContent, CardHeader, CardTitle, DataTable, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Spinner, Tabs, TabsList, TabsTrigger } from '@plug-atlas/ui'

// Internal imports
import WeatherCard from '@/components/weather/WeatherCard'
import AirQualityCard from '@/components/air-quality/AirQualityCard'
import CesiumMap from '@/components/map/CesiumMap'
import { batteryAlarmColumns, eventColumns, featureStatusColumns, parkBatteryColumns } from '@/pages/main/dashboard/columns'
import { useCctvList, useFeatures, useSites } from '@/services/hooks'
import { Event, FeatureResponse } from '@/services/types'
import { useEventStore, useNotificationStore } from '@/stores'
import { getAssetPath } from '@/utils/assetPath'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'parks'>('overview')
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null)
  const { data: sites = [] } = useSites()
  const { data: cctvs = [] } = useCctvList()
  const { data: sensors = [] } = useFeatures()
  const { data: users = [] } = useAdminUsers()
  const isEventStoreInitialized = useNotificationStore((state) => state.isInitialized)

  // eventStore에서 이벤트 조회 (중복 fetch 제거)
  const getEventsBySite = useEventStore((state) => state.getEventsBySite)
  const getAllEvents = useEventStore((state) => state.getAllEvents)

  const events = useMemo(() => {
    if (selectedSiteId) {
      return getEventsBySite(parseInt(selectedSiteId))
    }
    return getAllEvents()
  }, [selectedSiteId, getEventsBySite, getAllEvents, isEventStoreInitialized])

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

  // 전체 이벤트 상태별 통계 (최근 7일 기준, 미처리/진행중은 항상 포함)
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

  // 파이차트 데이터
  const chartData = useMemo(() => [
    { name: '미처리', value: eventStatusStats.active, fill: '#EF4444' },
    { name: '진행중', value: eventStatusStats.inProgress, fill: '#F59E0B' },
    { name: '해결됨', value: eventStatusStats.resolved, fill: '#10B981' },
  ].filter(item => item.value > 0), [eventStatusStats])

  // 공원별 이벤트 요약 (전체보기 우측 패널용)
  const parkEventSummary = useMemo(() => {
    return sites.map(site => {
      const siteEvents = getEventsBySite(site.id)
      const activeCount = siteEvents.filter(e => e.status === 'ACTIVE').length
      const inProgressCount = siteEvents.filter(e => e.status === 'IN_PROGRESS').length
      const sensorCount = sensors.filter(s => s.siteResponse?.id === site.id).length
      return { site, activeCount, inProgressCount, sensorCount }
    })
  }, [sites, sensors, getEventsBySite, isEventStoreInitialized])

  // 이벤트 필터: 미처리/진행중은 항상 표시, 해결됨은 최근 7일만
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

  // 공원별 이벤트 (parks 탭)
  const filteredEvents = useMemo(() => {
    if (!selectedSiteId) return []
    return filterRecentEvents(events)
  }, [events, selectedSiteId])

  // 전체 이벤트 (overview 탭)
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

  // 공원별 배터리 현황 (배터리 잔량 오름차순 — 낮은 것부터)
  const parkBatteryData = useMemo((): FeatureResponse[] => {
    if (!selectedSiteId) return []

    return sensors
      .filter(sensor => sensor.siteResponse?.id?.toString() === selectedSiteId && sensor.batteryLevel != null)
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
      {/* Row 0: Tabs + (공원선택) + Weather + Air Quality */}
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

      {/* ==================== 전체보기 레이아웃 ==================== */}
      {activeTab === 'overview' && (
        <>
          {/* 지도(3/5) + 우측 패널(2/5) — 지도 극대화 */}
          <div className="grid grid-cols-5 gap-3 flex-1 min-h-0">
            <Card className="col-span-3 overflow-hidden relative">
              <CesiumMap
                sites={sites}
                activeTab={activeTab}
                selectedSiteId={selectedSiteId}
                onSiteSelect={handleSiteSelect}
                sensors={sensors}
                className="h-full w-full"
              />
            </Card>

            <div className="col-span-2 flex flex-col gap-3 min-h-0">
              {/* Stats — 2x2 그리드 */}
              <div className="grid grid-cols-2 gap-2 shrink-0">
                {stats.map((stat) => (
                  <Card key={stat.title} className="py-2.5">
                    <CardContent className="flex items-center gap-3 px-4 py-0">
                      <div className={`p-2 rounded-xl shrink-0 ${stat.iconBg}`}>
                        <img src={stat.iconImage} alt={stat.title} className="size-5" />
                      </div>
                      <div>
                        <p className="text-lg font-bold leading-tight">{stat.value}</p>
                        <p className="text-[10px] text-gray-500">{stat.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* 이벤트 현황 */}
              <Card className="flex flex-col overflow-hidden flex-1 min-h-0">
                <CardHeader className="pb-1 shrink-0">
                  <CardTitle className="text-base font-bold">이벤트 현황</CardTitle>
                </CardHeader>

                {/* 파이차트 + 상태바 — 항상 보임 */}
                <CardContent className="shrink-0 pb-2">
                  {!isEventStoreInitialized ? (
                    <div className="flex items-center justify-center gap-2 text-gray-500 py-4">
                      <Spinner size="sm" />
                      <span>이벤트 로딩 중...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <ResponsiveContainer width={120} height={120}>
                        <PieChart>
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
                      </ResponsiveContainer>
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

                {/* 공원별 현황 — 스크롤 영역 */}
                <div className="border-t border-gray-100 flex-1 min-h-0 overflow-y-auto px-6 py-2">
                  <h4 className="text-xs font-semibold text-gray-700 mb-1.5 sticky top-0 bg-white py-1">공원별 현황</h4>
                  <div className="space-y-1">
                    {parkEventSummary.map(({ site, activeCount, inProgressCount, sensorCount }) => (
                      <div
                        key={site.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSiteSelect(site.id.toString())}
                      >
                        <div className="flex items-center gap-2">
                          <TreePine className="size-3.5 text-green-600" />
                          <span className="text-xs font-medium">{site.name}</span>
                          <span className="text-[10px] text-gray-400">센서 {sensorCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {activeCount > 0 && (
                            <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">미처리 {activeCount}</span>
                          )}
                          {inProgressCount > 0 && (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">진행중 {inProgressCount}</span>
                          )}
                          {activeCount === 0 && inProgressCount === 0 && (
                            <span className="text-[10px] text-green-600 font-medium">정상</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* 이벤트 리스트(3/5) + 배터리 알람(2/5) — 컴팩트 */}
          <div className="grid grid-cols-5 gap-3 shrink-0 h-[200px]">
            <Card className="col-span-3 flex flex-col overflow-hidden">
              <CardHeader className='px-5 py-2 shrink-0'>
                <CardTitle className="text-sm font-bold">이벤트 리스트 <span className="text-xs font-normal text-gray-400">최근 7일</span></CardTitle>
              </CardHeader>
              <CardContent className='px-5 pb-3 pt-0 flex-1 min-h-0'>
                {allFilteredEvents.length === 0 ? (
                  <div className="flex items-center justify-center text-gray-500 h-full">
                    이벤트가 없습니다.
                  </div>
                ) : (
                  <DataTable
                    maxHeight={145}
                    stickyHeader={true}
                    columns={eventColumns}
                    data={allFilteredEvents}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="col-span-2 flex flex-col overflow-hidden">
              <CardHeader className="px-5 py-2 shrink-0">
                <CardTitle className="text-sm font-bold">배터리 알람</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-3 pt-0 flex-1 min-h-0">
                {(() => {
                  const lowBatterySensors = sensors
                    .filter(sensor => sensor.batteryLevel && sensor.batteryLevel <= 20)
                    .sort((a, b) => a.id - b.id);

                  return lowBatterySensors.length === 0 ? (
                    <div className="flex items-center justify-center text-gray-500 h-full text-sm">
                      배터리 잔량 20% 이하 장치 없음
                    </div>
                  ) : (
                    <DataTable
                      maxHeight={145}
                      stickyHeader={true}
                      columns={batteryAlarmColumns}
                      data={lowBatterySensors}
                    />
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* ==================== 공원별 보기 레이아웃 ==================== */}
      {activeTab === 'parks' && (
        <>
          {/* 지도(2/5) + 장치 현황(3/5) — 장치 테이블 중심 */}
          <div className="grid grid-cols-5 gap-3 flex-1 min-h-0">
            <Card className="col-span-2 overflow-hidden relative">
              <CesiumMap
                sites={sites}
                activeTab={activeTab}
                selectedSiteId={selectedSiteId}
                onSiteSelect={handleSiteSelect}
                sensors={sensors}
                className="h-full w-full"
              />
            </Card>

            {selectedSiteId ? (
              <Card className="col-span-3 flex flex-col overflow-hidden">
                <CardHeader className="pb-1 shrink-0">
                  <CardTitle className="text-base font-bold">
                    {sites.find(site => site.id.toString() === selectedSiteId)?.name} | 장치 현황
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 flex flex-col">
                  <div className="flex items-center gap-3 text-sm mb-2 shrink-0">
                    <span className="text-gray-500">장비수 <span className="font-bold text-gray-800">{deviceStats.total}</span></span>
                    <span className="text-gray-300">|</span>
                    <span className="text-green-600">정상 <span className="font-bold">{deviceStats.connected}</span></span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-400">연결 끊김 <span className="font-bold text-red-500">{deviceStats.disconnected}</span></span>
                  </div>

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
              <Card className="col-span-3">
                <CardContent className="flex items-center justify-center h-full text-gray-400">
                  공원을 선택해주세요.
                </CardContent>
              </Card>
            )}
          </div>

          {/* 이벤트 리스트(3/5) + 배터리 현황(2/5) */}
          <div className="grid grid-cols-5 gap-3 shrink-0 h-[200px]">
            <Card className="col-span-3 flex flex-col overflow-hidden">
              <CardHeader className='px-5 py-2 shrink-0'>
                <CardTitle className="text-sm font-bold">이벤트 리스트 <span className="text-xs font-normal text-gray-400">최근 7일</span></CardTitle>
              </CardHeader>
              <CardContent className='px-5 pb-3 pt-0 flex-1 min-h-0'>
                {filteredEvents.length === 0 ? (
                  <div className="flex items-center justify-center text-gray-500 h-full">
                    {selectedSiteId ? '이벤트가 없습니다.' : '공원을 선택해주세요.'}
                  </div>
                ) : (
                  <DataTable
                    maxHeight={145}
                    stickyHeader={true}
                    columns={eventColumns}
                    data={filteredEvents}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="col-span-2 flex flex-col overflow-hidden">
              <CardHeader className="px-5 py-2 shrink-0">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <BatteryWarning className="size-4 text-orange-500" />
                  배터리 현황
                  {(batteryStats.critical > 0 || batteryStats.low > 0) && (
                    <span className="text-xs font-normal text-gray-400">
                      {batteryStats.critical > 0 && <span className="text-red-500 font-medium">교체필요 {batteryStats.critical}</span>}
                      {batteryStats.critical > 0 && batteryStats.low > 0 && ' · '}
                      {batteryStats.low > 0 && <span className="text-orange-500 font-medium">교체권장 {batteryStats.low}</span>}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-3 pt-0 flex-1 min-h-0">
                {parkBatteryData.length === 0 ? (
                  <div className="flex items-center justify-center text-gray-500 h-full text-sm">
                    {selectedSiteId ? '배터리 정보가 없습니다.' : '공원을 선택해주세요.'}
                  </div>
                ) : (
                  <DataTable
                    maxHeight={145}
                    stickyHeader={true}
                    columns={parkBatteryColumns}
                    data={parkBatteryData}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
