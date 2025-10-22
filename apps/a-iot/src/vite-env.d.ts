/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CESIUM_ION_ACCESS_TOKEN: string
  readonly VITE_CESIUM_GOOGLE_MAP_ASSET_ID: string
  readonly VITE_CESIUM_TERRAIN_ASSET_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
