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

const DEFAULT_MARKER_CONFIG = {
  width: 32,
  height: 32,
  heightOffset: 1,
  labelFont: 'bold 13px SUIT',
  labelOutlineWidth: 0,
  labelPixelOffsetY: -26,
  scaleNear: { distance: 100, scale: 1.5 },
  scaleFar: { distance: 5000, scale: 0.3 },
} as const

const BLINK_CONFIG = {
  defaultDuration: 1000,
  alphaMin: 0.3,
  alphaMax: 1.0,
} as const

const HOVER_CONFIG = {
  scaleMultiplier: 1.3,
  transitionDuration: 200,
  labelFont: 'bold 14px SUIT',
} as const

interface MarkerState {
  hoveredMarkerId: string | null
}

interface MarkerActions {
  addMarker: (viewer: CesiumViewer, options: MarkerOptions) => Entity
  removeMarker: (viewer: CesiumViewer, id: string) => void
  updateMarker: (viewer: CesiumViewer, id: string, options: Partial<MarkerOptions>) => void
  clearAllMarkers: (viewer: CesiumViewer) => void
  changeMarkerColor: (viewer: CesiumViewer, markerId: string, svgName: string, newColor: string) => void
  startMarkerBlink: (viewer: CesiumViewer, markerId: string, duration?: number) => void
  stopMarkerBlink: (viewer: CesiumViewer, markerId: string) => void
  setMarkerHover: (viewer: CesiumViewer, markerId: string | null) => void
}

type MarkerStore = MarkerState & MarkerActions

export const useMarkerStore = create<MarkerStore>((set, get) => ({
  hoveredMarkerId: null,

  addMarker: (viewer: CesiumViewer, options: MarkerOptions) => {
    const position = Cartesian3.fromDegrees(
      options.lon,
      options.lat,
      options.height ?? DEFAULT_MARKER_CONFIG.heightOffset
    )

    const markerWidth = options.width || DEFAULT_MARKER_CONFIG.width
    const markerHeight = options.heightValue || DEFAULT_MARKER_CONFIG.height

    const scaleByDistance = options.disableScaleByDistance
      ? undefined
      : new NearFarScalar(
          DEFAULT_MARKER_CONFIG.scaleNear.distance,
          DEFAULT_MARKER_CONFIG.scaleNear.scale,
          DEFAULT_MARKER_CONFIG.scaleFar.distance,
          DEFAULT_MARKER_CONFIG.scaleFar.scale
        )

    const labelPixelOffset = options.label
      ? new Cartesian2(0, -(markerHeight / 2 + 10))
      : undefined

    const entity = viewer.entities.add({
      id: options.id,
      position: position,
      billboard: {
        image: options.image || '/aiot/images/icons/map/marker.png',
        width: markerWidth,
        height: markerHeight,
        heightReference: options.heightReference ?? HeightReference.RELATIVE_TO_GROUND,
        scaleByDistance: scaleByDistance,
        disableDepthTestDistance: options.disableDepthTest ? Number.POSITIVE_INFINITY : undefined,
      },
      label: options.label
        ? {
            text: options.label,
            font: DEFAULT_MARKER_CONFIG.labelFont,
            fillColor: Color.WHITE,
            backgroundColor: new Color(0.2, 0.2, 0.2, 0.85),
            backgroundPadding: new Cartesian2(8, 4),
            showBackground: true,
            style: LabelStyle.FILL,
            verticalOrigin: VerticalOrigin.BOTTOM,
            pixelOffset: labelPixelOffset,
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

  startMarkerBlink: (viewer: CesiumViewer, markerId: string, duration: number = BLINK_CONFIG.defaultDuration) => {
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
      const sinValue = Math.sin(progress * Math.PI * 2)
      const alphaRange = BLINK_CONFIG.alphaMax - BLINK_CONFIG.alphaMin
      const alpha = BLINK_CONFIG.alphaMin + (sinValue + 1) / 2 * alphaRange

      entity.billboard.color = new ConstantProperty(Color.WHITE.withAlpha(alpha))
      viewer.scene.requestRender()
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
      viewer.scene.requestRender()
    }
  },

  setMarkerHover: (viewer: CesiumViewer, markerId: string | null) => {
    const { hoveredMarkerId } = get()

    if (hoveredMarkerId && hoveredMarkerId !== markerId) {
      const prevEntity = viewer.entities.getById(hoveredMarkerId)
      if (prevEntity && prevEntity.label) {
        prevEntity.label.scale = new ConstantProperty(1.0)
        prevEntity.label.font = new ConstantProperty(DEFAULT_MARKER_CONFIG.labelFont)
        prevEntity.label.fillColor = new ConstantProperty(Color.WHITE)
        prevEntity.label.backgroundColor = new ConstantProperty(new Color(0.2, 0.2, 0.2, 0.85))
        prevEntity.label.backgroundPadding = new ConstantProperty(new Cartesian2(8, 4))
      }
    }

    if (markerId) {
      const entity = viewer.entities.getById(markerId)
      if (entity && entity.label) {
        entity.label.show = new ConstantProperty(true)
        entity.label.scale = new ConstantProperty(1.15)
        entity.label.font = new ConstantProperty(HOVER_CONFIG.labelFont)
        entity.label.fillColor = new ConstantProperty(Color.WHITE)
        entity.label.backgroundColor = new ConstantProperty(new Color(0.1, 0.4, 0.9, 0.95)) // 밝은 블루 배경
        entity.label.backgroundPadding = new ConstantProperty(new Cartesian2(10, 5))
      }
    }

    set({ hoveredMarkerId: markerId })
    viewer.scene.requestRender()
  },
}))
