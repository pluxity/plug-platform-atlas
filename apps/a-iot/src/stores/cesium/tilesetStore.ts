import { create } from 'zustand'
import {
  Viewer as CesiumViewer,
  Cesium3DTileset,
  IonResource,
  Cartesian3,
  Matrix4,
  Cartographic,
} from 'cesium'
import { ION_ASSETS, TILESET_HEIGHT_OFFSETS, LOCAL_TILESETS } from './constants'

interface TilesetLoadOptions {
  maximumScreenSpaceError?: number
  skipLevelOfDetail?: boolean
  cullWithChildrenBounds?: boolean
}

const DEFAULT_TILESET_OPTIONS = {
  skipLevelOfDetail: true,
  maximumScreenSpaceError: 48,
  cullWithChildrenBounds: true,
  dynamicScreenSpaceError: true,
  dynamicScreenSpaceErrorDensity: 0.00278,
  dynamicScreenSpaceErrorFactor: 4.0,
  dynamicScreenSpaceErrorHeightFalloff: 0.25,
} as const

interface TilesetStore {
  loadIonTileset: (viewer: CesiumViewer, assetId: number, options?: TilesetLoadOptions) => Promise<Cesium3DTileset | null>
  loadSeongnamTileset: (viewer: CesiumViewer, url?: string) => Promise<Cesium3DTileset | null>
  applyHeightOffset: (tileset: Cesium3DTileset, offset: number) => void
  loadAllIonTilesets: (viewer: CesiumViewer) => Promise<Map<number, Cesium3DTileset>>
  setupTilesetsAutoHide: (viewer: CesiumViewer, tilesets: Map<number, Cesium3DTileset>, threshold: number) => () => void
  setupSeongnamAutoHide: (viewer: CesiumViewer, tileset: Cesium3DTileset, threshold: number) => () => void
}

export const useTilesetStore = create<TilesetStore>(() => ({
  loadIonTileset: async (viewer: CesiumViewer, assetId: number, options?: TilesetLoadOptions) => {
    if (viewer.isDestroyed()) return null

    try {
      const resource = await IonResource.fromAssetId(assetId)

      const tileset = await Cesium3DTileset.fromUrl(resource, {
        ...DEFAULT_TILESET_OPTIONS,
        skipLevelOfDetail: options?.skipLevelOfDetail ?? DEFAULT_TILESET_OPTIONS.skipLevelOfDetail,
        maximumScreenSpaceError: options?.maximumScreenSpaceError ?? DEFAULT_TILESET_OPTIONS.maximumScreenSpaceError,
        cullWithChildrenBounds: options?.cullWithChildrenBounds ?? DEFAULT_TILESET_OPTIONS.cullWithChildrenBounds,
      })

      if (viewer.isDestroyed()) return null

      viewer.scene.primitives.add(tileset)

      return tileset
    } catch (error) {
      console.error(`Failed to load Ion Asset ${assetId}:`, error)
      return null
    }
  },

  loadSeongnamTileset: async (viewer: CesiumViewer, url?: string) => {
    if (viewer.isDestroyed()) return null

    const tilesetUrl = url || LOCAL_TILESETS.SEONGNAM

    try {
      const tileset = await Cesium3DTileset.fromUrl(tilesetUrl, DEFAULT_TILESET_OPTIONS)

      if (viewer.isDestroyed()) return null

      viewer.scene.primitives.add(tileset)

      return tileset
    } catch (error) {
      console.error('Failed to load Seongnam tileset from localhost:', error)
      return null
    }
  },

  applyHeightOffset: (tileset: Cesium3DTileset, offset: number) => {
    const boundingSphere = tileset.boundingSphere
    const cartographic = Cartographic.fromCartesian(boundingSphere.center)
    const surface = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0)
    const offsetSurface = Cartesian3.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      offset
    )

    const translation = Cartesian3.subtract(offsetSurface, surface, new Cartesian3())
    const currentMatrix = tileset.modelMatrix ? Matrix4.clone(tileset.modelMatrix, new Matrix4()) : Matrix4.IDENTITY
    const translationMatrix = Matrix4.fromTranslation(translation, new Matrix4())
    tileset.modelMatrix = Matrix4.multiply(translationMatrix, currentMatrix, new Matrix4())
  },

  loadAllIonTilesets: async (viewer: CesiumViewer) => {
    const tilesets = new Map<number, Cesium3DTileset>()

    for (const [tilesetName, assetId] of Object.entries(ION_ASSETS.TILESETS)) {
      const tileset = await useTilesetStore.getState().loadIonTileset(viewer, assetId)
      if (tileset && !viewer.isDestroyed()) {
        tilesets.set(assetId, tileset)
        const offsetKey = tilesetName as keyof typeof TILESET_HEIGHT_OFFSETS
        const offset = TILESET_HEIGHT_OFFSETS[offsetKey]
        if (offset !== undefined) {
          useTilesetStore.getState().applyHeightOffset(tileset, offset)
        }
      }
    }

    return tilesets
  },

  setupTilesetsAutoHide: (viewer: CesiumViewer, tilesets: Map<number, Cesium3DTileset>, threshold: number) => {
    if (viewer.isDestroyed() || tilesets.size === 0) {
      return () => {}
    }

    const initialHeight = viewer.camera.positionCartographic.height
    const initialShow = initialHeight < threshold
    tilesets.forEach(tileset => {
      tileset.show = initialShow
    })

    const handleCameraChange = () => {
      if (viewer.isDestroyed()) return

      const cameraHeight = viewer.camera.positionCartographic.height
      const showTilesets = cameraHeight < threshold

      tilesets.forEach(tileset => {
        if (tileset.show !== showTilesets) {
          tileset.show = showTilesets
        }
      })
    }

    viewer.camera.changed.addEventListener(handleCameraChange)

    return () => {
      if (!viewer.isDestroyed()) {
        viewer.camera.changed.removeEventListener(handleCameraChange)
      }
    }
  },

  setupSeongnamAutoHide: (viewer: CesiumViewer, tileset: Cesium3DTileset, threshold: number) => {
    if (viewer.isDestroyed()) {
      return () => {}
    }

    const initialHeight = viewer.camera.positionCartographic.height
    const initialShow = initialHeight < threshold
    tileset.show = initialShow

    const handleCameraChange = () => {
      if (viewer.isDestroyed()) return

      const cameraHeight = viewer.camera.positionCartographic.height
      const showTileset = cameraHeight < threshold

      if (tileset.show !== showTileset) {
        tileset.show = showTileset
      }
    }

    viewer.camera.changed.addEventListener(handleCameraChange)

    return () => {
      if (!viewer.isDestroyed()) {
        viewer.camera.changed.removeEventListener(handleCameraChange)
      }
    }
  },
}))
