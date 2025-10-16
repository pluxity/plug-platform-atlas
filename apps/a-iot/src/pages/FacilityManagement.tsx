import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@plug-atlas/ui'

export default function FacilityManagement() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">시설물 관리</h1>
        <p className="text-gray-600">IoT 시설 및 디바이스를 관리합니다.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>시설물 목록</CardTitle>
          <CardDescription>등록된 시설물과 디바이스를 확인하고 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">시설물 데이터가 없습니다.</p>
        </CardContent>
      </Card>
    </div>
  )
}
