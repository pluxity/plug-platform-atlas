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

### 1. Viewer 생성 및 초기화 (간단한 방법)

```tsx
import { useViewerStore, type ViewerInitOptions } from '../../stores/cesium'

const { createViewer, initializeResources } = useViewerStore()

// 기본 설정 (위성 지도 + Terrain + 3D Tiles)
const viewer = createViewer(containerRef.current)
await initializeResources(viewer)

// 커스텀 설정
const initOptions: ViewerInitOptions = {
  imageryProvider: 'ion-default',  // 'ion-default' | 'ion-satellite' | Asset ID (number)
  loadTerrain: true,                // Terrain 로드 여부
  load3DTiles: false,               // 3D Tiles 로드 여부
}
await initializeResources(viewer, initOptions)
```

### 2. CesiumMap 컴포넌트 사용 (권장)

```tsx
import CesiumMap from '../../components/CesiumMap'
import type { ViewerInitOptions } from '../../stores/cesium'

// 예시 1: 기본 설정 (위성 지도 + Terrain + 3D Tiles)
<CesiumMap
  sites={sites}
  sensors={sensors}
  events={events}
/>

// 예시 2: 일반 지도 + 3D Tiles 없음
<CesiumMap
  sites={sites}
  sensors={sensors}
  events={events}
  viewerInitOptions={{
    imageryProvider: 'ion-default',
    loadTerrain: true,
    load3DTiles: false,
  }}
/>

// 예시 3: 커스텀 Asset ID 사용
<CesiumMap
  sites={sites}
  sensors={sensors}
  events={events}
  viewerInitOptions={{
    imageryProvider: 12345,  // 커스텀 Ion Asset ID
    loadTerrain: false,
    load3DTiles: false,
  }}
/>
```

### 3. 지도 레이어 전환

CesiumMap 컴포넌트는 우측 상단에 지도 레이어 전환 버튼을 제공합니다:

```tsx
import { useImageryStore } from '../../stores/cesium'

// MapLayerSelector 컴포넌트가 자동으로 포함됨
// 사용자가 버튼을 클릭하면 일반 지도 ↔ 위성 지도 전환

const { switchImageryLayer } = useImageryStore()

// 프로그래밍 방식으로 전환
await switchImageryLayer(viewer, 'ion-satellite')  // 위성 지도
await switchImageryLayer(viewer, 'ion-default')    // 일반 지도
```

**환경변수 설정:**
```bash
# Asset ID 4 = 일반 지도
# Asset ID 2 = 위성 지도
VITE_CESIUM_GOOGLE_MAP_ASSET_ID=4
VITE_CESIUM_SATELLITE_ASSET_ID=2
```

### 4. Tileset 로딩

```tsx
import { useTilesetStore } from '../../stores/cesium'

const { loadAllIonTilesets } = useTilesetStore()

const tilesets = await loadAllIonTilesets(viewer)
```

### 4. 자동 숨김 설정

카메라 거리에 따라 tileset 자동 표시/숨김:

```tsx
const { setupTilesetsAutoHide } = useTilesetStore()

const tilesets = await loadAllIonTilesets(viewer)
const cleanup = setupTilesetsAutoHide(viewer, tilesets, 2000)

return () => cleanup()
```

### 5. 높이 오프셋 적용

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

        await initializeResources(viewerInstance)

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
VITE_CESIUM_GOOGLE_MAP_ASSET_ID=3830182
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

## ViewerInitOptions 상세

```typescript
interface ViewerInitOptions {
  imageryProvider?: 'ion-default' | 'ion-satellite' | number
  loadTerrain?: boolean
  load3DTiles?: boolean
}
```

### imageryProvider (기본값: 'ion-satellite')

지도 이미지 레이어 설정:

- `'ion-default'`: 일반 지도 (환경변수 `VITE_CESIUM_GOOGLE_MAP_ASSET_ID`, 기본 4)
- `'ion-satellite'`: 위성 지도 (환경변수 `VITE_CESIUM_SATELLITE_ASSET_ID`, 기본 2)
- `number`: 커스텀 Cesium Ion Asset ID

**예시:**
```tsx
// 일반 지도
viewerInitOptions={{ imageryProvider: 'ion-default' }}

// 위성 지도
viewerInitOptions={{ imageryProvider: 'ion-satellite' }}

// 커스텀 Asset ID
viewerInitOptions={{ imageryProvider: 3830184 }}
```

