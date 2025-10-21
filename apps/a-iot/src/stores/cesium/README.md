# Cesium Store 사용 가이드

## 개요

Cesium Store는 **카테고리별로 분리된** Zustand 기반 전역 Store 모음입니다.

## 기본 사용법

```tsx
import {
  useViewerStore,
  useCameraStore,
  useMarkerStore,
  DEFAULT_CAMERA_POSITION,
} from '../stores/cesium'
import { Viewer as CesiumViewer } from 'cesium'

function MyMapComponent() {
  const { createViewer, setupCesiumResources } = useViewerStore()
  const { setView } = useCameraStore()
  const { addMarker } = useMarkerStore()

  const [viewer, setViewer] = useState<CesiumViewer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const initViewer = async () => {
      // Viewer 생성
      const newViewer = createViewer(containerRef.current!)
      setViewer(newViewer)

      // 카메라 위치 설정
      setView(newViewer, DEFAULT_CAMERA_POSITION)

      // Cesium 리소스 로드
      await setupCesiumResources(newViewer)

      // 마커 추가
      addMarker(newViewer, {
        id: 'marker-1',
        lon: 127.1114,
        lat: 37.3948,
        height: 0,
        label: 'My Location',
      })
    }

    initViewer()

    return () => {
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy()
      }
    }
  }, [createViewer, setView, setupCesiumResources, addMarker])

  return <div ref={containerRef} style={{ width: '100%', height: '500px' }} />
}
```

## Store API

### 1. Viewer Store (`useViewerStore`)

Viewer 생성 및 Cesium 리소스 관리를 담당합니다.

#### `createViewer(container: HTMLElement): CesiumViewer`

Cesium Viewer를 생성하고 기본 설정을 적용합니다.

```tsx
const { createViewer } = useViewerStore()
const viewer = createViewer(containerRef.current!)
```

**자동으로 적용되는 설정:**
- Ion 토큰 설정
- 기본 UI 제거 (타임라인, 애니메이션 등)
- requestRenderMode 활성화 (성능 최적화)
- 우클릭 메뉴 비활성화
- 기본 이미지 레이어 제거

#### `setupCesiumResources(viewer: CesiumViewer): Promise<void>`

Google Map Imagery 및 World Terrain을 로드합니다.

```tsx
const { setupCesiumResources } = useViewerStore()
await setupCesiumResources(viewer)
```

---

### 2. Camera Store (`useCameraStore`)

카메라 제어 기능을 제공합니다.

#### `setView(viewer: CesiumViewer, position: CameraPosition): void`

카메라 위치를 즉시 변경합니다.

```tsx
const { setView } = useCameraStore()
setView(viewer, {
  lon: 127.1114,
  lat: 37.3948,
  height: 3000,
  pitch: -45,
  heading: 0,
})
```

#### `flyToPosition(viewer: CesiumViewer, position: CameraPosition): void`

카메라를 애니메이션으로 이동합니다.

```tsx
const { flyToPosition } = useCameraStore()
flyToPosition(viewer, {
  lon: 127.1114,
  lat: 37.3948,
  height: 1500,
  pitch: -30,
})
```

---

### 3. Marker Store (`useMarkerStore`)

마커 추가/제거/업데이트 기능을 제공합니다.

#### `addMarker(viewer: CesiumViewer, options: MarkerOptions): Entity`

지도에 마커를 추가합니다.

```tsx
const { addMarker } = useMarkerStore()
const marker = addMarker(viewer, {
  id: 'cctv-1',
  lon: 127.1114,
  lat: 37.3948,
  height: 3,
  image: '/images/icons/map/cctv-marker.png',
  width: 32,
  heightValue: 32,
  label: 'CCTV #1',
  labelColor: '#ff0000',
})
```

**MarkerOptions:**
- `id`: 고유 식별자 (필수)
- `lon`: 경도 (필수)
- `lat`: 위도 (필수)
- `height`: 지상 높이 (기본값: 0)
- `image`: 마커 이미지 경로 (기본값: '/images/icons/map/marker.png')
- `width`: 마커 너비 (기본값: 32)
- `heightValue`: 마커 높이 (기본값: 32)
- `label`: 텍스트 레이블 (선택)
- `labelColor`: 레이블 색상 (선택)

**특징:**
- 자동 LOD (거리 기반 스케일링)
  - 100m: 1.5배 크기
  - 5000m: 0.3배 크기
- RELATIVE_TO_GROUND 설정 (지형에 따라 높이 조정)

#### `removeMarker(viewer: CesiumViewer, id: string): void`

특정 마커를 제거합니다.

```tsx
const { removeMarker } = useMarkerStore()
removeMarker(viewer, 'cctv-1')
```

#### `updateMarker(viewer: CesiumViewer, id: string, options: Partial<MarkerOptions>): void`

