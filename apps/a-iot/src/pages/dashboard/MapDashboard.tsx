import { Card, CardContent, CardHeader, CardTitle } from '@plug-atlas/ui'
import { MapPin } from 'lucide-react'

export default function MapDashboard() {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">대시보드 - 지도형</h1>
        <p className="text-gray-600">공원별 장치 현황 및 위치 정보</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-5" />
            공원 위치 지도
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
            <p className="text-gray-500">지도 기능은 추후 구현 예정입니다.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