### loadTerrain (기본값: true)

3D 지형 데이터 로드 여부:

- `true`: Cesium World Terrain 로드 (환경변수 `VITE_CESIUM_TERRAIN_ASSET_ID`)
- `false`: 평면 지형 사용 (Ellipsoid)

**사용 시나리오:**
- 3D 지형이 필요 없는 2D 지도 → `false`
- 산악 지형 표현 필요 → `true`

### load3DTiles (기본값: true)

3D Tileset (건물, 구조물) 로드 여부:

- `true`: Ion 3D Tiles + 로컬 Tileset 로드
- `false`: 3D Tiles 로드 안 함

**사용 시나리오:**
- 마커/폴리곤만 필요한 간단한 지도 → `false`
- 실제 건물/지형 표현 필요 → `true`

**주의:** `load3DTiles`는 `ViewerInitOptions`에서 설정하고, `CesiumMap` 컴포넌트 내부에서 처리됩니다.

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

## 마커 관리

### markerStore

마커 생성 및 관리:

```tsx
import { useMarkerStore } from '../../stores/cesium'
import { HeightReference } from 'cesium'

const { addMarker, removeMarker, clearAllMarkers } = useMarkerStore()

addMarker(viewer, {
  id: 'park-1',
  lon: 127.1114,
  lat: 37.3948,
  height: 20,
  image: '/images/icons/map/park.png',
  width: 45,
  heightValue: 55,
  label: '공원 이름',
  labelColor: '#000000',
  heightReference: HeightReference.RELATIVE_TO_GROUND,
  disableDepthTest: true,
  disableScaleByDistance: true,
})
```

**MarkerOptions:**
- `id`: 마커 고유 ID
- `lon`, `lat`: 좌표
- `height`: 지면으로부터 높이 (기본 1m)
- `image`: 아이콘 이미지 경로
- `width`, `heightValue`: 아이콘 크기
- `label`: 라벨 텍스트 (SUIT 폰트 사용)
- `labelColor`: 라벨 색상 (검은색 글씨, 흰색 테두리)
- `heightReference`: 높이 참조 (기본 RELATIVE_TO_GROUND)
- `disableDepthTest`: 다른 객체에 가려지지 않음
- `disableScaleByDistance`: 거리에 따른 크기 변화 비활성화

## SVG 마커 시스템

### 개요

SVG 마커 시스템은 `public/images/icons/markers/` 디렉토리의 SVG 파일들을 동적으로 색상 변경하여 사용하는 시스템입니다.

### 주요 기능

1. **SVG 파일 자동 캐싱**: 앱 시작 시 모든 SVG 파일을 메모리에 로드
2. **색상 변경된 SVG 캐싱**: SVG + 색상 조합을 캐싱하여 메모리 효율 극대화
3. **동적 색상 변경**: 런타임에 마커 색상 변경 가능
4. **깜빡임 효과**: 마커에 blink 효과 적용/해제 가능

### 사용 가능한 SVG 마커

```tsx
import { SVG_MARKERS } from '../../utils/svgMarkerUtils'

SVG_MARKERS.FIRE          // fire.svg
SVG_MARKERS.TEMPERATURE   // temperature.svg
SVG_MARKERS.DISPLACEMENT  // displacement.svg
```

### 초기화

```tsx
import { preloadAllMarkerSvgs } from '../../utils/svgMarkerUtils'

useEffect(() => {
  preloadAllMarkerSvgs()
}, [])
```

### SVG 마커 생성

```tsx
import { createColoredSvgDataUrl, SVG_MARKERS } from '../../utils/svgMarkerUtils'
import { useMarkerStore } from '../../stores/cesium'

const { addMarker } = useMarkerStore()

const imageUrl = createColoredSvgDataUrl(SVG_MARKERS.FIRE, '#FF0000')

addMarker(viewer, {
  id: 'fire-sensor-1',
  lon: 127.114416,
  lat: 37.294320,
  height: 10,
  image: imageUrl,
  width: 44,
  heightValue: 53,
  label: '화재 센서 1',
  labelColor: '#000000',
  heightReference: HeightReference.RELATIVE_TO_GROUND,
  disableDepthTest: true,
  disableScaleByDistance: true,
})
```

