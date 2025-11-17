import { useRef, useEffect, useState } from 'react'
import { Viewer as CesiumViewer, Cartesian3, Math as CesiumMath, Entity, Cesium3DTileset, HeightReference } from 'cesium'
import { useViewerStore, useTilesetStore, useMarkerStore, usePolygonStore, useCameraStore, useImageryStore, DEFAULT_CAMERA_POSITION, TILESET_HEIGHT_OFFSETS, TILESET_AUTO_HIDE_THRESHOLD, type ViewerInitOptions } from '../../stores/cesium'
import { SiteResponse, FeatureResponse, type FeatureDeviceTypeResponse } from '@plug-atlas/web-core'
import MapControls from './MapControls.tsx'
import MapLayerSelector from './MapLayerSelector.tsx'
import { Spinner } from '@plug-atlas/ui'
import { preloadAllMarkerSvgs, createColoredSvgDataUrl, SVG_MARKERS, type SvgMarkerType } from '../../utils/svgMarkerUtils.ts'
import type { Event } from '../../services/types'
import { getAssetPath } from '../../utils/assetPath'

interface CesiumMapProps {
  sites?: SiteResponse[]
  activeTab?: 'overview' | 'parks'
  selectedSiteId?: string | null
  onSiteSelect?: (siteId: string) => void
  sensors?: FeatureResponse[]
  events?: Event[]
  className?: string
  viewerInitOptions?: ViewerInitOptions
}

export default function CesiumMap({
  sites = [],
  activeTab = 'overview',
  selectedSiteId,
  onSiteSelect,
  sensors = [],
  events = [],
  className = '',
  viewerInitOptions
}: CesiumMapProps) {
  const cesiumContainerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<CesiumViewer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [seongnamTilesetRef, setSeongnamTilesetRef] = useState<Cesium3DTileset | null>(null)

  const { createViewer, initializeResources } = useViewerStore()
  const { loadAllIonTilesets, loadSeongnamTileset, setupTilesetsAutoHide, applyHeightOffset } = useTilesetStore()
  const { addMarker, clearAllMarkers, changeMarkerColor } = useMarkerStore()
  const { clearAllPolygons, parseWktToCoordinates } = usePolygonStore()
  const { focusOn } = useCameraStore()
  const { setCurrentProvider } = useImageryStore()
  
  const markerSvgTypeMapRef = useRef<Map<string, SvgMarkerType>>(new Map())

  useEffect(() => {
    preloadAllMarkerSvgs()
  }, [])

  // Viewer 초기화
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
        return '#0B1FFF' 
      default:
        return '#11C208' 
    }
  }

  const getDeviceEventLevel = (deviceId: string): string | undefined => {
    const deviceEvents = events.filter(e => e.deviceId === deviceId)
    if (deviceEvents.length === 0) return undefined
    
    const sortedEvents = deviceEvents.sort((a, b) => 
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    )
    return sortedEvents[0]?.level
  }

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || isLoading || !sites.length) return

    clearAllMarkers(viewer)
    clearAllPolygons(viewer)

    if (activeTab === 'overview') {
      sites.forEach((site) => {
        if (site.location?.trim()) {
          const coordinates = parseWktToCoordinates(site.location)
          if (coordinates.length > 0) {
            const lons = coordinates.map((coord) => coord[0])
            const lats = coordinates.map((coord) => coord[1])
            const centerLon = (Math.min(...lons) + Math.max(...lons)) / 2
            const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2

            addMarker(viewer, {
              id: `park-${site.id}`,
              lon: centerLon,
              lat: centerLat,
              height: 20,
              image: getAssetPath('/images/icons/map/park.png'),
              width: 45,
              heightValue: 55,
              label: site.name,
              labelColor: '#000000',
              heightReference: HeightReference.RELATIVE_TO_GROUND,
              disableDepthTest: true,
              disableScaleByDistance: true,
            })
          }
        }
      })
    } else if (activeTab === 'parks' && selectedSiteId) {
      
      const siteSensors = sensors.filter(sensor => 
        sensor.siteResponse?.id?.toString() === selectedSiteId &&
        sensor.longitude &&
        sensor.latitude
      )

      siteSensors.forEach((sensor) => {
        const svgMarkerType = getSvgMarkerType(sensor.deviceTypeResponse)
        const eventLevel = getDeviceEventLevel(sensor.deviceId)
        const color = getEventLevelColor(eventLevel)
        
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
  }, [sites, isLoading, activeTab, selectedSiteId, sensors, parseWktToCoordinates, addMarker, clearAllMarkers, clearAllPolygons])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || isLoading || activeTab !== 'parks' || !selectedSiteId) return

    const siteSensors = sensors.filter(sensor => 
      sensor.siteResponse?.id?.toString() === selectedSiteId &&
      sensor.longitude &&
      sensor.latitude
    )

    siteSensors.forEach((sensor) => {
      const markerId = `device-${sensor.id}`
      const svgMarkerType = markerSvgTypeMapRef.current.get(markerId)
      if (!svgMarkerType) return

      const eventLevel = getDeviceEventLevel(sensor.deviceId)
      const color = getEventLevelColor(eventLevel)
      
      changeMarkerColor(viewer, markerId, svgMarkerType, color)
    })

    viewer.scene.requestRender()
  }, [events, isLoading, activeTab, selectedSiteId, sensors, changeMarkerColor])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || isLoading) return
  
    const controller = viewer.scene.screenSpaceCameraController
    if (activeTab === 'parks') {
      controller.maximumZoomDistance = 4000 
    } else {
      controller.maximumZoomDistance = 50000000 
    }
  
    if (activeTab === 'parks' && selectedSiteId) {
      const selectedSite = sites.find(site => site.id.toString() === selectedSiteId)
      if (selectedSite?.location?.trim()) {
        focusOn(viewer, selectedSite.location, 500)
      }
    }
  }, [selectedSiteId, activeTab, isLoading, sites, focusOn])

  const handleToggleSeongnamTileset = (visible: boolean) => {
    if (seongnamTilesetRef) {
      seongnamTilesetRef.show = visible
    }
  }

  return (
    <div className={`relative w-full h-[600px] rounded-lg overflow-hidden ${className}`}>
      <div ref={cesiumContainerRef} className="w-full h-full" />

      <MapLayerSelector
        viewer={viewerRef.current}
        className="absolute top-4 right-4 z-10"
      />

      <MapControls
        viewer={viewerRef.current}
        homePosition={DEFAULT_CAMERA_POSITION}
        onToggleSeongnamTileset={handleToggleSeongnamTileset}
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
