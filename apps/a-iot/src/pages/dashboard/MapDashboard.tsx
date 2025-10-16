import { Badge, Card, CardContent, CardHeader, CardTitle } from '@plug-atlas/ui'
import { MapPin, Camera, Radio, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import ParkMapViewer from '../../components/ParkMapViewer'

interface Park {
  id: number
  name: string
  location: string
  cctv: number
  sensors: number
  status: 'normal' | 'warning' | 'error'
  coordinates: {
    longitude: number
    latitude: number
    height?: number
  }
  // TODO: POLYGON 영역 데이터 (나중에 추가)
  polygon?: {
    positions: Array<{ longitude: number; latitude: number }>
  }
}

export default function MapDashboard() {
  const [selectedPark, setSelectedPark] = useState<Park | null>(null)

  const parks: Park[] = [
    {
      id: 1,
      name: '중앙공원',
      location: '성남시 분당구 정자동',
      cctv: 12,
      sensors: 40,
      status: 'warning',
      coordinates: {
        longitude: 127.1088,
        latitude: 37.3595,
        height: 100,
      },
      // TODO: POLYGON 영역 추가
      // polygon: {
      //   positions: [
      //     { longitude: 127.108, latitude: 37.360 },
      //     { longitude: 127.109, latitude: 37.360 },
      //     { longitude: 127.109, latitude: 37.359 },
      //     { longitude: 127.108, latitude: 37.359 },
      //   ],
      // },
    },
    {
      id: 2,
      name: '서부공원',
      location: '성남시 중원구 상대원동',
      cctv: 10,
      sensors: 35,
      status: 'normal',
      coordinates: {
        longitude: 127.1288,
        latitude: 37.4301,
        height: 100,
      },
    },
    {
      id: 3,
      name: '동부공원',
      location: '성남시 수정구 신흥동',
      cctv: 8,
      sensors: 30,
      status: 'normal',
      coordinates: {
        longitude: 127.1588,
        latitude: 37.4401,
        height: 100,
      },
    },
    {
      id: 4,
      name: '남부공원',
      location: '성남시 분당구 야탑동',
      cctv: 6,
      sensors: 25,
      status: 'error',
      coordinates: {
        longitude: 127.1288,
        latitude: 37.4101,
        height: 100,
      },
    },
    {
      id: 5,
      name: '북부공원',
      location: '성남시 분당구 서현동',
      cctv: 12,
      sensors: 26,
      status: 'normal',
      coordinates: {
        longitude: 127.1088,
        latitude: 37.3795,
        height: 100,
      },
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500'
      case 'warning':
        return 'bg-yellow-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return '정상'
      case 'warning':
        return '주의'
      case 'error':
        return '오류'
      default:
        return '알 수 없음'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">대시보드 - 지도형</h1>
        <p className="text-gray-600">공원별 장치 현황 및 위치 정보</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 지도 영역 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-5" />
              공원 위치 지도 (Cesium 3D)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '600px' }}>
              <ParkMapViewer parks={parks} selectedPark={selectedPark} onSelectPark={setSelectedPark} />
            </div>

            {/* 범례 */}
            <div className="flex items-center gap-4 mt-4 text-sm">
              <span className="font-medium">상태:</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>정상</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>주의</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>오류</span>
              </div>
            </div>

            {/* POLYGON 기능 안내 */}
            <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
              💡 향후 POLYGON 기능으로 공원 영역을 표시할 예정입니다.
            </div>
          </CardContent>
        </Card>

        {/* 공원 정보 패널 */}
        <div className="space-y-4">
          {/* 선택된 공원 상세 정보 */}
          {selectedPark ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{selectedPark.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin className="size-4" />
                    {selectedPark.location}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">상태:</span>
                    <Badge variant={selectedPark.status === 'normal' ? 'default' : 'destructive'}>
                      {getStatusText(selectedPark.status)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="size-4 text-blue-600" />
                      <span className="text-sm font-medium">CCTV</span>
                    </div>
                    <span className="text-lg font-bold">{selectedPark.cctv}대</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="size-4 text-purple-600" />
                      <span className="text-sm font-medium">IoT 센서</span>
                    </div>
                    <span className="text-lg font-bold">{selectedPark.sensors}개</span>
                  </div>
                </div>

                {selectedPark.status !== 'normal' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                    <div className="flex gap-2">
                      <AlertCircle className="size-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-900">알림</p>
                        <p className="text-yellow-700 mt-1">
                          {selectedPark.status === 'warning'
                            ? '조도 센서에서 이상이 감지되었습니다.'
                            : 'CCTV 연결이 해제되었습니다.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500 py-8">
                  <MapPin className="size-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">지도에서 공원을 선택하세요</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 공원 목록 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">전체 공원 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {parks.map((park) => (
                  <button
                    key={park.id}
                    onClick={() => setSelectedPark(park)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedPark?.id === park.id
                        ? 'bg-blue-50 border-blue-300'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(park.status)}`} />
                        <span className="font-medium text-sm">{park.name}</span>
                      </div>
                      <div className="flex gap-3 text-xs text-gray-600">
                        <span>CCTV: {park.cctv}</span>
                        <span>센서: {park.sensors}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
