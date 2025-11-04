import { create } from 'zustand'
import {
  Viewer as CesiumViewer,
  Cesium3DTileset,
  IonResource,
  Cartesian3,
  Matrix4,
  Cartographic,
} from 'cesium'

interface TilesetStore {
  // Load Ion Asset tileset
  loadIonTileset: (viewer: CesiumViewer, assetId: number) => Promise<Cesium3DTileset | null>

  // Load Seongnam tileset from localhost
  loadSeongnamTileset: (viewer: CesiumViewer, url?: string) => Promise<Cesium3DTileset | null>

  // Apply height offset to any tileset
  applyHeightOffset: (tileset: Cesium3DTileset, offset: number) => void
}

export const useTilesetStore = create<TilesetStore>(() => ({
  loadIonTileset: async (viewer: CesiumViewer, assetId: number) => {
    if (viewer.isDestroyed()) return null

    try {
      console.log(`Loading Ion Asset ${assetId}...`)
      const resource = await IonResource.fromAssetId(assetId)
      const tileset = await Cesium3DTileset.fromUrl(resource)

      if (viewer.isDestroyed()) return null

      viewer.scene.primitives.add(tileset)
      console.log(`Ion Asset ${assetId} loaded successfully`)

      return tileset
    } catch (error) {
      console.error(`Failed to load Ion Asset ${assetId}:`, error)
      return null
    }
  },

  loadSeongnamTileset: async (viewer: CesiumViewer, url?: string) => {
    if (viewer.isDestroyed()) return null

    // Default to Brotli compressed version
    const tilesetUrl = url || 'http://localhost/seongnam/sn_3d_br/sn.br.2022.tileset.json'

    try {
      console.log(`Loading Seongnam tileset from ${tilesetUrl}...`)

      const tileset = await Cesium3DTileset.fromUrl(tilesetUrl)

      if (viewer.isDestroyed()) return null

      console.log('Seongnam tileset loaded, bounding sphere:', tileset.boundingSphere)

      viewer.scene.primitives.add(tileset)
      console.log('Seongnam tileset added to scene successfully')

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

    // Get the offset translation
    const translation = Cartesian3.subtract(offsetSurface, surface, new Cartesian3())

    // Get the current model matrix or create identity
    const currentMatrix = tileset.modelMatrix ? Matrix4.clone(tileset.modelMatrix, new Matrix4()) : Matrix4.IDENTITY

    // Create translation matrix
    const translationMatrix = Matrix4.fromTranslation(translation, new Matrix4())

    // Multiply to apply translation
    tileset.modelMatrix = Matrix4.multiply(translationMatrix, currentMatrix, new Matrix4())

    console.log(`Height offset ${offset}m applied to tileset`)
  },
}))
