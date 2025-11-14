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
  Event,
} from 'cesium'
import type { MarkerOptions } from './types'
import { createColoredSvgDataUrl } from '../../utils/svgMarkerUtils'

const blinkListeners = new Map<string, Event.RemoveCallback>()

interface MarkerState {}

interface MarkerActions {
  addMarker: (viewer: CesiumViewer, options: MarkerOptions) => Entity
  removeMarker: (viewer: CesiumViewer, id: string) => void
  updateMarker: (viewer: CesiumViewer, id: string, options: Partial<MarkerOptions>) => void
  clearAllMarkers: (viewer: CesiumViewer) => void
  changeMarkerColor: (viewer: CesiumViewer, markerId: string, svgName: string, newColor: string) => void
  startMarkerBlink: (viewer: CesiumViewer, markerId: string, duration?: number) => void
  stopMarkerBlink: (viewer: CesiumViewer, markerId: string) => void
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
        image: options.image || '/aiot/images/icons/map/marker.png',
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
    blinkListeners.forEach((removeCallback) => removeCallback())
    blinkListeners.clear()
    viewer.entities.removeAll()
    viewer.scene.requestRender()
  },

  changeMarkerColor: (viewer: CesiumViewer, markerId: string, svgName: string, newColor: string) => {
    const entity = viewer.entities.getById(markerId)
    if (!entity || !entity.billboard) return

    const newImageUrl = createColoredSvgDataUrl(svgName, newColor)
    if (!newImageUrl) return

    entity.billboard.image = new ConstantProperty(newImageUrl)
  },

  startMarkerBlink: (viewer: CesiumViewer, markerId: string, duration: number = 1000) => {
    const entity = viewer.entities.getById(markerId)
    if (!entity || !entity.billboard) return

    const existingListener = blinkListeners.get(markerId)
    if (existingListener) {
      existingListener()
      blinkListeners.delete(markerId)
    }

    const startTime = Date.now()

    const removeCallback = viewer.clock.onTick.addEventListener(() => {
      if (viewer.isDestroyed() || !entity.billboard) return

      const elapsed = Date.now() - startTime
      const progress = (elapsed % duration) / duration
      const alpha = 0.65 + Math.sin(progress * Math.PI * 2) * 0.35

      entity.billboard.color = new ConstantProperty(Color.WHITE.withAlpha(alpha))
    })

    blinkListeners.set(markerId, removeCallback)
  },

  stopMarkerBlink: (viewer: CesiumViewer, markerId: string) => {
    const removeCallback = blinkListeners.get(markerId)
    if (!removeCallback) return

    removeCallback()
    blinkListeners.delete(markerId)

    const entity = viewer.entities.getById(markerId)
    if (entity && entity.billboard) {
      entity.billboard.color = new ConstantProperty(Color.WHITE)
    }
  },
}))
