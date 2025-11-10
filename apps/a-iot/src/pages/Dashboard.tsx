import { Card, CardContent, CardDescription, CardHeader, CardTitle, Column, DataTable, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Spinner, Tabs, TabsList, TabsTrigger } from '@plug-atlas/ui'
import { TreePine, Camera, Radio, Users, Map } from 'lucide-react'
import { useRef, useEffect, useState, useMemo } from 'react'
import { Viewer as CesiumViewer, Cartesian3, Math as CesiumMath, Color, Entity } from 'cesium'
import { useViewerStore, useTilesetStore, ION_ASSETS, DEFAULT_CAMERA_POSITION, TILESET_HEIGHT_OFFSETS, TILESET_AUTO_HIDE_THRESHOLD, usePolygonStore, useMarkerStore, useCameraStore } from '../stores/cesium'
import { useSites } from '../services/hooks/useSite'
import { useCctvList } from '../services/hooks/useCctv'
import { FeatureResponse, useFeatures } from '@plug-atlas/web-core'
import { useAdminUsers } from '@plug-atlas/api-hooks'

export default function Dashboard() {
  const cesiumContainerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<CesiumViewer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null)

  const { data: sites = [] } = useSites()
  const { data: cctvs = [] } = useCctvList()
  const { data: sensors = [] } = useFeatures()
  const { data: users = [] } = useAdminUsers()

  const { createViewer } = useViewerStore()
  const { loadIonTileset, loadAllIonTilesets, loadSeongnamTileset, setupTilesetsAutoHide, setupSeongnamAutoHide, applyHeightOffset } = useTilesetStore()
  const { displayWktPolygon, clearAllPolygons, parseWktToCoordinates } = usePolygonStore()
  const { addMarker, clearAllMarkers } = useMarkerStore()
  const { focusOn } = useCameraStore()

  useEffect(() => {
    if (!cesiumContainerRef.current) return

    let viewerInstance: CesiumViewer | null = null
    const cleanupFunctions: Array<() => void> = []

    const initializeViewer = async () => {
      try {
        setIsLoading(true)

        viewerInstance = createViewer(cesiumContainerRef.current!)
        viewerRef.current = viewerInstance

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
          maximumScreenSpaceError: 24,
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
      if (viewerInstance) {
        clearAllMarkers(viewerInstance)
        clearAllPolygons(viewerInstance)
        if (!viewerInstance.isDestroyed()) {
          viewerInstance.destroy()
        }
      }
      viewerRef.current = null
    }
  }, [clearAllMarkers, clearAllPolygons])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || isLoading) return

    const handleEntitySelected = (selectedEntity: Entity | undefined) => {
      if (!selectedEntity || !selectedEntity.id) return

      const entityId = selectedEntity.id.toString()
      
      if (entityId.startsWith('site-')) {
        const siteId = entityId.replace('site-', '')
        const clickedSite = sites.find(site => site.id.toString() === siteId)
        
        if (!clickedSite) return

        if (activeTab === 'overview') {
          setActiveTab('parks')
          setSelectedSiteId(siteId)
        } else if (activeTab === 'parks') {
          if (clickedSite.location?.trim()) {
            focusOn(viewer, clickedSite.location, 500)
          }
        }
      }
    }

    viewer.selectedEntityChanged.addEventListener(handleEntitySelected)

    return () => {
      if (!viewer.isDestroyed()) {
        viewer.selectedEntityChanged.removeEventListener(handleEntitySelected)
      }
    }
  }, [sites, isLoading, activeTab, focusOn])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || isLoading || !sites.length) return

    clearAllMarkers(viewer)
    clearAllPolygons(viewer)

    const zoomController = viewer.scene.screenSpaceCameraController;
    if(activeTab === 'parks') {
      zoomController.maximumZoomDistance = 4000;
    } else {
      zoomController.maximumZoomDistance = Number.POSITIVE_INFINITY;
    }

    const filteredSites = activeTab === 'parks' && selectedSiteId
      ? sites.filter(site => site.id.toString() === selectedSiteId)
      : sites

    filteredSites.forEach((site) => {
      if (site.location?.trim()) {
        displayWktPolygon(viewer, site.location, {
          name: `polygon-${site.id}`,
          height: 500, 
        })

        if (activeTab === 'overview') {
          const coordinates = parseWktToCoordinates(site.location)
          if (coordinates.length > 0) {
            const lons = coordinates.map((coord) => coord[0])
            const lats = coordinates.map((coord) => coord[1])
            const centerLon = (Math.min(...lons) + Math.max(...lons)) / 2
            const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2

            addMarker(viewer, {
              id: `site-${site.id}`,
              lon: centerLon,
              lat: centerLat,
              height: 520, 
              label: site.name,
              labelColor: Color.WHITE.toString(),
            })
          }
        }
      }
    })

    if (activeTab === 'parks' && selectedSiteId) {
      const filteredFeatures = sensors.filter(
        (feature) => feature.siteResponse?.id?.toString() === selectedSiteId
      )

      filteredFeatures.forEach((feature) => {
        if (feature.longitude && feature.latitude) {
          addMarker(viewer, {
            id: `device-${feature.id}`,
            lon: feature.longitude,
            lat: feature.latitude,
            label: feature.name,
            labelColor: Color.WHITE.toString(),
            height: 520, 
          })
        }
      })
    }

    if (activeTab === 'parks' && selectedSiteId && filteredSites.length > 0) {
      const selectedSite = filteredSites[0]
      if (selectedSite?.location?.trim()) {
        focusOn(viewer, selectedSite.location, 500)
      }
    }

    viewer.scene.requestRender()
  }, [sites, sensors, isLoading, activeTab, selectedSiteId, displayWktPolygon, parseWktToCoordinates, addMarker, clearAllMarkers, clearAllPolygons, focusOn])

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
          setActiveTab(value)
          if (value === 'overview') {
            setSelectedSiteId(null)
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
          <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
            <div
              ref={cesiumContainerRef}
              className="w-full h-full"
            />
            {isLoading && (
              <div className="absolute inset-0 bg-gray-100/80 flex items-center justify-center">
                <span className="flex items-center gap-2 text-sm text-gray-600"><Spinner size="sm" /> 지도 로딩 중...</span>
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
