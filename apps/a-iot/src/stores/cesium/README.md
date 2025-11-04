# Cesium Stores 사용 가이드

Store 기반으로 Cesium 3D 지도를 관리합니다. React lifecycle과 Cesium 로직을 분리하여 테스트 용이성과 재사용성을 높였습니다.

## 구조

```
stores/cesium/
├── viewerStore.ts       # Viewer 생성 및 기본 설정
├── tilesetStore.ts      # Tileset 로딩 및 자동 숨김 관리
├── lodStore.ts          # 카메라 거리 기반 LOD 시스템
├── cameraStore.ts       # 카메라 제어
├── markerStore.ts       # 마커 관리
├── polygonStore.ts      # 폴리곤 관리
├── constants.ts         # 환경변수 기반 설정값
└── types.ts             # 공통 타입 정의
```

## Store vs Hooks

이전에는 hooks로 구현했지만, 다음 이유로 store 중심으로 변경:

- **명확한 관심사 분리**: Cesium 로직 ↔ React 라이프사이클
- **테스트 용이성**: Store 함수들은 순수 함수로 테스트 가능
- **재사용성**: 다른 프레임워크에서도 store 재사용 가능
- **명시적 cleanup**: 메모리 누수 방지

## 기본 사용법

### 1. Viewer 생성

```tsx
import { useViewerStore } from '../../stores/cesium'

const { createViewer } = useViewerStore()

useEffect(() => {
  const containerRef = document.getElementById('cesiumContainer')
  const viewer = createViewer(containerRef)

  return () => {
    if (viewer && !viewer.isDestroyed()) {
      viewer.destroy()
    }
  }
}, [])
```

### 2. Tileset 로딩

```tsx
import { useTilesetStore, ION_ASSETS } from '../../stores/cesium'

const { loadIonTileset, loadAllIonTilesets } = useTilesetStore()

await loadIonTileset(viewer, ION_ASSETS.GOOGLE_PHOTOREALISTIC_3D_TILES)

const tilesets = await loadAllIonTilesets(viewer)
```

### 3. 자동 숨김 설정

카메라 거리에 따라 tileset 자동 표시/숨김:

```tsx
const { setupTilesetsAutoHide } = useTilesetStore()

const tilesets = await loadAllIonTilesets(viewer)
const cleanup = setupTilesetsAutoHide(viewer, tilesets, 2000)

return () => cleanup()
```

### 4. 높이 오프셋 적용

```tsx
import { useTilesetStore, TILESET_HEIGHT_OFFSETS } from '../../stores/cesium'

const { loadSeongnamTileset, applyHeightOffset } = useTilesetStore()

const tileset = await loadSeongnamTileset(viewer)
applyHeightOffset(tileset, TILESET_HEIGHT_OFFSETS.SEONGNAM)
```

## 완전한 예제: MapDashboard

