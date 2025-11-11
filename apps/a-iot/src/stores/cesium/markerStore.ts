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
  ConstantPositionProperty,
  ConstantProperty,
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
      options.height ?? 1
    )

    const entity = viewer.entities.add({
      id: options.id,
      position: position,
      billboard: {
        image: options.image || '/images/icons/map/marker.png',
        width: options.width || 32,
        height: options.heightValue || 32,
        heightReference: options.heightReference ?? HeightReference.RELATIVE_TO_GROUND,
        scaleByDistance: options.disableScaleByDistance ? undefined : new NearFarScalar(100, 1.5, 5000, 0.3),
        disableDepthTestDistance: options.disableDepthTest ? Number.POSITIVE_INFINITY : undefined,
      },
      label: options.label
        ? {
            text: options.label,
            font: '14px SUIT',
            fillColor: options.labelColor
              ? Color.fromCssColorString(options.labelColor)
              : Color.BLACK,
            outlineColor: Color.WHITE,
            outlineWidth: 3,
            style: LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: VerticalOrigin.BOTTOM,
            pixelOffset: new Cartesian2(0, -(options.heightValue ? options.heightValue / 2 + 10 : 26)),
            heightReference: options.heightReference,
            show: true,
            disableDepthTestDistance: options.disableDepthTest ? Number.POSITIVE_INFINITY : undefined,
          }
        : undefined,
    })

    viewer.scene.requestRender()

    return entity
  },

  removeMarker: (viewer: CesiumViewer, id: string) => {
    const entity = viewer.entities.getById(id)
    if (entity) {
      viewer.entities.remove(entity)
      viewer.scene.requestRender()
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
      entity.position = new ConstantPositionProperty(position)
    }

    if (options.label !== undefined && entity.label) {
      entity.label.text = new ConstantProperty(options.label)
    }

    if (options.labelColor !== undefined && entity.label) {
      entity.label.fillColor = new ConstantProperty(
        Color.fromCssColorString(options.labelColor)
      )
    }

    viewer.scene.requestRender()
  },

  clearAllMarkers: (viewer: CesiumViewer) => {
    viewer.entities.removeAll()
    viewer.scene.requestRender()
  },
}))
