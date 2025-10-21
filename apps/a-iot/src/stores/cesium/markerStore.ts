import { create } from 'zustand'
import {
  Viewer as CesiumViewer,
  Cartesian3,
  Cartesian2,
  Entity,
  HeightReference,
  NearFarScalar,
  Color,
  LabelStyle,
  VerticalOrigin,
} from 'cesium'
import type { MarkerOptions } from './types'

interface MarkerState {}

interface MarkerActions {
  addMarker: (viewer: CesiumViewer, options: MarkerOptions) => Entity
  removeMarker: (viewer: CesiumViewer, id: string) => void
  updateMarker: (viewer: CesiumViewer, id: string, options: Partial<MarkerOptions>) => void
  clearAllMarkers: (viewer: CesiumViewer) => void
}

type MarkerStore = MarkerState & MarkerActions

export const useMarkerStore = create<MarkerStore>(() => ({
  addMarker: (viewer: CesiumViewer, options: MarkerOptions) => {
    const position = Cartesian3.fromDegrees(
      options.lon,
      options.lat,
      options.height ?? 0
    )

    const entity = viewer.entities.add({
      id: options.id,
      position: position,
      billboard: {
        image: options.image || '/images/icons/map/marker.png',
        width: options.width || 32,
        height: options.heightValue || 32,
        heightReference: HeightReference.RELATIVE_TO_GROUND,
        scaleByDistance: new NearFarScalar(100, 1.5, 5000, 0.3),
      },
      label: options.label
        ? {
            text: options.label,
            font: '14px sans-serif',
            fillColor: options.labelColor
              ? Color.fromCssColorString(options.labelColor)
              : Color.WHITE,
            outlineColor: Color.BLACK,
            outlineWidth: 2,
            style: LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: VerticalOrigin.BOTTOM,
            pixelOffset: new Cartesian2(0, -40),
          }
        : undefined,
    })

    return entity
  },

  removeMarker: (viewer: CesiumViewer, id: string) => {
    const entity = viewer.entities.getById(id)
    if (entity) {
      viewer.entities.remove(entity)
    }
  },

  updateMarker: (viewer: CesiumViewer, id: string, options: Partial<MarkerOptions>) => {
    const entity = viewer.entities.getById(id)
    if (!entity) return

    if (options.lon !== undefined && options.lat !== undefined) {
      const position = Cartesian3.fromDegrees(
        options.lon,
        options.lat,
        options.height ?? 0
      )
      entity.position = position as any
    }

    if (options.label !== undefined && entity.label) {
      entity.label.text = options.label as any
    }

    if (options.labelColor !== undefined && entity.label) {
      entity.label.fillColor = Color.fromCssColorString(options.labelColor) as any
    }
  },

  clearAllMarkers: (viewer: CesiumViewer) => {
    viewer.entities.removeAll()
  },
}))