### 동적 색상 변경

```tsx
import { useMarkerStore } from '../../stores/cesium'
import { SVG_MARKERS } from '../../utils/svgMarkerUtils'

const { changeMarkerColor } = useMarkerStore()

changeMarkerColor(viewer, 'fire-sensor-1', SVG_MARKERS.FIRE, '#FF0000')
```

### 깜빡임 효과

```tsx
import { useMarkerStore } from '../../stores/cesium'

const { startMarkerBlink, stopMarkerBlink } = useMarkerStore()

startMarkerBlink(viewer, 'fire-sensor-1', 800)

stopMarkerBlink(viewer, 'fire-sensor-1')
```

**Parameters:**
- `viewer`: Cesium Viewer 인스턴스
- `markerId`: 마커 ID
- `duration`: 깜빡임 주기 (밀리초, 기본값: 1000ms)

### 전체 예시: 이벤트 발생 시나리오

```tsx
import { useMarkerStore } from '../../stores/cesium'
import { createColoredSvgDataUrl, SVG_MARKERS } from '../../utils/svgMarkerUtils'

const { addMarker, changeMarkerColor, startMarkerBlink } = useMarkerStore()

const sensors = [
  { id: 'fire-1', svgName: SVG_MARKERS.FIRE, lon: 127.11, lat: 37.29, name: '화재센서 1' },
  { id: 'fire-2', svgName: SVG_MARKERS.FIRE, lon: 127.12, lat: 37.30, name: '화재센서 2' },
]

sensors.forEach(sensor => {
  const imageUrl = createColoredSvgDataUrl(sensor.svgName, '#11C208')
  addMarker(viewer, {
    id: sensor.id,
    lon: sensor.lon,
    lat: sensor.lat,
    height: 10,
    image: imageUrl,
    width: 44,
    heightValue: 53,
    label: sensor.name,
    labelColor: '#000000',
    heightReference: HeightReference.RELATIVE_TO_GROUND,
    disableDepthTest: true,
    disableScaleByDistance: true,
  })
})

function handleFireEvent(sensorId: string) {
  changeMarkerColor(viewer, sensorId, SVG_MARKERS.FIRE, '#FF0000')
  startMarkerBlink(viewer, sensorId, 800)
}

handleFireEvent('fire-1')
```

### 메모리 효율

- **SVG 원본**: 각 SVG 파일당 1번만 fetch
- **색상 변경된 SVG**: 같은 색상 조합은 캐시에서 재사용
- **예시**: 100개의 빨간 화재 센서를 만들어도 메모리는 1개분만 사용

### 주의사항

1. `preloadAllMarkerSvgs()`를 먼저 호출해야 함
2. SVG 파일은 `public/images/icons/markers/` 디렉토리에 위치
3. Blink 효과를 위해 `viewer.scene.requestRenderMode = false` 설정 필요
4. Blink 리스너는 자동으로 정리되지만, 수동으로 중지하려면 `stopMarkerBlink` 호출

---

## 🎯 마커 인터랙션 (깜빡임 & 호버)

### 깜빡임 애니메이션 (Blink)

위험 상태, 새로운 알람, 선택된 마커 등을 시각적으로 강조하기 위한 기능입니다.

#### 설정값

```typescript
const BLINK_CONFIG = {
  defaultDuration: 1000,    // 기본 애니메이션 주기 (1초)
  alphaMin: 0.3,            // 최소 투명도
  alphaMax: 1.0,            // 최대 투명도
}
```

#### 사용 예시

```tsx
import { useMarkerStore } from '../../stores/cesium'

function EventAlertComponent() {
  const { startMarkerBlink, stopMarkerBlink } = useMarkerStore()
  const viewerRef = useRef<CesiumViewer>(null)

  // 위험 이벤트 발생 시 마커 깜빡임 시작
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return

    const dangerEvents = events.filter(e => e.level === 'DANGER')

    dangerEvents.forEach(event => {
      const markerId = `device-${event.deviceId}`
      startMarkerBlink(viewer, markerId, 800) // 0.8초 주기
    })

    // 컴포넌트 언마운트 시 애니메이션 정리
    return () => {
      if (!viewer.isDestroyed()) {
        dangerEvents.forEach(event => {
          const markerId = `device-${event.deviceId}`
          stopMarkerBlink(viewer, markerId)
        })
      }
    }
  }, [events, startMarkerBlink, stopMarkerBlink])

  return <CesiumMap events={events} />
}
```