```tsx
import { useRef, useEffect, useState } from 'react'
import { Viewer as CesiumViewer, Cartesian3, Math as CesiumMath } from 'cesium'
import {
  useViewerStore,
  useTilesetStore,
  ION_ASSETS,
  DEFAULT_CAMERA_POSITION,
  TILESET_HEIGHT_OFFSETS
} from '../../stores/cesium'

export default function MapDashboard() {
  const cesiumContainerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { createViewer } = useViewerStore()
  const {
    loadIonTileset,
    loadAllIonTilesets,
    loadSeongnamTileset,
    setupTilesetsAutoHide,
    setupSeongnamAutoHide,
    applyHeightOffset
  } = useTilesetStore()

  useEffect(() => {
    if (!cesiumContainerRef.current) return

    let viewerInstance: CesiumViewer | null = null
    const cleanupFunctions: Array<() => void> = []

    const initializeViewer = async () => {
      try {
        setIsLoading(true)

        viewerInstance = createViewer(cesiumContainerRef.current!)

        viewerInstance.scene.globe.depthTestAgainstTerrain = true
        viewerInstance.scene.fog.enabled = true
        viewerInstance.scene.fog.density = 0.0002
        viewerInstance.scene.fog.screenSpaceErrorFactor = 2.0

        const destination = Cartesian3.fromDegrees(
          DEFAULT_CAMERA_POSITION.lon,
          DEFAULT_CAMERA_POSITION.lat,
          DEFAULT_CAMERA_POSITION.height
        )
        const orientation = {
          heading: CesiumMath.toRadians(DEFAULT_CAMERA_POSITION.heading || 0),
          pitch: CesiumMath.toRadians(DEFAULT_CAMERA_POSITION.pitch || -45),
          roll: CesiumMath.toRadians(DEFAULT_CAMERA_POSITION.roll || 0),
        }
        viewerInstance.camera.setView({ destination, orientation })

        await loadIonTileset(viewerInstance, ION_ASSETS.GOOGLE_PHOTOREALISTIC_3D_TILES, {
          maximumScreenSpaceError: 64,
          skipLevelOfDetail: true,
        })

        const tilesets = await loadAllIonTilesets(viewerInstance)
        const tilesetsCleanup = setupTilesetsAutoHide(viewerInstance, tilesets, 2000)
        cleanupFunctions.push(tilesetsCleanup)

        const seongnamTileset = await loadSeongnamTileset(viewerInstance)
        if (seongnamTileset) {
          applyHeightOffset(seongnamTileset, TILESET_HEIGHT_OFFSETS.SEONGNAM)
          const seongnamCleanup = setupSeongnamAutoHide(viewerInstance, seongnamTileset, 2000)
          cleanupFunctions.push(seongnamCleanup)
        }

        setIsLoading(false)
      } catch (err) {
        console.error('Failed to initialize viewer:', err)
        setIsLoading(false)
      }
    }

    initializeViewer()

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
      if (viewerInstance && !viewerInstance.isDestroyed()) {
        viewerInstance.destroy()
      }
    }
  }, [])

  return <div ref={cesiumContainerRef} className="w-full h-full" />
}
```

## 환경 변수 설정

`.env.development`:

```bash
# Cesium Ion Access Token
VITE_CESIUM_ION_ACCESS_TOKEN=your_token_here

# Imagery & Terrain
VITE_CESIUM_GOOGLE_MAP_ASSET_ID=2
VITE_CESIUM_TERRAIN_ASSET_ID=3825983
VITE_CESIUM_GOOGLE_3D_TILES_ASSET_ID=2275207

# Custom Tilesets
VITE_CESIUM_CENTER_PARK_ASSET_ID=4004889
VITE_CESIUM_YD_PARK_ASSET_ID=4005051

# Height Offsets (미터)
VITE_CESIUM_CENTER_PARK_HEIGHT_OFFSET=0
VITE_CESIUM_YD_PARK_HEIGHT_OFFSET=0
VITE_CESIUM_SEONGNAM_HEIGHT_OFFSET=20

# Local Tileset
VITE_LOCAL_TILESET_BASE_URL=http://192.168.0.150
```

## 고급 사용: LOD 시스템

카메라 거리에 따라 다른 동작을 수행:

```tsx
import { useLODStore } from '../../stores/cesium'

const { setupCameraDistanceLOD } = useLODStore()

const cleanup = setupCameraDistanceLOD(viewer, [
  {
    minDistance: 0,
    maxDistance: 1000,
    onEnter: () => setShowDetailMarkers(true),
    onExit: () => setShowDetailMarkers(false),
  },
  {
    minDistance: 1000,
    maxDistance: 5000,
    onEnter: () => setShowClusters(true),
    onExit: () => setShowClusters(false),
  },
  {
    minDistance: 5000,
    maxDistance: Infinity,
    onEnter: () => setShowPolygons(true),
    onExit: () => setShowPolygons(false),
  },
], 100)

return () => cleanup()
```

## API 레퍼런스

### viewerStore

**`createViewer(container: HTMLElement, options?: ViewerOptions): CesiumViewer`**

Viewer 생성 및 자동 설정:
- Ion 토큰 설정
- UI 제거 (timeline, animation 등)
- requestRenderMode 활성화
- Pitch/Roll 제한 (지도 기울임 방지)
- 줌 제한 (10m ~ 50,000km)

```tsx
const viewer = createViewer(containerRef.current)
```

**`setupImagery(viewer: CesiumViewer, assetId?: number): Promise<void>`**

Imagery 레이어 설정:

