import { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { Viewer as CesiumViewer, Cartesian3, Math as CesiumMath, Entity, Cesium3DTileset, HeightReference, ScreenSpaceEventHandler, ScreenSpaceEventType, Cartesian2, ConstantProperty } from 'cesium'
import { throttle } from 'lodash-es'
import { useViewerStore, useTilesetStore, useMarkerStore, usePolygonStore, useCameraStore, useImageryStore, DEFAULT_CAMERA_POSITION, TILESET_HEIGHT_OFFSETS, TILESET_AUTO_HIDE_THRESHOLD, type ViewerInitOptions } from '../../stores/cesium'
import { Site, FeatureResponse, type FeatureDeviceTypeResponse } from '@/services/types'
import { fetchSeongnamDistricts, DISTRICT_COLORS, type VWorldFeatureCollection } from '../../services/vworld'
import MapControls from './MapControls'
import MapLayerSelector from './MapLayerSelector'
import { Spinner } from '@plug-atlas/ui'
import { SVG_MARKERS, type SvgMarkerType, createColoredSvgDataUrl, preloadAllMarkerSvgs } from '../../utils/svgMarkerUtils'
import { getAssetPath } from '../../utils/assetPath'
import { createCircularImageDataUrl } from '../../utils/circularImageUtils'

interface CesiumMapProps {
  sites?: Site[]
  activeTab?: 'overview' | 'parks'
  selectedSiteId?: string | null
  onSiteSelect?: (siteId: string) => void
  sensors?: FeatureResponse[]
  className?: string
  viewerInitOptions?: ViewerInitOptions
}

export default function CesiumMap({
  sites = [],
  activeTab = 'overview',
  selectedSiteId,
  onSiteSelect,
  sensors = [],
  className = '',
  viewerInitOptions
}: CesiumMapProps) {
  const cesiumContainerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<CesiumViewer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [seongnamTilesetRef, setSeongnamTilesetRef] = useState<Cesium3DTileset | null>(null)
  const [tilesetVisible, setTilesetVisible] = useState(false)
  const [districtVisible, setDistrictVisible] = useState(true)

  const { createViewer, initializeResources } = useViewerStore()
  const { loadAllIonTilesets, loadSeongnamTileset, setupTilesetsAutoHide, applyHeightOffset } = useTilesetStore()
  const { addMarker, clearAllMarkers, changeMarkerColor, startMarkerBlink, stopMarkerBlink, setMarkerHover } = useMarkerStore()
  const { clearAllPolygons, parseWktToCoordinates, displayGeoJSONFeatureCollection, clearDistrictPolygons } = usePolygonStore()
  const { focusOn, flyToPosition } = useCameraStore()
  const { setCurrentProvider } = useImageryStore()

  const districtDataRef = useRef<VWorldFeatureCollection | null>(null)


  const markerSvgTypeMapRef = useRef<Map<string, SvgMarkerType>>(new Map())

  const siteSensors = useMemo(() => {
    if (activeTab !== 'parks' || !selectedSiteId) return []

    return sensors.filter(sensor =>
      sensor.siteResponse?.id?.toString() === selectedSiteId &&
      sensor.longitude &&
      sensor.latitude
    )
  }, [sensors, activeTab, selectedSiteId])

  useEffect(() => {
    preloadAllMarkerSvgs()
  }, [])

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

        await initializeResources(viewerInstance, viewerInitOptions)

        const imageryProvider = viewerInitOptions?.imageryProvider
        if (imageryProvider === 'ion-default') {
          setCurrentProvider('ion-default')
        } else if (imageryProvider === 'ion-satellite') {
          setCurrentProvider('ion-satellite')
        } else if (!imageryProvider) {
          setCurrentProvider('ion-satellite')
        }

        if (viewerInitOptions?.load3DTiles !== false) {
          const tilesets = await loadAllIonTilesets(viewerInstance)
          const tilesetsCleanup = setupTilesetsAutoHide(viewerInstance, tilesets, TILESET_AUTO_HIDE_THRESHOLD)
          cleanupFunctions.push(tilesetsCleanup)

          const seongnamTileset = await loadSeongnamTileset(viewerInstance)
          if (seongnamTileset) {
            applyHeightOffset(seongnamTileset, TILESET_HEIGHT_OFFSETS.SEONGNAM)
            seongnamTileset.show = false
            setSeongnamTilesetRef(seongnamTileset)
          }
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
      markerSvgTypeMapRef.current.clear()
    }
  }, [clearAllMarkers, clearAllPolygons])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || isLoading) return

    const handleEntitySelected = (selectedEntity: Entity | undefined) => {
      if (!selectedEntity || !selectedEntity.id || !onSiteSelect) return

      const entityId = selectedEntity.id.toString()

      if (entityId.startsWith('park-')) {
        const siteId = entityId.replace('park-', '')
        const clickedSite = sites.find(site => site.id.toString() === siteId)

        if (!clickedSite) return

        if (activeTab === 'overview') {
          onSiteSelect(siteId)
        }
      }
      else if (entityId.startsWith('site-')) {
        const siteId = entityId.replace('site-', '')
        const clickedSite = sites.find(site => site.id.toString() === siteId)

        if (!clickedSite) return

        if (activeTab === 'overview') {
          onSiteSelect(siteId)
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
  }, [sites, isLoading, activeTab, focusOn, onSiteSelect])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || isLoading) return

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas)

    const handleMouseMove = throttle((endPosition: Cartesian2) => {
      const pickedObject = viewer.scene.pick(endPosition)
      const entity = pickedObject?.id
      const entityId = entity?.id?.toString()

      if (entityId?.startsWith('device-')) {
        setMarkerHover(viewer, entityId)
        viewer.scene.canvas.style.cursor = 'pointer'
      } else {
        setMarkerHover(viewer, null)
        if (entityId?.startsWith('park-')) {
          viewer.scene.canvas.style.cursor = 'pointer'
        } else {
          viewer.scene.canvas.style.cursor = 'default'
        }
      }
    }, 100)

    handler.setInputAction((movement: ScreenSpaceEventHandler.MotionEvent) => {
      handleMouseMove(movement.endPosition)
    }, ScreenSpaceEventType.MOUSE_MOVE)

    return () => {
      handleMouseMove.cancel()
      if (!handler.isDestroyed()) {
        handler.destroy()
      }
      if (!viewer.isDestroyed()) {
        viewer.scene.canvas.style.cursor = 'default'
      }
    }
  }, [isLoading, setMarkerHover])

  const getSvgMarkerType = (deviceType?: FeatureDeviceTypeResponse): SvgMarkerType => {
    if (!deviceType) return SVG_MARKERS.TEMPERATURE
    
    if (deviceType.description) {
      const desc = deviceType.description.toLowerCase()
      if (desc.includes('화재') || desc.includes('fire')) {
        return SVG_MARKERS.FIRE
      }
      if (desc.includes('변위') || desc.includes('displacement')) {
        return SVG_MARKERS.DISPLACEMENT
      }
      if (desc.includes('온도') || desc.includes('온습도') || desc.includes('temperature') || desc.includes('humidity')) {
        return SVG_MARKERS.TEMPERATURE
      }
    }
    
    return SVG_MARKERS.TEMPERATURE
  }

  const getEventLevelColor = (level?: string): string => {
    switch (level) {
      case 'NORMAL':
        return '#11C208'
      case 'WARNING':
        return '#F86700'
      case 'CAUTION':
        return '#FDC200'
      case 'DANGER':
        return '#CA0014'
      case 'DISCONNECTED':
        return '#9CA3AF'
      default:
        return '#11C208'
    }
  }


  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || isLoading || !sites.length) return

    let cancelled = false

    clearAllMarkers(viewer)
    clearAllPolygons(viewer)

    if (activeTab === 'overview') {
      const renderSiteMarkers = async () => {
        for (const site of sites) {
          if (cancelled) return
          if (site.location?.trim()) {
            const coordinates = parseWktToCoordinates(site.location)
            if (coordinates.length > 0) {
              const lons = coordinates.map((coord) => coord[0])
              const lats = coordinates.map((coord) => coord[1])
              const centerLon = (Math.min(...lons) + Math.max(...lons)) / 2
              const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2

              let markerImage: string
              let markerSize: number
              if (site.thumbnail?.url) {
                markerImage = await createCircularImageDataUrl(site.thumbnail.url)
                if (cancelled) return
                markerSize = 48
              } else {
                markerImage = getAssetPath('/images/icons/map/park.png')
                markerSize = 45
              }

              const entity = addMarker(viewer, {
                id: `park-${site.id}`,
                lon: centerLon,
                lat: centerLat,
                height: 20,
                image: markerImage,
                width: markerSize,
                heightValue: markerSize,
                label: site.name,
                labelColor: '#000000',
                heightReference: HeightReference.RELATIVE_TO_GROUND,
                disableDepthTest: true,
                disableScaleByDistance: true,
              })

              if (entity.label) {
                entity.label.show = new ConstantProperty(true)
              }
            }
          }
        }
        if (!cancelled) viewer.scene.requestRender()
      }
      renderSiteMarkers()
    } else if (activeTab === 'parks' && selectedSiteId) {
      siteSensors.forEach((sensor) => {
        const svgMarkerType = getSvgMarkerType(sensor.deviceTypeResponse)
        const deviceStatus = sensor.eventStatus // Feature의 eventStatus 직접 사용
        const color = getEventLevelColor(deviceStatus)
        
        const markerId = `device-${sensor.id}`
        markerSvgTypeMapRef.current.set(markerId, svgMarkerType)
        
        const imageUrl = createColoredSvgDataUrl(svgMarkerType, color)
        if (!imageUrl) return

        addMarker(viewer, {
          id: markerId,
          lon: sensor.longitude!,
          lat: sensor.latitude!,
          height: sensor.height || 10,
          image: imageUrl,
          width: 22,
          heightValue: 26,
          label: sensor.name || sensor.deviceId,
          labelColor: '#000000',
          heightReference: HeightReference.RELATIVE_TO_GROUND,
          disableDepthTest: true,
          disableScaleByDistance: true,
        })
      })
    }

    viewer.scene.requestRender()

    return () => { cancelled = true }
  }, [sites, isLoading, activeTab, selectedSiteId, sensors, parseWktToCoordinates, addMarker, clearAllMarkers, clearAllPolygons])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || isLoading || siteSensors.length === 0) return

    siteSensors.forEach((sensor) => {
      const markerId = `device-${sensor.id}`
      const svgMarkerType = markerSvgTypeMapRef.current.get(markerId)
      if (!svgMarkerType) return

      const deviceStatus = sensor.eventStatus // Feature의 eventStatus 직접 사용
      const color = getEventLevelColor(deviceStatus)

      changeMarkerColor(viewer, markerId, svgMarkerType, color)
    })

    viewer.scene.requestRender()
  }, [sensors, isLoading, siteSensors, changeMarkerColor])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || isLoading || siteSensors.length === 0) return

    const criticalMarkers = new Map<string, string>()
    siteSensors.forEach((sensor) => {
      const deviceStatus = sensor.eventStatus // Feature의 eventStatus 직접 사용
      if (deviceStatus === 'DANGER' || deviceStatus === 'WARNING') {
        criticalMarkers.set(`device-${sensor.id}`, deviceStatus)
      }
    })

    criticalMarkers.forEach((deviceStatus, markerId) => {
      const duration = deviceStatus === 'DANGER' ? 600 : 1000
      startMarkerBlink(viewer, markerId, duration)
    })

    return () => {
      if (!viewer.isDestroyed()) {
        criticalMarkers.forEach((_, markerId) => {
          stopMarkerBlink(viewer, markerId)
        })
      }
    }
  }, [sensors, isLoading, siteSensors, startMarkerBlink, stopMarkerBlink])

  const handleToggleSeongnamTileset = useCallback((visible: boolean) => {
    if (seongnamTilesetRef) {
      seongnamTilesetRef.show = visible
      setTilesetVisible(visible)
    }
  }, [seongnamTilesetRef])

  const handleToggleDistrictBoundary = useCallback(async (visible: boolean) => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return

    setDistrictVisible(visible)

    if (visible) {
      clearDistrictPolygons(viewer)

      if (!districtDataRef.current) {
        const data = await fetchSeongnamDistricts()
        if (data) {
          districtDataRef.current = data
        }
      }

      if (districtDataRef.current) {
        displayGeoJSONFeatureCollection(
          viewer,
          districtDataRef.current as any,
          (feature) => {
            const sigCd = feature.properties.sig_cd
            const colors = DISTRICT_COLORS[sigCd] || { fill: 'rgba(100, 100, 100, 0.2)', outline: '#666666' }
            return {
              id: `district-${sigCd}`,
              name: feature.properties.sig_kor_nm,
              fillColor: colors.fill,
              outlineColor: colors.outline,
              outlineWidth: 3,
              height: 0,
            }
          }
        )
      }
    } else {
      clearDistrictPolygons(viewer)
    }
  }, [displayGeoJSONFeatureCollection, clearDistrictPolygons])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || isLoading) return

    const controller = viewer.scene.screenSpaceCameraController
    if (activeTab === 'parks') {
      controller.maximumZoomDistance = 4000
    } else {
      controller.maximumZoomDistance = 50000000
    }

    if (activeTab === 'overview') {
      if (seongnamTilesetRef) {
        seongnamTilesetRef.show = false
        setTilesetVisible(false)
      }
      handleToggleDistrictBoundary(true)
      flyToPosition(viewer, DEFAULT_CAMERA_POSITION)
    } else if (activeTab === 'parks') {
      if (seongnamTilesetRef) {
        seongnamTilesetRef.show = true
        setTilesetVisible(true)
      }
      handleToggleDistrictBoundary(false)
      if (selectedSiteId) {
        const selectedSite = sites.find(site => site.id.toString() === selectedSiteId)
        if (selectedSite?.location?.trim()) {
          focusOn(viewer, selectedSite.location, 800, -30)
        }
      }
    }
  }, [selectedSiteId, activeTab, isLoading, sites, focusOn, flyToPosition, seongnamTilesetRef, handleToggleDistrictBoundary])


  return (
    <div className={`relative w-full rounded-lg overflow-hidden ${className || 'h-[600px]'}`}>
      <div ref={cesiumContainerRef} className="w-full h-full" />

      <MapLayerSelector
        viewer={viewerRef.current}
        className="absolute top-4 right-4 z-10"
      />

      <MapControls
        viewer={viewerRef.current}
        homePosition={DEFAULT_CAMERA_POSITION}
        onToggleSeongnamTileset={handleToggleSeongnamTileset}
        onToggleDistrictBoundary={handleToggleDistrictBoundary}
        seongnamVisible={tilesetVisible}
        districtVisible={districtVisible}
        className="absolute top-1/2 right-4 -translate-y-1/2 z-10"
      />

      {isLoading && (
        <div className="absolute inset-0 bg-gray-100/80 flex items-center justify-center">
          <span className="flex items-center gap-2 text-sm text-gray-600">
            <Spinner size="sm" /> 지도 로딩 중...
          </span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}
    </div>
  )
}