기존 마커를 업데이트합니다.

```tsx
const { updateMarker } = useMarkerStore()
updateMarker(viewer, 'cctv-1', {
  label: 'Updated Label',
  labelColor: '#00ff00',
})
```

#### `clearAllMarkers(viewer: CesiumViewer): void`

모든 마커를 제거합니다.

```tsx
const { clearAllMarkers } = useMarkerStore()
clearAllMarkers(viewer)
```

---

## 공통 타입

### `CameraPosition`

```typescript
interface CameraPosition {
  lon: number
  lat: number
  height: number
  heading?: number
  pitch?: number
  roll?: number
}
```

### `MarkerOptions`

```typescript
interface MarkerOptions {
  id: string
  lon: number
  lat: number
  height?: number
  image?: string
  width?: number
  heightValue?: number
  label?: string
  labelColor?: string
}
```

### `DEFAULT_CAMERA_POSITION`

기본 카메라 위치 (판교)

```tsx
{
  lon: 127.1114,
  lat: 37.3948,
  height: 3000,
  pitch: -35,
  heading: 0,
}
```

---

## 환경 변수

Store는 다음 환경 변수를 사용합니다:

- `VITE_CESIUM_ION_ACCESS_TOKEN`: Cesium Ion Access Token
- `VITE_CESIUM_GOOGLE_MAP_ASSET_ID`: Google Map Asset ID
- `VITE_CESIUM_TERRAIN_ASSET_ID`: Terrain Asset ID

---

## 사용 예시

### CCTV 위치 표시

```tsx
const { addMarker } = useMarkerStore()

cctvList.forEach(cctv => {
  addMarker(viewer, {
    id: `cctv-${cctv.id}`,
    lon: cctv.lon,
    lat: cctv.lat,
    height: cctv.height,
    image: '/images/icons/map/cctv-marker.png',
    label: cctv.name,
  })
})
```

### 여러 IoT 센서 표시

```tsx
const { addMarker } = useMarkerStore()

sensors.forEach(sensor => {
  addMarker(viewer, {
    id: `sensor-${sensor.id}`,
    lon: sensor.lon,
    lat: sensor.lat,
    image: getSensorIcon(sensor.type),
    label: sensor.name,
    labelColor: getSensorColor(sensor.status),
  })
})
```

### 알람 지역 표시

```tsx
const { addMarker } = useMarkerStore()
const { flyToPosition } = useCameraStore()

// 알람 위치에 마커 추가
addMarker(viewer, {
  id: `alarm-${alarm.id}`,
  lon: alarm.lon,
  lat: alarm.lat,
  image: '/images/icons/map/alert-marker.png',
  label: alarm.message,
  labelColor: '#ff0000',
})

// 해당 위치로 카메라 이동
flyToPosition(viewer, {
  lon: alarm.lon,
  lat: alarm.lat,
  height: 1000,
  pitch: -45,
})
```

---

## 주의사항

1. **Viewer 생명주기 관리**: 각 컴포넌트가 자체 Viewer를 생성하므로, 언마운트 시 반드시 `viewer.destroy()`를 호출해야 합니다.

2. **메모리 관리**: 불필요한 마커는 `removeMarker`나 `clearAllMarkers`로 제거하세요.

3. **비동기 초기화**: `setupCesiumResources`는 비동기 함수이므로 `async/await`를 사용하세요.

4. **중복 ID 방지**: 마커 ID는 고유해야 합니다. 중복 시 예상치 못한 동작이 발생할 수 있습니다.

5. **선택적 Store 사용**: 필요한 Store만 import하여 사용하세요.
   ```tsx
   // ✅ 필요한 것만 사용
   const { addMarker } = useMarkerStore()

   // ❌ 전체 Store import 불필요
   const cesiumStore = useCesiumStore() // 이제 존재하지 않음
   ```

---

## Store 확장 가이드

새로운 기능 추가 시 카테고리별로 분리하여 추가하세요.

### 예: 도형 그리기 기능 추가

```typescript
// stores/cesium/shapeStore.ts
import { create } from 'zustand'

interface ShapeState {
  // 상태 정의
}

interface ShapeActions {
  addPolyline: (viewer: CesiumViewer, points: Cartesian3[]) => Entity
  addPolygon: (viewer: CesiumViewer, coordinates: number[][]) => Entity
  removeShape: (viewer: CesiumViewer, id: string) => void
}

type ShapeStore = ShapeState & ShapeActions

export const useShapeStore = create<ShapeStore>(() => ({
  // Actions 구현
  addPolyline: (viewer, points) => {
    // 구현
  },
  addPolygon: (viewer, coordinates) => {
    // 구현
  },
  removeShape: (viewer, id) => {
    // 구현
  },
}))
```

그리고 `index.ts`에 추가:

```typescript
export { useShapeStore } from './shapeStore'
```
