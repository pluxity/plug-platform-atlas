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
import { getAssetPath } from '../../utils/assetPath'
import type { MarkerOptions } from './types'
import { createColoredSvgDataUrl } from '../../utils/svgMarkerUtils'

const blinkListeners = new Map<string, Event.RemoveCallback>()

const DEFAULT_MARKER_CONFIG = {
  width: 32,
  height: 32,
  heightOffset: 1,
  labelFont: 'bold 13px SUIT',
  labelFillColor: Color.WHITE,
  labelBackgroundColor: new Color(0.2, 0.2, 0.2, 0.85),
  labelBackgroundPadding: new Cartesian2(8, 4),
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
  // 빌보드(마커 이미지) 확대
  billboardScaleMultiplier: 1.3,
  // 라벨 확대
  labelScaleMultiplier: 1.15,
  // 라벨 스타일
  labelFont: 'bold 14px SUIT',
  labelFillColor: Color.WHITE,
  labelBackgroundColor: new Color(0.1, 0.4, 0.9, 0.95), // 블루 배경
  labelBackgroundPadding: new Cartesian2(10, 5),
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
        image: options.image || getAssetPath('/images/icons/map/marker.png'),
        width: options.width || 32,
        height: options.heightValue || 32,
        heightReference: options.heightReference ?? HeightReference.RELATIVE_TO_GROUND,
        scaleByDistance: scaleByDistance,
        disableDepthTestDistance: options.disableDepthTest ? Number.POSITIVE_INFINITY : undefined,
      },
      label: options.label
        ? {
            text: options.label,
            font: DEFAULT_MARKER_CONFIG.labelFont,
            fillColor: DEFAULT_MARKER_CONFIG.labelFillColor,
            backgroundColor: DEFAULT_MARKER_CONFIG.labelBackgroundColor,
            backgroundPadding: DEFAULT_MARKER_CONFIG.labelBackgroundPadding,
            showBackground: true,
            style: LabelStyle.FILL,
            verticalOrigin: VerticalOrigin.BOTTOM,
            pixelOffset: labelPixelOffset,
            heightReference: options.heightReference,
            // 기본 상태에서 라벨도 숨김
            show: false,
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

    // 이전 호버 마커 복원 (기본 상태로)
    if (hoveredMarkerId && hoveredMarkerId !== markerId) {
      const prevEntity = viewer.entities.getById(hoveredMarkerId)
      if (prevEntity) {
        // 빌보드(마커 이미지) 원래 크기로 복원
        if (prevEntity.billboard) {
          prevEntity.billboard.scale = new ConstantProperty(1.0)
        }
        // 라벨 숨김
        if (prevEntity.label) {
          prevEntity.label.show = new ConstantProperty(false)
          prevEntity.label.scale = new ConstantProperty(1.0)
          prevEntity.label.font = new ConstantProperty(DEFAULT_MARKER_CONFIG.labelFont)
          prevEntity.label.fillColor = new ConstantProperty(DEFAULT_MARKER_CONFIG.labelFillColor)
          prevEntity.label.backgroundColor = new ConstantProperty(DEFAULT_MARKER_CONFIG.labelBackgroundColor)
          prevEntity.label.backgroundPadding = new ConstantProperty(DEFAULT_MARKER_CONFIG.labelBackgroundPadding)
        }
      }
    }

    // 새로운 호버 마커 강조 (라벨 표시)
    if (markerId) {
      const entity = viewer.entities.getById(markerId)
      if (entity) {
        // 빌보드(마커 이미지) 확대
        if (entity.billboard) {
          entity.billboard.scale = new ConstantProperty(HOVER_CONFIG.billboardScaleMultiplier)
        }
        // 라벨 표시 및 확대, 스타일 변경
        if (entity.label) {
          entity.label.show = new ConstantProperty(true)
          entity.label.scale = new ConstantProperty(HOVER_CONFIG.labelScaleMultiplier)
          entity.label.font = new ConstantProperty(HOVER_CONFIG.labelFont)
          entity.label.fillColor = new ConstantProperty(HOVER_CONFIG.labelFillColor)
          entity.label.backgroundColor = new ConstantProperty(HOVER_CONFIG.labelBackgroundColor)
          entity.label.backgroundPadding = new ConstantProperty(HOVER_CONFIG.labelBackgroundPadding)
        }
      }
    }

    set({ hoveredMarkerId: markerId })
    viewer.scene.requestRender()
  },
}))
