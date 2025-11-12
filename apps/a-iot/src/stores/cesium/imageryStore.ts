import { create } from 'zustand'
import { Viewer as CesiumViewer, IonImageryProvider } from 'cesium'

export type ImageryProviderType = 'ion-default' | 'ion-satellite'

interface ImageryState {
  currentProvider: ImageryProviderType
}

interface ImageryActions {
  switchImageryLayer: (viewer: CesiumViewer, providerType: ImageryProviderType) => Promise<void>
  setCurrentProvider: (provider: ImageryProviderType) => void
}

type ImageryStore = ImageryState & ImageryActions

export const useImageryStore = create<ImageryStore>((set) => ({
  currentProvider: 'ion-satellite',

  setCurrentProvider: (provider: ImageryProviderType) => {
    set({ currentProvider: provider })
  },

  switchImageryLayer: async (viewer: CesiumViewer, providerType: ImageryProviderType) => {
    if (viewer.isDestroyed()) return

    const imageryLayers = viewer.imageryLayers
    while (imageryLayers.length > 0) {
      imageryLayers.remove(imageryLayers.get(0))
    }

    try {
      const defaultAssetId = Number(import.meta.env.VITE_CESIUM_GOOGLE_MAP_ASSET_ID) || 2
      const satelliteAssetId = Number(import.meta.env.VITE_CESIUM_SATELLITE_ASSET_ID) || 3
      const assetId = providerType === 'ion-satellite' ? satelliteAssetId : defaultAssetId

      const newProvider = await IonImageryProvider.fromAssetId(assetId)

      if (!viewer.isDestroyed()) {
        imageryLayers.addImageryProvider(newProvider)
        set({ currentProvider: providerType })
      }
    } catch (error) {
      console.error('Failed to switch imagery layer:', error)

      try {
        const fallback = await IonImageryProvider.fromAssetId(2)
        if (!viewer.isDestroyed()) {
          imageryLayers.addImageryProvider(fallback)
          set({ currentProvider: 'ion-default' })
        }
      } catch (fallbackError) {
        console.error('Failed to load fallback imagery:', fallbackError)
      }
    }
  },
}))
