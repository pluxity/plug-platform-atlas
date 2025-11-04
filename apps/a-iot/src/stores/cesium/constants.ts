// Cesium Ion Asset IDs
export const ION_ASSETS = {
  TERRAIN: 3825983,
  GOOGLE_MAP_IMAGERY: Number(import.meta.env.VITE_CESIUM_GOOGLE_MAP_ASSET_ID) || 2,
  TILESETS: {
    ASSET_4004889: 4004889,
    ASSET_4005051: 4005051,
  },
} as const

// Localhost Tileset URLs
export const LOCAL_TILESETS = {
  SEONGNAM: 'http://localhost/seongnam/sn_3d_br/sn.br.2022.tileset.json',
  SEONGNAM_UNCOMPRESSED: 'http://localhost/seongnam/sn_3d/seongnam.2022.cesium.tileset.json',
} as const

// Default height offsets (in meters)
export const TILESET_HEIGHT_OFFSETS = {
  ASSET_4004889: 60,
  ASSET_4005051: 60,
  SEONGNAM: 30,
} as const