#### 동작 원리

- 사인 곡선을 사용하여 부드러운 투명도 전환 (0.3 ↔ 1.0)
- `viewer.clock.onTick` 이벤트를 활용한 프레임 단위 애니메이션
- 자동 메모리 관리 (이전 애니메이션 리스너 제거)

### 호버 인터랙션 (Hover)

마우스를 올렸을 때 마커를 확대하고 라벨을 강조하는 기능입니다.

#### 설정값

```typescript
const HOVER_CONFIG = {
  // 빌보드(마커 이미지) 확대
  billboardScaleMultiplier: 1.3,    // 마커 이미지 확대 비율 (1.3배)
  // 라벨 확대
  labelScaleMultiplier: 1.15,       // 라벨 확대 비율 (1.15배)
  // 라벨 스타일
  labelFont: 'bold 14px SUIT',      // 호버 시 라벨 폰트
  labelFillColor: Color.WHITE,      // 라벨 글자색
  labelBackgroundColor: new Color(0.1, 0.4, 0.9, 0.95), // 밝은 블루 배경
  labelBackgroundPadding: new Cartesian2(10, 5),        // 라벨 패딩
}

const DEFAULT_MARKER_CONFIG = {
  labelFont: 'bold 13px SUIT',      // 기본 라벨 폰트
  labelFillColor: Color.WHITE,      // 기본 라벨 글자색
  labelBackgroundColor: new Color(0.2, 0.2, 0.2, 0.85), // 기본 어두운 배경
  labelBackgroundPadding: new Cartesian2(8, 4),         // 기본 라벨 패딩
}
```

#### 사용 예시

```tsx
import { useMarkerStore } from '../../stores/cesium'
import { ScreenSpaceEventHandler, ScreenSpaceEventType, Cartesian2 } from 'cesium'
import { throttle } from 'lodash'

function CesiumMapWithHover() {
  const { setMarkerHover } = useMarkerStore()
  const viewerRef = useRef<CesiumViewer>(null)

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas)

    // throttle을 사용하여 성능 최적화 (100ms 간격으로 실행)
    const handleMouseMove = throttle((endPosition: Cartesian2) => {
      const pickedObject = viewer.scene.pick(endPosition)
      const entity = pickedObject?.id
      const entityId = entity?.id?.toString()

      // 디바이스 마커인 경우에만 호버 효과 적용
      if (entityId?.startsWith('device-')) {
        setMarkerHover(viewer, entityId)
        viewer.scene.canvas.style.cursor = 'pointer'
      } else {
        setMarkerHover(viewer, null)
        viewer.scene.canvas.style.cursor = 'default'
      }
    }, 100)

    handler.setInputAction((movement: ScreenSpaceEventHandler.MotionEvent) => {
      handleMouseMove(movement.endPosition)
    }, ScreenSpaceEventType.MOUSE_MOVE)

    return () => {
      handleMouseMove.cancel() // throttle 취소
      if (!handler.isDestroyed()) {
        handler.destroy()
      }
      if (!viewer.isDestroyed()) {
        viewer.scene.canvas.style.cursor = 'default'
      }
    }
  }, [setMarkerHover])

  return <div ref={cesiumContainerRef} />
}
```

#### 동작 원리

- **이전 호버 마커 복원**:
  - 빌보드(마커 이미지) 원래 크기(1.0배)로 복원
  - 라벨 원래 크기(1.0배) 및 기본 스타일로 복원
- **새로운 호버 마커 강조**:
  - 빌보드(마커 이미지) 1.3배 확대
  - 라벨 1.15배 확대
  - 라벨 폰트, 배경색, 패딩 변경으로 가독성 향상 (밝은 블루 배경)
- `hoveredMarkerId` 상태를 통한 단일 호버 관리

### 통합 사용 예시: Blink + Hover

