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

    // requestRenderMode에서 마커가 즉시 렌더링되지 않는 문제를 해결하기 위해
    // 여러 번의 렌더링을 요청합니다. 이미지 로딩과 지형 클램핑이 비동기로 처리되기 때문에 필요합니다.
    for (let i = 0; i < 10; i++) {
      setTimeout(() => viewer.scene.requestRender(), i * 50)
    }

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
