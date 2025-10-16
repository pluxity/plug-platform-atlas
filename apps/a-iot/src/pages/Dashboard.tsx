import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@plug-atlas/ui'
import { TreePine, Camera, Radio, Users, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function Dashboard() {
  const stats = [
    {
      title: '전체 공원',
      value: 12,
      icon: TreePine,
      description: '관리 중인 공원 수',
      trend: '+2 (이번 달)',
      color: 'text-green-600',
    },
    {
      title: 'CCTV',
      value: 48,
      icon: Camera,
      description: '운영 중인 CCTV',
      trend: '정상 작동 중',
      color: 'text-blue-600',
    },
    {
      title: 'IoT 센서',
      value: 156,
      icon: Radio,
      description: '설치된 센서',
      trend: '147개 정상',
      color: 'text-purple-600',
    },
    {
      title: '관리자',
      value: 8,
      icon: Users,
      description: '등록된 관리자',
      trend: '5명 활동 중',
      color: 'text-orange-600',
    },
  ]

  const recentAlerts = [
    { id: 1, park: '중앙공원', message: '조도 센서 이상 감지', status: 'warning', time: '10분 전' },
    { id: 2, park: '서부공원', message: 'CCTV 연결 해제', status: 'error', time: '25분 전' },
    { id: 3, park: '동부공원', message: '정기 점검 완료', status: 'success', time: '1시간 전' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">대시보드 - 카드형</h1>
        <p className="text-gray-600">시민안심공원 서비스 현황</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`size-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-gray-600 mb-2">{stat.description}</p>
                <Badge variant="secondary" className="text-xs">
                  {stat.trend}
                </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 최근 알림 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 알림</CardTitle>
          <CardDescription>최근 발생한 이벤트 및 알림</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-4 p-3 border rounded-lg">
                {alert.status === 'success' && <CheckCircle2 className="size-5 text-green-600 mt-0.5" />}
                {alert.status === 'warning' && <AlertCircle className="size-5 text-yellow-600 mt-0.5" />}
                {alert.status === 'error' && <AlertCircle className="size-5 text-red-600 mt-0.5" />}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{alert.park}</p>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 공원별 현황 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>공원별 장치 현황</CardTitle>
            <CardDescription>주요 공원 설치 장치 수</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['중앙공원', '서부공원', '동부공원', '남부공원'].map((park, index) => (
                <div key={park} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{park}</span>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>CCTV: {12 - index * 2}</span>
                    <span>센서: {40 - index * 5}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>시스템 상태</CardTitle>
            <CardDescription>주요 시스템 운영 상태</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Mobius IoT 플랫폼', status: '정상' },
                { name: '영상 저장 서버', status: '정상' },
                { name: '알림 시스템', status: '정상' },
                { name: '백업 시스템', status: '대기' },
              ].map((system) => (
                <div key={system.name} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{system.name}</span>
                  <Badge variant={system.status === '정상' ? 'default' : 'secondary'}>
                    {system.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
