import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@plug-atlas/ui'
import { TreePine, Camera, Radio, Users, AlertCircle, CheckCircle2, MapPin } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import { Viewer as CesiumViewer, Cartesian3, Math as CesiumMath } from 'cesium'
import { useViewerStore, useTilesetStore, ION_ASSETS, DEFAULT_CAMERA_POSITION, TILESET_HEIGHT_OFFSETS, TILESET_AUTO_HIDE_THRESHOLD } from '../stores/cesium'

export default function Dashboard() {
  const cesiumContainerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { createViewer } = useViewerStore()
  const { loadIonTileset, loadAllIonTilesets, loadSeongnamTileset, setupTilesetsAutoHide, setupSeongnamAutoHide, applyHeightOffset } = useTilesetStore()

  useEffect(() => {
    if (!cesiumContainerRef.current) return

    let viewerInstance: CesiumViewer | null = null
    const cleanupFunctions: Array<() => void> = []

    const initializeViewer = async () => {
      try {
        setIsLoading(true)

        viewerInstance = createViewer(cesiumContainerRef.current!)

        viewerInstance.scene.globe.depthTestAgainstTerrain = true
        viewerInstance.scene.fog.enabled = true
        viewerInstance.scene.fog.density = 0.0002
        viewerInstance.scene.fog.screenSpaceErrorFactor = 2.0

        const destination = Cartesian3.fromDegrees(
          DEFAULT_CAMERA_POSITION.lon,
          DEFAULT_CAMERA_POSITION.lat,
          DEFAULT_CAMERA_POSITION.height
        )
        const orientation = {
          heading: CesiumMath.toRadians(DEFAULT_CAMERA_POSITION.heading || 0),
          pitch: CesiumMath.toRadians(DEFAULT_CAMERA_POSITION.pitch || -45),
          roll: CesiumMath.toRadians(DEFAULT_CAMERA_POSITION.roll || 0),
        }
        viewerInstance.camera.setView({ destination, orientation })

        await loadIonTileset(viewerInstance, ION_ASSETS.GOOGLE_PHOTOREALISTIC_3D_TILES, {
          maximumScreenSpaceError: 64,
          skipLevelOfDetail: true,
        })

        const tilesets = await loadAllIonTilesets(viewerInstance)
        const tilesetsCleanup = setupTilesetsAutoHide(viewerInstance, tilesets, TILESET_AUTO_HIDE_THRESHOLD)
        cleanupFunctions.push(tilesetsCleanup)

        const seongnamTileset = await loadSeongnamTileset(viewerInstance)
        if (seongnamTileset) {
          applyHeightOffset(seongnamTileset, TILESET_HEIGHT_OFFSETS.SEONGNAM)
          const seongnamCleanup = setupSeongnamAutoHide(viewerInstance, seongnamTileset, TILESET_AUTO_HIDE_THRESHOLD)
          cleanupFunctions.push(seongnamCleanup)
        }

        setIsLoading(false)
      } catch (err) {
        console.error('Failed to initialize viewer:', err)
        setError('지도를 로드하는 중 오류가 발생했습니다.')
        setIsLoading(false)
      }
    }

    initializeViewer()

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
      if (viewerInstance && !viewerInstance.isDestroyed()) {
        viewerInstance.destroy()
      }
    }
  }, [])
  const stats = [
    {
      title: '전체 공원',
      value: 12,
      icon: TreePine,
      description: '관리 중인 공원 수',
      badge: '사이트(위치)',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
    },
    {
      title: 'CCTV',
      value: 55,
      icon: Camera,
      description: '운영 중인 CCTV',
      badge: '장치 개수 확인',
      subBadge: '사이트별 확인',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      title: 'IoT 센서',
      value: 153,
      icon: Radio,
      description: '설치된 센서',
      badge: '사이트별',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
    },
    {
      title: '관리자',
      value: 12,
      icon: Users,
      description: '등록된 관리자',
      badge: '사이트별',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
    },
  ]

  const recentAlerts = [
    { id: 1, type: '중급 관람', message: 'CCTV 작동', status: 'error', time: '10분 전', bgColor: 'bg-red-50', textColor: 'text-red-700', icon: AlertCircle },
    { id: 2, type: '서부 관람', message: '센서 작동 점검', status: 'warning', time: '10분 전', bgColor: 'bg-orange-50', textColor: 'text-orange-700', icon: AlertCircle },
    { id: 3, type: '중급 관람', message: '센서 정상 확인', status: 'success', time: '10분 전', bgColor: 'bg-green-50', textColor: 'text-green-700', icon: CheckCircle2 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">대시보드</h1>
        <p className="text-gray-600">시민안심공원 서비스 현황</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className={`${stat.bgColor} border-none shadow-sm`}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-0.5">
                  <CardTitle className="text-xs font-medium text-gray-500">{stat.title}</CardTitle>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
                <div className={`p-2.5 rounded-full ${stat.iconBg}`}>
                  <Icon className={`size-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent className="flex gap-1.5">
                <Badge variant="secondary" className="text-xs font-normal px-2 py-0.5">
                  {stat.badge}
                </Badge>
                {stat.subBadge && (
                  <Badge variant="secondary" className="text-xs font-normal px-2 py-0.5">
                    {stat.subBadge}
                  </Badge>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 최근 알림 */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">최근 알림</CardTitle>
          <CardDescription className="text-xs">최근 발생한 이벤트 및 알림</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {recentAlerts.map((alert) => {
              const Icon = alert.icon
              return (
                <div key={alert.id} className={`flex items-center justify-between p-3 rounded-lg ${alert.bgColor}`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-full ${alert.bgColor.replace('50', '100')}`}>
                      <Icon className={`size-4 ${alert.textColor}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${alert.textColor}`}>{alert.type}</p>
                      <p className={`text-xs ${alert.textColor}`}>{alert.message}</p>
                    </div>
                  </div>
                  <span className={`text-xs ${alert.textColor}`}>{alert.time}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 공원 위치 지도 */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="size-5" />
            공원 위치 지도
          </CardTitle>
          <CardDescription className="text-xs">공원별 장치 현황 및 위치 정보</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
            <div
              ref={cesiumContainerRef}
              className="w-full h-full"
            />
            {isLoading && (
              <div className="absolute inset-0 bg-gray-100/80 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <span className="text-sm text-gray-600">지도 로딩 중...</span>
                </div>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <p className="text-red-500">{error}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 공원별 현황 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">공원별 장치 현황</CardTitle>
            <CardDescription className="text-xs">주요 공원 설치 장치 수</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {[
                { park: '중급 공원', cctv: 5, sensor: 12 },
                { park: '서부 공원', cctv: 3, sensor: 8 },
                { park: '북부 공원', cctv: 5, sensor: 15 },
                { park: '동부 공원', cctv: 4, sensor: 10 },
                { park: '남부 공원', cctv: 5, sensor: 11 },
              ].map((item) => (
                <div key={item.park} className="flex items-center justify-between py-2.5 border-b last:border-0 border-gray-100">
                  <span className="text-sm font-medium text-gray-700">{item.park}</span>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>CCTV {item.cctv}대</span>
                    <span>센서 {item.sensor}개</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">시스템 상태</CardTitle>
            <CardDescription className="text-xs">주요 시스템 운영 상태</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {[
                { name: '중급 공원', status: '정상', color: 'bg-[#0057E3]' },
                { name: '북부 공원', status: '오류', color: 'bg-[#EF4444]' },
                { name: '서부 공원', status: '주의', color: 'bg-[#F97316]' },
                { name: '남부 공원', status: '정상', color: 'bg-[#0057E3]' },
                { name: '동부 공원', status: '정상', color: 'bg-[#0057E3]' },
              ].map((system) => (
                <div key={system.name} className="flex items-center justify-between py-2.5 border-b last:border-0 border-gray-100">
                  <span className="text-sm font-medium text-gray-700">{system.name}</span>
                  <Badge className={`${system.color} text-white border-none hover:${system.color} text-xs px-3 py-0.5`}>
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
