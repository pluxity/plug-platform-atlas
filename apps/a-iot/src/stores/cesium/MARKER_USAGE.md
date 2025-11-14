# Marker Store 사용 가이드

## 개요

`markerStore`는 Cesium 지도 위의 마커를 관리하고, 깜빡임(Blink) 및 호버(Hover) 인터랙션을 제공하는 Zustand 스토어입니다.

---

## 주요 기능

### 1. 깜빡임 애니메이션 (Blink) ⭐

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
import { useMarkerStore } from '../stores/cesium'

function EventAlertComponent() {
  const { startMarkerBlink, stopMarkerBlink } = useMarkerStore()
  const viewerRef = useRef<CesiumViewer>(null)

  // 위험 이벤트 발생 시 마커 깜빡임 시작
  useEffect(() => {
    const dangerEvents = events.filter(e => e.level === 'DANGER')

    dangerEvents.forEach(event => {
      const markerId = `device-${event.deviceId}`
      startMarkerBlink(viewerRef.current!, markerId, 800) // 0.8초 주기
    })

    // 컴포넌트 언마운트 시 애니메이션 정리
    return () => {
      dangerEvents.forEach(event => {
        const markerId = `device-${event.deviceId}`
        stopMarkerBlink(viewerRef.current!, markerId)
      })
    }
  }, [events, startMarkerBlink, stopMarkerBlink])

  return <CesiumMap events={events} />
}
```

#### 동작 원리
- 사인 곡선을 사용하여 부드러운 투명도 전환 (0.3 ↔ 1.0)
- `viewer.clock.onTick` 이벤트를 활용한 프레임 단위 애니메이션
- 자동 메모리 관리 (이전 애니메이션 리스너 제거)

---

### 2. 호버 인터랙션 (Hover) ⭐

마우스를 올렸을 때 마커를 확대하고 라벨을 강조하는 기능입니다.

#### 설정값
```typescript
const HOVER_CONFIG = {
  scaleMultiplier: 1.3,                         // 확대 비율 (1.3배)
  transitionDuration: 200,                       // 전환 시간 (200ms)
  labelBackgroundColor: 'rgba(255, 255, 255, 0.9)', // 라벨 배경색
  labelFont: '14px SUIT Medium',                 // 라벨 폰트
}
```

#### 사용 예시

```tsx
import { useMarkerStore } from '../stores/cesium'
import { ScreenSpaceEventHandler, ScreenSpaceEventType } from 'cesium'

function CesiumMapWithHover() {
  const { setMarkerHover } = useMarkerStore()
  const viewerRef = useRef<CesiumViewer>(null)

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas)

    // 마우스 이동 시 호버 감지
    handler.setInputAction((movement: any) => {
      const pickedObject = viewer.scene.pick(movement.endPosition)

      if (pickedObject && pickedObject.id) {
        const entity = pickedObject.id
        const entityId = entity.id?.toString()

        // 디바이스 마커인 경우에만 호버 효과 적용
        if (entityId?.startsWith('device-')) {
          setMarkerHover(viewer, entityId)
        } else {
          setMarkerHover(viewer, null)
        }
      } else {
        setMarkerHover(viewer, null)
      }
    }, ScreenSpaceEventType.MOUSE_MOVE)

    return () => {
      handler.destroy()
    }
  }, [setMarkerHover])

  return <div ref={cesiumContainerRef} />
}
```

#### 동작 원리
- 이전 호버 마커를 원래 크기로 복원
- 새로운 호버 마커를 1.3배 확대
- 라벨 스케일, 폰트, 색상 변경으로 가독성 향상
- `hoveredMarkerId` 상태를 통한 단일 호버 관리

---

## 통합 사용 예시

### CesiumMap 컴포넌트에 Blink + Hover 통합

```tsx
import { useRef, useEffect } from 'react'
import { Viewer as CesiumViewer, ScreenSpaceEventHandler, ScreenSpaceEventType } from 'cesium'
import { useMarkerStore } from '../stores/cesium'
import type { Event } from '../services/types'

interface CesiumMapProps {
  events: Event[]
  // ... 기타 props
}

