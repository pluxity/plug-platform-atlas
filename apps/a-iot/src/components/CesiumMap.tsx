import { useRef, useEffect, useState } from 'react'
import { Viewer as CesiumViewer, Cartesian3, Math as CesiumMath, Color, Entity, Cesium3DTileset, HeightReference } from 'cesium'
import { useViewerStore, useTilesetStore, useMarkerStore, usePolygonStore, useCameraStore, ION_ASSETS, DEFAULT_CAMERA_POSITION, TILESET_HEIGHT_OFFSETS, TILESET_AUTO_HIDE_THRESHOLD } from '../stores/cesium'
import { FeatureResponse } from '@plug-atlas/web-core'
import { SiteResponse } from '../services/api/site'
import MapControls from './MapControls'
import { Spinner } from '@plug-atlas/ui'

interface CesiumMapProps {
  sites?: SiteResponse[]
  sensors?: FeatureResponse[]
  activeTab?: 'overview' | 'parks'
  selectedSiteId?: string | null
  onSiteSelect?: (siteId: string) => void
  className?: string
}

export default function CesiumMap({
  sites = [],
  sensors = [],
  activeTab = 'overview',
  selectedSiteId = null,
  onSiteSelect,
  className = ''
}: CesiumMapProps) {
  const cesiumContainerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<CesiumViewer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [seongnamTilesetRef, setSeongnamTilesetRef] = useState<Cesium3DTileset | null>(null)

  const { createViewer, initializeResources } = useViewerStore()
  const { loadIonTileset, loadAllIonTilesets, loadSeongnamTileset, setupTilesetsAutoHide, setupSeongnamAutoHide, applyHeightOffset } = useTilesetStore()
  const { addMarker, clearAllMarkers } = useMarkerStore()
  const { displayWktPolygon, clearAllPolygons, parseWktToCoordinates } = usePolygonStore()
  const { focusOn } = useCameraStore()

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

        await initializeResources(viewerInstance)

        const tilesets = await loadAllIonTilesets(viewerInstance)
        const tilesetsCleanup = setupTilesetsAutoHide(viewerInstance, tilesets, TILESET_AUTO_HIDE_THRESHOLD)
        cleanupFunctions.push(tilesetsCleanup)

        const seongnamTileset = await loadSeongnamTileset(viewerInstance)
        if (seongnamTileset) {
          applyHeightOffset(seongnamTileset, TILESET_HEIGHT_OFFSETS.SEONGNAM)
          seongnamTileset.show = false
          setSeongnamTilesetRef(seongnamTileset)
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
              image: '/images/icons/map/park.png',
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
    }

    viewer.scene.requestRender()
  }, [sites, isLoading, activeTab, parseWktToCoordinates, addMarker, clearAllMarkers, clearAllPolygons])

  const handleToggleSeongnamTileset = (visible: boolean) => {
    if (seongnamTilesetRef) {
      seongnamTilesetRef.show = visible
    }
  }

  return (
    <div className={`relative w-full h-[600px] rounded-lg overflow-hidden ${className}`}>
      <div ref={cesiumContainerRef} className="w-full h-full" />

      <MapControls
        viewer={viewerRef.current}
        homePosition={DEFAULT_CAMERA_POSITION}
        onToggleSeongnamTileset={handleToggleSeongnamTileset}
        className="absolute bottom-4 right-4 z-10"
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
