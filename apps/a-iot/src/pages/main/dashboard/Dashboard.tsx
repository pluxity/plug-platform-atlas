import { Card, CardContent, CardHeader, CardTitle, DataTable, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsList, TabsTrigger } from '@plug-atlas/ui'
import { TreePine, Camera, Radio, Users } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useSites } from '../../../services/hooks'
import { useCctvList } from '../../../services/hooks'
import { FeatureResponse, useFeatures } from '@plug-atlas/web-core'
import { useAdminUsers } from '@plug-atlas/api-hooks'
import CesiumMap from '../../../components/map/CesiumMap.tsx'
import { useEvents } from '../../../services/hooks'
import { getDashboardLevelStyle } from '../events/utils/levelUtils.ts'
import { batteryAlarmColumns, eventColumns, featureStatusColumns } from './columns.tsx'
import { getAssetPath } from '../../../utils/assetPath'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'parks'>('overview')
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null)
  const { data: sites = [] } = useSites()
  const { data: cctvs = [] } = useCctvList()
  const { data: sensors = [] } = useFeatures()
  const { data: users = [] } = useAdminUsers()
  const { data: events = [] } = useEvents(
    selectedSiteId ? { siteId: parseInt(selectedSiteId)} : undefined
  )

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
        title: 'CCTV',
        value: cctvs.length,
        icon: Camera,
        description: '운영 중인 CCTV',
        iconImage: getAssetPath('/images/icons/dashboard/cctv.png'),
        iconBg: 'bg-blue-100',
      },
      {
        title: 'IoT 센서',
        value: sensors.length,
        icon: Radio,
        description: '설치된 센서',
        iconImage: getAssetPath('/images/icons/dashboard/sensor.png'),
        iconBg: 'bg-yellow-100',
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
  }, [sites, cctvs, sensors, users])

  const filteredEvents = useMemo(() => {
    if (!selectedSiteId) return []
    return events
      .filter(event => event.status && event.level && event.level !== 'NORMAL')
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
      .slice(0, 50)
  }, [events, selectedSiteId])

  const deviceStats = useMemo(() => {
    if (!selectedSiteId) return { total: 0, disconnected: 0, danger: 0, warning: 0, caution: 0 }
    
    const siteSensors = sensors.filter(sensor => sensor.siteResponse?.id?.toString() === selectedSiteId)
    const totalDevices = siteSensors.length
    

    const deviceLatestEvents = events
      .filter(event => event.deviceId && event.level)
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
      .reduce((acc, event) => {
        if (!acc[event.deviceId]) {
          acc[event.deviceId] = { level: event.level, occurredAt: event.occurredAt }
        }
        return acc
      }, {} as Record<string, { level: string; occurredAt: string }>)
    
    const stats = Object.values(deviceLatestEvents).reduce(
      (acc, { level }) => {
        if (level === 'DISCONNECTED') acc.disconnected++
        else if (level === 'DANGER') acc.danger++
        else if (level === 'WARNING') acc.warning++
        else if (level === 'CAUTION') acc.caution++
        return acc
      },
      { disconnected: 0, danger: 0, warning: 0, caution: 0 }
    )
    
    return { total: totalDevices, ...stats }
  }, [selectedSiteId, sensors, events])

  const featureStatusData = useMemo((): FeatureResponse[] => {
    if (!selectedSiteId) return []
    
    return sensors.filter(
      sensor => sensor.siteResponse?.id?.toString() === selectedSiteId
    ).sort((a, b) => a.name.localeCompare(b.name))
  }, [selectedSiteId, sensors])

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
    <>
      <div className="mb-4">
        <Tabs className="shadow-md inline-flex rounded-xl" value={activeTab} onValueChange={handleTabChange} variant="buttons">
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
      </div>

      <Card className="mb-6">
          <div className="h-9 text-xl m-6 mb-3 font-bold flex items-center gap-2">
            <span>지도 보기</span>
            {activeTab === 'parks' && (
              <Select value={selectedSiteId || ''} onValueChange={setSelectedSiteId}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="공원 선택" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id.toString()}>{site.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        <CardContent>
          <CesiumMap
            sites={sites}
            activeTab={activeTab}
            selectedSiteId={selectedSiteId}
            onSiteSelect={handleSiteSelect}
            sensors={sensors}
            events={events}
          />
        </CardContent>
      </Card>

      {activeTab === 'overview' && (
        <div className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-0.5">
                      <CardTitle className="font-medium text-xl text-gray-800">{stat.title}</CardTitle>
                      <div className="text-3xl font-bold">{stat.value}</div>
                    </div>
                    <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                      <img 
                        src={stat.iconImage} 
                        alt={stat.title}
                        className="size-5"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-800">{stat.description}</p>
                  </CardContent>
                </Card>          
              )
            })}
          </div>

        </div>
      )}

      {activeTab === 'parks' && selectedSiteId && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="p-7 !pb-5">
              <CardTitle className="text-xl font-bold">{sites.find(site => site.id.toString() === selectedSiteId)?.name} | 전체 장치 현황</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4 p-7 pt-0">
             <div className="w-40 h-52">
               <div className="bg-zinc-200/50 rounded-lg p-5">
                 <div className="space-y-2">
                   <div className="flex items-center gap-1 text-sm whitespace-nowrap">
                     <div className="font-bold text-slate-400">총 장비수</div><span className="text-slate-400">|</span><div className="text-zinc-500 text-sm">{deviceStats.total.toLocaleString()}</div>
                   </div>
                   {(() => {
                     const disconnectedStyle = getDashboardLevelStyle('DISCONNECTED');
                     return (
                       <div className={`flex h-7 items-center gap-1 ${disconnectedStyle.bg} rounded-md p-2.5`}>
                         <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
                           <path fillRule="evenodd" clipRule="evenodd" d="M6.62497 0.798919C6.71114 0.454482 6.50158 0.105455 6.1569 0.019346C5.81222 -0.0667632 5.46295 0.142653 5.37678 0.48709L4.96481 2.13387C4.87863 2.4783 5.08819 2.82733 5.43287 2.91344C5.77755 2.99955 6.12682 2.79013 6.21299 2.44569L6.62497 0.798919ZM6.36287 3.70597C6.36287 3.35093 6.65088 3.06312 7.00618 3.06312H9.18139C9.929 3.06312 10.6459 3.35986 11.1744 3.88808C11.7031 4.41629 12 5.13271 12 5.87972C12 6.62672 11.7031 7.34313 11.1744 7.87135C10.6459 8.39956 9.929 8.69634 9.18139 8.69634H7.64886C7.29358 8.69634 7.00556 8.4085 7.00556 8.05346C7.00556 7.69842 7.29358 7.41061 7.64886 7.41061H9.18139C9.5877 7.41061 9.97737 7.24932 10.2647 6.96222C10.552 6.67512 10.7134 6.28574 10.7134 5.87972C10.7134 5.4737 10.552 5.08431 10.2647 4.79721C9.97737 4.51012 9.5877 4.34882 9.18139 4.34882H7.00618C6.65088 4.34882 6.36287 4.06101 6.36287 3.70597ZM3.27538 5.6474C3.52661 5.89845 3.52661 6.30548 3.27538 6.55653L1.7355 8.09534C1.44827 8.38376 1.2866 8.77451 1.2866 9.18148C1.2866 9.5881 1.44767 9.97827 1.73458 10.2666C2.02315 10.5533 2.41354 10.7143 2.8205 10.7143C3.22768 10.7143 3.61829 10.5532 3.9069 10.2661L4.82102 9.35265C5.07225 9.10159 5.47957 9.10159 5.73079 9.35265C5.98202 9.6037 5.98202 10.0108 5.73079 10.2618L4.81619 11.1758L4.81526 11.1766C4.28547 11.7039 3.56821 12 2.8205 12C2.07279 12 1.35552 11.7039 0.825732 11.1766L0.823872 11.1748C0.29624 10.6454 0 9.92864 0 9.18148C0 8.43425 0.29624 7.71749 0.823872 7.18807L0.8248 7.18713L2.36562 5.6474C2.61684 5.39635 3.02415 5.39635 3.27538 5.6474ZM0.0697999 2.82569C0.228689 2.50814 0.615102 2.37942 0.93288 2.5382L2.58081 3.36159C2.89859 3.52036 3.02739 3.90651 2.8685 4.22406C2.70961 4.54162 2.3232 4.67033 2.00542 4.51156L0.357493 3.68816C0.0397159 3.52939 -0.0890889 3.14325 0.0697999 2.82569ZM3.28052 0.355512C3.12163 0.0379569 2.73522 -0.0907579 2.41744 0.0680198C2.09967 0.226798 1.97086 0.612942 2.12975 0.930499L2.95371 2.57727C3.1126 2.89482 3.49901 3.02354 3.81679 2.86477C4.13457 2.70599 4.26338 2.31984 4.10449 2.00229L3.28052 0.355512Z" fill="#0B1FFF"/>
                         </svg>
                         <div className={`${disconnectedStyle.text} font-bold text-xs`}>연결 끊김</div><span className={`${disconnectedStyle.text} font-bold text-xs`}>|</span><div className="text-zinc-500">{deviceStats.disconnected}</div>
                       </div>
                     );
                   })()}

                   {(() => {
                     const dangerStyle = getDashboardLevelStyle('DANGER');
                     return (
                       <div className={`flex h-7 items-center gap-1 ${dangerStyle.bg} rounded-md p-2.5`}>
                         <span className={`flex items-center justify-center w-3 h-3 rounded-full ${dangerStyle.dot} flex-shrink-0`}></span>
                         <div className={`${dangerStyle.text} font-bold text-xs`}>위험</div><span className={`${dangerStyle.text} font-bold text-xs`}>|</span><div className="text-zinc-500">{deviceStats.danger}</div>
                       </div>
                     );
                   })()}

                   {(() => {
                     const warningStyle = getDashboardLevelStyle('WARNING');
                     return (
                       <div className={`flex h-7 items-center gap-1 ${warningStyle.bg} rounded-md p-2.5`}>
                         <span className={`flex items-center justify-center w-3 h-3 rounded-full ${warningStyle.dot} flex-shrink-0`}></span>
                         <div className={`${warningStyle.text} font-bold text-xs`}>경고</div><span className={`${warningStyle.text} font-bold text-xs`}>|</span><div className="text-zinc-500">{deviceStats.warning}</div>
                       </div>
                     );
                   })()}

                   {(() => {
                     const cautionStyle = getDashboardLevelStyle('CAUTION');
                     return (
                       <div className={`flex h-7 items-center gap-1 ${cautionStyle.bg} rounded-md p-2.5`}>
                         <span className={`flex items-center justify-center w-3 h-3 rounded-full ${cautionStyle.dot} flex-shrink-0`}></span>
                         <div className={`${cautionStyle.text} font-bold text-xs`}>주의</div><span className={`${cautionStyle.text} font-bold text-xs`}>|</span><div className="text-zinc-500">{deviceStats.caution}</div>
                       </div>
                     );
                   })()}
                 </div>
               </div>
             </div>
             <div className="flex-1 ">
              {featureStatusData.length === 0 ? (
                <div className="flex max-h-52 items-center justify-center text-gray-500">
                  장치가 없습니다.
                </div>
              ) : (
                <DataTable 
                  columns={featureStatusColumns}
                  data={featureStatusData}
                  maxHeight={208}
                  stickyHeader={true}
                />
              )}
             </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-5 gap-4">
            <Card className="col-span-3">
              <CardHeader className='p-7 pb-5'>
                <CardTitle className="text-xl font-bold">이벤트 현황</CardTitle>
                {/*<CardDescription>최근 발생한 이벤트를 확인할 수 있습니다. (최대 50개)</CardDescription>*/}
              </CardHeader>
              <CardContent className='p-7 pt-0'>
                {filteredEvents.length === 0 ? (
                  <div className="min-h-[300px] flex items-center justify-center text-gray-500">
                    이벤트가 없습니다.
                  </div>
                ) : (
                  <DataTable
                    maxHeight={300}
                    stickyHeader={true}
                    columns={eventColumns}
                    data={filteredEvents}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="text-xl font-bold">장치 배터리 알람</CardTitle>
                {/*<CardDescription>배터리 잔량이 20% 이하인 장치를 확인할 수 있습니다.</CardDescription>*/}
              </CardHeader>
              <CardContent>
                {(() => {
                  const lowBatterySensors = sensors
                    .filter(sensor => sensor.batteryLevel && sensor.batteryLevel <= 20)
                    .sort((a, b) => a.id - b.id);
                  
                  return lowBatterySensors.length === 0 ? (
                    <div className="min-h-[300px] flex items-center justify-center text-gray-500">
                      배터리 잔량이 20% 이하인 장치가 없습니다.
                    </div>
                  ) : (
                    <DataTable
                      maxHeight={300}
                      stickyHeader={true}
                      columns={batteryAlarmColumns}
                      data={lowBatterySensors}
                    />
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  )
}