export default function CesiumMap({ events }: CesiumMapProps) {
  const viewerRef = useRef<CesiumViewer | null>(null)
  const {
    addMarker,
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
      criticalEvents.forEach(event => {
        const markerId = `device-${event.deviceId}`
        stopMarkerBlink(viewer, markerId)
      })
    }
  }, [events, startMarkerBlink, stopMarkerBlink])

  // 2. 호버 인터랙션 설정
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas)

    handler.setInputAction((movement: any) => {
      const pickedObject = viewer.scene.pick(movement.endPosition)

      if (pickedObject && pickedObject.id) {
        const entity = pickedObject.id
        const entityId = entity.id?.toString()

        // 센서 마커에만 호버 효과 적용
        if (entityId?.startsWith('device-')) {
          setMarkerHover(viewer, entityId)
        } else {
          setMarkerHover(viewer, null)
        }
      } else {
        setMarkerHover(viewer, null)
      }
    }, ScreenSpaceEventType.MOUSE_MOVE)

    return () => {
      handler.destroy()
    }
  }, [setMarkerHover])

  return (
    <div className="relative w-full h-full">
      <div ref={cesiumContainerRef} className="w-full h-full" />
    </div>
  )
}
```

---

## 성능 최적화 팁

### 1. 깜빡임 애니메이션
- 동시에 깜빡이는 마커가 10개 이상인 경우 성능 저하 가능
- 중요도가 높은 이벤트만 깜빡임 적용 권장
- `stopMarkerBlink`를 통한 명시적 정리 필수

### 2. 호버 인터랙션
- `MOUSE_MOVE` 이벤트는 프레임마다 발생하므로 디바운싱 고려
- 많은 마커가 있는 경우 `viewer.scene.pick` 호출 빈도 최적화
- 호버 대상이 아닌 엔티티는 빠르게 필터링

### 3. requestRender 호출
- 두 기능 모두 `viewer.scene.requestRender()` 호출
- Cesium의 렌더링 최적화 메커니즘을 활용하여 불필요한 렌더링 방지

---

## 주의사항

1. **Viewer 인스턴스 확인**
   - 모든 함수 호출 전에 `viewer`가 `null`이 아니고 `isDestroyed()`가 `false`인지 확인

2. **메모리 누수 방지**
   - 컴포넌트 언마운트 시 `stopMarkerBlink` 호출 필수
   - `ScreenSpaceEventHandler` 정리 (`handler.destroy()`) 필수

3. **마커 ID 네이밍**
   - 깜빡임/호버 기능은 마커 ID를 기반으로 동작
   - 일관된 ID 네이밍 규칙 사용 (예: `device-{deviceId}`, `park-{siteId}`)

4. **상태 동기화**
   - 마커가 제거되었을 때 깜빡임 애니메이션도 함께 정리
   - `clearAllMarkers` 호출 시 모든 애니메이션 자동 정리됨

---

## API 레퍼런스

### startMarkerBlink(viewer, markerId, duration?)
깜빡임 애니메이션을 시작합니다.

**파라미터:**
- `viewer: CesiumViewer` - Cesium 뷰어 인스턴스
- `markerId: string` - 마커의 고유 ID
- `duration?: number` - 애니메이션 주기 (기본값: 1000ms)

**예시:**
```typescript
startMarkerBlink(viewer, 'device-123', 800)
```

### stopMarkerBlink(viewer, markerId)
깜빡임 애니메이션을 중지합니다.

**파라미터:**
- `viewer: CesiumViewer` - Cesium 뷰어 인스턴스
- `markerId: string` - 마커의 고유 ID

**예시:**
```typescript
stopMarkerBlink(viewer, 'device-123')
```

### setMarkerHover(viewer, markerId)
마커에 호버 효과를 적용합니다.

**파라미터:**
- `viewer: CesiumViewer` - Cesium 뷰어 인스턴스
- `markerId: string | null` - 마커의 고유 ID (null이면 모든 호버 효과 제거)

**예시:**
```typescript
// 호버 효과 적용
setMarkerHover(viewer, 'device-123')

// 호버 효과 제거
setMarkerHover(viewer, null)
```

---

## 문제 해결

### Q: 깜빡임 애니메이션이 작동하지 않습니다
- 마커 ID가 정확한지 확인
- `viewer.entities.getById(markerId)`로 엔티티 존재 여부 확인
- `entity.billboard`이 존재하는지 확인
- 브라우저 콘솔에서 에러 메시지 확인

### Q: 호버 시 마커가 복원되지 않습니다
- `ScreenSpaceEventHandler`가 정상적으로 등록되었는지 확인
- `setMarkerHover(viewer, null)` 호출 확인
- 여러 호버 핸들러가 충돌하지 않는지 확인

### Q: 성능이 저하됩니다
- 동시에 깜빡이는 마커 수 제한 (최대 10개 권장)
- 호버 이벤트 디바운싱 적용
- `requestRender` 호출 빈도 최적화

---

**작성일:** 2025-10-16
**버전:** 1.0.0