```tsx
import { useRef, useEffect } from 'react'
import { Viewer as CesiumViewer, ScreenSpaceEventHandler, ScreenSpaceEventType, Cartesian2 } from 'cesium'
import { throttle } from 'lodash'
import { useMarkerStore } from '../../stores/cesium'

export default function CesiumMap({ events }: CesiumMapProps) {
  const viewerRef = useRef<CesiumViewer | null>(null)
  const {
    startMarkerBlink,
    stopMarkerBlink,
    setMarkerHover
  } = useMarkerStore()

  // 1. 위험/경고 이벤트에 대한 깜빡임 애니메이션 적용
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return

    const criticalEvents = events.filter(e =>
      e.level === 'DANGER' || e.level === 'WARNING'
    )

    // 위험 이벤트 마커 깜빡임 시작
    criticalEvents.forEach(event => {
      const markerId = `device-${event.deviceId}`
      const duration = event.level === 'DANGER' ? 600 : 1000 // 위험도에 따라 속도 조절
      startMarkerBlink(viewer, markerId, duration)
    })

    // 정리 함수: 이벤트가 해결되거나 컴포넌트 언마운트 시 애니메이션 중지
    return () => {
      if (!viewer.isDestroyed()) {
        criticalEvents.forEach(event => {
          const markerId = `device-${event.deviceId}`
          stopMarkerBlink(viewer, markerId)
        })
      }
    }
  }, [events, startMarkerBlink, stopMarkerBlink])

  // 2. 호버 인터랙션 설정 (throttle 적용)
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas)

    // throttle을 사용하여 성능 최적화 (100ms 간격으로 실행)
    const handleMouseMove = throttle((endPosition: Cartesian2) => {
      const pickedObject = viewer.scene.pick(endPosition)
      const entity = pickedObject?.id
      const entityId = entity?.id?.toString()

      // 센서 마커에만 호버 효과 적용
      if (entityId?.startsWith('device-')) {
        setMarkerHover(viewer, entityId)
      } else {
        setMarkerHover(viewer, null)
      }
    }, 100)

    handler.setInputAction((movement: ScreenSpaceEventHandler.MotionEvent) => {
      handleMouseMove(movement.endPosition)
    }, ScreenSpaceEventType.MOUSE_MOVE)

    return () => {
      handleMouseMove.cancel() // throttle 취소
      if (!handler.isDestroyed()) {
        handler.destroy()
      }
    }
  }, [setMarkerHover])

  return (
    <div className="relative w-full h-full">
      <div ref={cesiumContainerRef} className="w-full h-full" />
    </div>
  )
}
```

### 성능 최적화

#### 깜빡임 애니메이션

- 동시에 깜빡이는 마커가 10개 이상인 경우 성능 저하 가능
- 중요도가 높은 이벤트만 깜빡임 적용 권장
- `stopMarkerBlink`를 통한 명시적 정리 필수

#### 호버 인터랙션

- `MOUSE_MOVE` 이벤트는 매우 자주 발생하므로 **throttle 필수** (lodash의 `throttle` 권장)
- `viewer.scene.pick`은 비용이 큰 작업이므로 호출 빈도 제한 (100-150ms 간격 권장)
- 호버 대상이 아닌 엔티티는 빠르게 필터링
- cleanup 함수에서 `throttle.cancel()` 호출하여 메모리 누수 방지

#### requestRender 호출

- 두 기능 모두 `viewer.scene.requestRender()` 호출
- Cesium의 렌더링 최적화 메커니즘을 활용하여 불필요한 렌더링 방지

### 주의사항

1. **Viewer 인스턴스 확인**: 모든 함수 호출 전에 `viewer`가 `null`이 아니고 `isDestroyed()`가 `false`인지 확인
2. **메모리 누수 방지**: 컴포넌트 언마운트 시 `stopMarkerBlink` 호출 및 `ScreenSpaceEventHandler` 정리 필수
3. **마커 ID 네이밍**: 일관된 ID 네이밍 규칙 사용 (예: `device-{deviceId}`, `park-{siteId}`)
4. **상태 동기화**: 마커가 제거되었을 때 깜빡임 애니메이션도 함께 정리 (`clearAllMarkers` 호출 시 자동 정리됨)

---

## 카메라 제어

### cameraStore

```tsx
import { useCameraStore } from '../../stores/cesium'

const { focusOn, flyToPosition } = useCameraStore()

focusOn(viewer, wktPolygon, 500)
flyToPosition(viewer, { lon: 127.1114, lat: 37.3948, height: 1500 })
```
