import { create } from 'zustand'
import { Viewer as CesiumViewer, Cartesian3, Math as CesiumMath, Rectangle, HeadingPitchRange, BoundingSphere } from 'cesium'
import type { CameraPosition } from './types'

type FocusTarget =
  | { lon: number; lat: number }
  | string // WKT format

const parseWKT = (wkt: string): { lon: number; lat: number; bounds?: Rectangle } | null => {
  const pointMatch = wkt.match(/POINT\s*\(\s*([-\d.]+)[,\s]+([-\d.]+)\s*\)/i)
  if (pointMatch && pointMatch[1] && pointMatch[2]) {
    return {
      lon: parseFloat(pointMatch[1]),
      lat: parseFloat(pointMatch[2]),
    }
  }

  const polygonMatch = wkt.match(/POLYGON\s*\(\s*\((.*?)\)\s*\)/i)
  if (polygonMatch && polygonMatch[1]) {
    const coordsStr = polygonMatch[1]
    const coords = coordsStr.split(',').map((pair) => {
      const parts = pair.trim().split(/\s+/)
      if (parts[0] && parts[1]) {
        return { lon: parseFloat(parts[0]), lat: parseFloat(parts[1]) }
      }
      return null
    }).filter((coord): coord is { lon: number; lat: number } => coord !== null)

    if (coords.length > 0) {
      const lons = coords.map((c) => c.lon)
      const lats = coords.map((c) => c.lat)
      const minLon = Math.min(...lons)
      const maxLon = Math.max(...lons)
      const minLat = Math.min(...lats)
      const maxLat = Math.max(...lats)

      const centerLon = (minLon + maxLon) / 2
      const centerLat = (minLat + maxLat) / 2

      return {
        lon: centerLon,
        lat: centerLat,
        bounds: Rectangle.fromDegrees(minLon, minLat, maxLon, maxLat),
      }
    }
  }

  return null
}

interface CameraState {

}

interface CameraActions {
  flyToPosition: (viewer: CesiumViewer, position: CameraPosition) => void
  setView: (viewer: CesiumViewer, position: CameraPosition) => void
  focusOn: (viewer: CesiumViewer, target: FocusTarget, distance?: number) => void
}

type CameraStore = CameraState & CameraActions

export const useCameraStore = create<CameraStore>(() => ({
  flyToPosition: (viewer: CesiumViewer, position: CameraPosition) => {
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(position.lon, position.lat, position.height),
      orientation: {
        heading: CesiumMath.toRadians(position.heading ?? 0),
        pitch: CesiumMath.toRadians(position.pitch ?? -45),
        roll: position.roll ?? 0,
      },
    })
  },

  setView: (viewer: CesiumViewer, position: CameraPosition) => {
    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(position.lon, position.lat, position.height),
      orientation: {
        heading: CesiumMath.toRadians(position.heading ?? 0),
        pitch: CesiumMath.toRadians(position.pitch ?? -45),
        roll: position.roll ?? 0,
      },
    })
  },

  focusOn: (viewer: CesiumViewer, target: FocusTarget, distance: number = 1500) => {
    let coord: { lon: number; lat: number } | null = null
    let bounds: Rectangle | undefined

    if (typeof target === 'string') {
      const parsed = parseWKT(target)
      if (!parsed) {
        console.error('Invalid WKT format:', target)
        return
      }
      coord = { lon: parsed.lon, lat: parsed.lat }
      bounds = parsed.bounds
    } else {
      coord = target
    }

    if (bounds) {
      viewer.camera.flyTo({
        destination: bounds,
        duration: 1.0,
      })
      return
    }

    const targetPosition = Cartesian3.fromDegrees(coord.lon, coord.lat, 0)
    const offset = new HeadingPitchRange(
      CesiumMath.toRadians(0),
      CesiumMath.toRadians(-45),
      distance
    )
    const boundingSphere = new BoundingSphere(targetPosition, 0)
    viewer.camera.flyToBoundingSphere(boundingSphere, {
      offset: offset,
      duration: 1.0,
    })
  },
}))
