export const ION_ASSETS = {
  TERRAIN: Number(import.meta.env.VITE_CESIUM_TERRAIN_ASSET_ID) || 3825983,
  GOOGLE_MAP_IMAGERY: Number(import.meta.env.VITE_CESIUM_GOOGLE_MAP_ASSET_ID) || 2,
  GOOGLE_PHOTOREALISTIC_3D_TILES: Number(import.meta.env.VITE_CESIUM_GOOGLE_3D_TILES_ASSET_ID) || 2275207,
  TILESETS: {
    CENTER_PARK: Number(import.meta.env.VITE_CESIUM_CENTER_PARK_ASSET_ID) || 4004889,
    YD_PARK: Number(import.meta.env.VITE_CESIUM_YD_PARK_ASSET_ID) || 4005051,
  },
} as const

const LOCAL_TILESET_BASE_URL = import.meta.env.VITE_LOCAL_TILESET_BASE_URL || 'http://localhost'

export const LOCAL_TILESETS = {
  SEONGNAM: `${LOCAL_TILESET_BASE_URL}/seongnam/sn_3d/seongnam.2022.cesium.tileset.json`,
} as const

export const TILESET_HEIGHT_OFFSETS = {
  CENTER_PARK: Number(import.meta.env.VITE_CESIUM_CENTER_PARK_HEIGHT_OFFSET) || 0,
  YD_PARK: Number(import.meta.env.VITE_CESIUM_YD_PARK_HEIGHT_OFFSET) || 0,
  SEONGNAM: Number(import.meta.env.VITE_CESIUM_SEONGNAM_HEIGHT_OFFSET) || 20,
} as const
