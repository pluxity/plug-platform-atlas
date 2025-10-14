import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@plug-atlas/ui'

export default function Dashboard() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Plug Platform Admin</h1>
        <Badge variant="secondary">v1.0.0</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>사용자 관리</CardTitle>
            <CardDescription>시스템 사용자 및 권한 관리</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">총 사용자: 0명</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>시설 관리</CardTitle>
            <CardDescription>IoT 시설 및 디바이스 관리</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">총 시설: 0개</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>시스템 설정</CardTitle>
            <CardDescription>전역 설정 및 구성 관리</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">상태: 정상</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
