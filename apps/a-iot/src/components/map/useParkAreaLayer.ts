import { useEffect, type RefObject } from 'react'
import { ConstantProperty, type Viewer } from 'cesium'
import type { Site } from '@/services/types'
import { usePolygonStore } from '@/stores/cesium'

/** Own only the park entities so toggling this layer never removes device markers. */
export function useParkAreaLayer(
  viewerRef: RefObject<Viewer | null>,
  sites: Site[],
  enabled: boolean,
  isLoading: boolean,
) {
  const { parseWktToCoordinates, displayGeoJSONFeatureCollection } = usePolygonStore()

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || isLoading || !enabled) return

    const features = sites.flatMap(site => {
      const coordinates = parseWktToCoordinates(site.location || '')
      if (coordinates.length < 3) return []
      return [{
        type: 'Feature' as const,
        properties: { id: site.id, name: site.name },
        geometry: { type: 'Polygon' as const, coordinates: [coordinates] },
      }]
    })
    const entities = displayGeoJSONFeatureCollection(viewer, { type: 'FeatureCollection', features }, feature => ({
      id: `park-area-${feature.properties.id}`,
      name: feature.properties.name,
      fillColor: 'rgba(16, 185, 129, 0.15)',
      outlineColor: '#059669',
      outlineWidth: 2,
      clampToGround: true,
      showLabel: true,
    }))

    // The shared GeoJSON renderer defaults to district entities; preserve park ownership.
    entities.forEach(entity => {
      if (entity.properties) entity.properties.type = new ConstantProperty('park-area')
    })
    viewer.scene.requestRender()

    return () => {
      if (viewer.isDestroyed()) return
      entities.forEach(entity => viewer.entities.remove(entity))
      viewer.scene.requestRender()
    }
  }, [viewerRef, sites, isLoading, enabled, parseWktToCoordinates, displayGeoJSONFeatureCollection])
}