```tsx
await setupImagery(viewer, ION_ASSETS.GOOGLE_MAP_IMAGERY)
```

**`setupTerrain(viewer: CesiumViewer, assetId?: number): Promise<void>`**

Terrain 설정:

```tsx
await setupTerrain(viewer, ION_ASSETS.TERRAIN)
```

### tilesetStore

**`loadIonTileset(viewer, assetId, options?): Promise<Cesium3DTileset | null>`**

Ion tileset 로드:

```tsx
const tileset = await loadIonTileset(viewer, 4004889, {
  maximumScreenSpaceError: 48,
  skipLevelOfDetail: true,
})
```

**`loadAllIonTilesets(viewer): Promise<Map<number, Cesium3DTileset>>`**

constants.ts에 정의된 모든 tileset 로드 및 높이 오프셋 자동 적용:

```tsx
const tilesets = await loadAllIonTilesets(viewer)
```

**`loadSeongnamTileset(viewer, url?): Promise<Cesium3DTileset | null>`**

로컬 성남 tileset 로드:

```tsx
const tileset = await loadSeongnamTileset(viewer)
```

**`applyHeightOffset(tileset, offset): void`**

Tileset 높이 조정:

```tsx
applyHeightOffset(tileset, 20)
```

**`setupTilesetsAutoHide(viewer, tilesets, threshold): () => void`**

카메라 거리에 따라 tilesets 자동 표시/숨김:

```tsx
const cleanup = setupTilesetsAutoHide(viewer, tilesets, 2000)
return () => cleanup()
```

**`setupSeongnamAutoHide(viewer, tileset, threshold): () => void`**

성남 tileset 자동 표시/숨김:

```tsx
const cleanup = setupSeongnamAutoHide(viewer, tileset, 2000)
return () => cleanup()
```

### lodStore

**`setupCameraDistanceLOD(viewer, levels, debounceMs?): () => void`**

카메라 거리 기반 LOD 시스템:

```tsx
const cleanup = setupCameraDistanceLOD(viewer, [
  {
    minDistance: 0,
    maxDistance: 1000,
    onEnter: () => console.log('Very close'),
    onExit: () => console.log('Leaving close range'),
    onUpdate: (distance) => console.log('Current distance:', distance),
  },
], 100)
```

**LODLevel 인터페이스:**
```typescript
interface LODLevel {
  minDistance: number
  maxDistance: number
  onEnter?: () => void
  onExit?: () => void
  onUpdate?: (distance: number) => void
}
```

## 성능 최적화 팁

1. **maximumScreenSpaceError**: 48-64 (높을수록 성능↑, 품질↓)
2. **skipLevelOfDetail**: true (빠른 로딩)
3. **dynamicScreenSpaceError**: true (동적 LOD)
4. **카메라 거리 기반 자동 숨김**: 2000m 이상에서 tileset 숨김
5. **requestRenderMode**: true (변경 시에만 렌더링)
6. **Fog**: 먼 객체 숨김

```tsx
viewer.scene.fog.enabled = true
viewer.scene.fog.density = 0.0002
viewer.scene.fog.screenSpaceErrorFactor = 2.0
```

## 주의사항

1. **Cleanup 필수**: useEffect cleanup에서 반드시 cleanup 함수 호출
2. **Viewer 파괴**: 컴포넌트 unmount 시 viewer.destroy() 호출
3. **Asset ID 관리**: 환경변수로 관리하여 계정 간 이식성 확보
4. **높이 오프셋**: Tileset이 지형과 안 맞으면 오프셋 조정
5. **카메라 거리 threshold**: 사용 사례에 따라 조정 (기본 2000m)

## 마커 및 카메라 제어

마커와 카메라 제어는 별도 store로 분리되어 있습니다:

```tsx
import { useCameraStore, useMarkerStore } from '../../stores/cesium'

const { focusOn, flyToPosition } = useCameraStore()
const { addMarker, removeMarker } = useMarkerStore()

focusOn(viewer, { lon: 127.1114, lat: 37.3948 }, 1500)
addMarker(viewer, {
  id: 'marker-1',
  lon: 127.1114,
  lat: 37.3948,
  label: 'My Location',
})
```

자세한 내용은 기존 README 참조.
