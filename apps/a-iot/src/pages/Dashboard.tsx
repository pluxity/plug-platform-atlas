import { Card, CardContent, CardDescription, CardHeader, CardTitle, Column, DataTable, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsList, TabsTrigger } from '@plug-atlas/ui'
import { TreePine, Camera, Radio, Users, Map } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useSites } from '../services/hooks/useSite'
import { useCctvList } from '../services/hooks/useCctv'
import { FeatureResponse, useFeatures } from '@plug-atlas/web-core'
import { useAdminUsers } from '@plug-atlas/api-hooks'
import CesiumMap from '../components/CesiumMap'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'parks'>('overview')
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null)

  const { data: sites = [] } = useSites()
  const { data: cctvs = [] } = useCctvList()
  const { data: sensors = [] } = useFeatures()
  const { data: users = [] } = useAdminUsers()

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
        description: '관리 중인 공원 수',
        iconColor: 'text-green-600',
        iconBg: 'bg-green-100',
      },
      {
        title: 'CCTV',
        value: cctvs.length,
        icon: Camera,
        description: '운영 중인 CCTV',
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-100',
      },
      {
        title: 'IoT 센서',
        value: sensors.length,
        icon: Radio,
        description: '설치된 센서',
        iconColor: 'text-yellow-600',
        iconBg: 'bg-yellow-100',
      },
      {
        title: '관리자',
        value: users.length,
        icon: Users,
        description: '등록된 관리자',
        iconColor: 'text-purple-600',
        iconBg: 'bg-purple-100',
      },
    ]
  }, [sites, cctvs, sensors, users])

  const batteryAlarmColumns: Column<FeatureResponse>[] = [
    {
      key: 'id',
      header: '번호',
      cell: (value) => value ? String(value) : '-',
    },
    {
      key: 'name',
      header: '장치 이름',
      cell: (value) => value ? String(value) : '-',
    },
    {
      key: 'batteryLevel',
      header: '배터리 잔량',
      cell: (value) => (
        <div>
          {value ? `${value}%` : '-'}
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={(value) => {
          if (value === 'overview' || value === 'parks') {
            setActiveTab(value)
            if (value === 'overview') {
              setSelectedSiteId(null)
            }
          }
        }} variant="buttons">
          <TabsList className="justify-start">
            <TabsTrigger value="overview" icon={<Map className="size-4" />}>
              전체보기
            </TabsTrigger>
            <TabsTrigger value="parks" icon={<TreePine className="size-4" />}>
              공원별 보기
            </TabsTrigger>
          </TabsList> 
        </Tabs>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
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
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CesiumMap
            sites={sites}
            activeTab={activeTab}
            selectedSiteId={selectedSiteId}
            onSiteSelect={handleSiteSelect}
          />
        </CardContent>
      </Card>

      {activeTab === 'overview' && (
        <div className="space-y-6">

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-0.5">
                      <CardTitle className="font-medium text-lg text-gray-800">{stat.title}</CardTitle>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </div>
                    <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                      <Icon className={`size-5 ${stat.iconColor}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-800">{stat.description}</p>
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
            <CardHeader>
              <CardTitle className="text-lg">{sites.find(site => site.id.toString() === selectedSiteId)?.name} | 전체 장치 현황</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
             
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">이벤트 현황</CardTitle>
              </CardHeader>
              <CardContent>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">장치 배터리 알람</CardTitle>
                <CardDescription>배터리 잔량이 20% 이하인 장치</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  className="max-h-[300px] overflow-y-auto"
                  columns={batteryAlarmColumns}
                  data={
                    sensors
                    .filter(sensor => sensor.batteryLevel && sensor.batteryLevel < 100)
                    .sort((a, b) => a.id - b.id)}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  )
}
