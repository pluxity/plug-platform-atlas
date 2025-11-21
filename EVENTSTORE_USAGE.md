# EventStore 사용 가이드

## 개요

EventStore는 전역 이벤트 상태를 관리하고, WebSocket을 통해 실시간으로 이벤트 업데이트를 동기화하는 시스템입니다.

## 주요 기능

### 1. 전역 이벤트 상태 관리
- 모든 이벤트를 중앙에서 관리 (`Map<eventId, Event>`)
- 사이트별 이벤트 인덱싱 (`Map<siteId, Set<eventId>>`)
- 빠른 조회 성능

### 2. 실시간 WebSocket 동기화
- `/user/queue/change-event-status`로 이벤트 상태 변경 수신
- `{"siteId": 1, "eventId": 9, "status": "IN_PROGRESS"}` 형태의 페이로드
- 자동으로 EventStore 업데이트

### 3. 컴포넌트 간 데이터 동기화
- Notification, 이벤트 목록, Cesium 마커 등 모든 컴포넌트가 동일한 데이터 공유
- 한 곳에서 업데이트하면 모든 곳에 반영

---

## 사용 예제

### 1. Cesium 마커에서 이벤트 상태 변경 감지

```tsx
// apps/a-iot/src/components/map/EventMarkers.tsx
import { useEventUpdates } from '../../services/hooks';
import { Cartesian3, Color } from 'cesium';

function EventMarkers({ viewer }: { viewer: Viewer }) {
  const events = useEventUpdates({
    status: 'ACTIVE', // ACTIVE 상태만 표시
    onChange: (event, previousEvent) => {
      console.log(`이벤트 ${event.eventId} 상태 변경:`,
        previousEvent?.status, '→', event.status);

      // 마커 색상 업데이트
      const entity = viewer.entities.getById(`event-${event.eventId}`);
      if (entity) {
        entity.billboard.color = getColorByStatus(event.status);
      }
    },
    onAdd: (event) => {
      // 새 이벤트 마커 추가
      viewer.entities.add({
        id: `event-${event.eventId}`,
        position: Cartesian3.fromDegrees(event.longitude, event.latitude),
        billboard: {
          image: '/marker.png',
          color: getColorByLevel(event.level),
        },
      });
    },
    onRemove: (eventId) => {
      // 마커 제거
      viewer.entities.removeById(`event-${eventId}`);
    },
  });

  return null;
}

function getColorByStatus(status: string) {
  switch (status) {
    case 'ACTIVE': return Color.RED;
    case 'IN_PROGRESS': return Color.YELLOW;
    case 'RESOLVED': return Color.GREEN;
    default: return Color.GRAY;
  }
}

function getColorByLevel(level: string) {
  switch (level) {
    case 'DANGER': return Color.RED;
    case 'WARNING': return Color.ORANGE;
    case 'CAUTION': return Color.YELLOW;
    default: return Color.GRAY;
  }
}
```

---

### 2. 특정 사이트의 이벤트만 표시

```tsx
import { useEventsBySite } from '../../services/hooks';

function SiteEventList({ siteId }: { siteId: number }) {
  const events = useEventsBySite(siteId);

  return (
    <div>
      <h3>사이트 {siteId} 이벤트 ({events.length}개)</h3>
      {events.map(event => (
        <EventCard key={event.eventId} event={event} />
      ))}
    </div>
  );
}
```

---

### 3. 특정 이벤트 상세 정보 (실시간 업데이트)

```tsx
import { useEventById } from '../../services/hooks';

function EventDetailPage({ eventId }: { eventId: number }) {
  const event = useEventById(eventId);

  if (!event) {
    return <div>이벤트를 찾을 수 없습니다</div>;
  }

  // WebSocket으로 status가 변경되면 자동으로 리렌더링
  return (
    <div>
      <h2>{event.eventName}</h2>
      <p>상태: {event.status}</p>
      <p>레벨: {event.level}</p>
      <p>업데이트: {event.updatedAt}</p>
    </div>
  );
}
```

---

### 4. 이벤트 목록 페이지 (필터링)

```tsx
import { useEventsByStatus } from '../../services/hooks';

function EventListPage() {
  const activeEvents = useEventsByStatus('ACTIVE');
  const inProgressEvents = useEventsByStatus('IN_PROGRESS');
  const resolvedEvents = useEventsByStatus('RESOLVED');

  return (
    <div>
      <section>
        <h3>진행 중 ({activeEvents.length})</h3>
        {activeEvents.map(event => <EventRow key={event.eventId} event={event} />)}
      </section>

      <section>
        <h3>조치 중 ({inProgressEvents.length})</h3>
        {inProgressEvents.map(event => <EventRow key={event.eventId} event={event} />)}
      </section>

      <section>
        <h3>완료 ({resolvedEvents.length})</h3>
        {resolvedEvents.map(event => <EventRow key={event.eventId} event={event} />)}
      </section>
    </div>
  );
}
```

---

### 5. 고급 사용: 복합 필터링 + 콜백

```tsx
import { useEventUpdates } from '../../services/hooks';

function DangerEventMonitor() {
  const dangerEvents = useEventUpdates({
    onChange: (event, previousEvent) => {
      // DANGER 레벨 이벤트만 처리
      if (event.level === 'DANGER') {
        // 알림음 재생
        playAlertSound();

        // 로그 전송
        sendLog({
          eventId: event.eventId,
          previousStatus: previousEvent?.status,
          newStatus: event.status,
        });
      }
    },
  });

  // DANGER 레벨 필터링
  const filteredEvents = dangerEvents.filter(e => e.level === 'DANGER');

  return (
    <div className="danger-monitor">
      <h3>위험 이벤트 ({filteredEvents.length})</h3>
      {filteredEvents.map(event => (
        <DangerEventCard key={event.eventId} event={event} />
      ))}
    </div>
  );
}
```

---

## 데이터 흐름

```
1. 앱 시작
   ↓
   useInitialNotifications()
   ↓
   GET /api/events?status=ACTIVE
   ↓
   eventStore.setEvents(events)  ← EventStore 초기화
   ↓
   모든 컴포넌트가 eventStore에서 데이터 조회

2. WebSocket 업데이트
   ↓
   WS: /user/queue/change-event-status
   ↓
   페이로드: {"siteId": 1, "eventId": 9, "status": "IN_PROGRESS"}
   ↓
   eventStore.updateEvent(9, updatedEvent)
   ↓
   useEventUpdates의 onChange 콜백 호출
   ↓
   Cesium 마커 색상 변경, 이벤트 목록 업데이트 등
```

---

## EventStore API

### 상태 조회
```tsx
const {
  getEvent,           // (eventId) => Event | undefined
  getEventsBySite,    // (siteId) => Event[]
  getEventsByStatus,  // (status) => Event[]
  getAllEvents,       // () => Event[]
} = useEventStore();
```

### 상태 변경
```tsx
const {
  setEvents,          // (events: Event[]) => void
  addEvent,           // (event: Event) => void
  updateEvent,        // (eventId, updates) => void
  updateEventStatus,  // (eventId, status, updatedBy?) => void
  removeEvent,        // (eventId) => void
  clearEvents,        // () => void
} = useEventStore();
```

---

## 주의사항

### 1. 직접 store 변경 금지
```tsx
// ❌ 잘못된 사용
const { events } = useEventStore();
events.set(1, newEvent); // Map을 직접 수정하면 리렌더링 안 됨

// ✅ 올바른 사용
const { updateEvent } = useEventStore();
updateEvent(1, { status: 'RESOLVED' });
```

### 2. 필터링은 가능한 store에서
```tsx
// ❌ 비효율적
const allEvents = useEventStore(state => state.getAllEvents());
const activeEvents = allEvents.filter(e => e.status === 'ACTIVE');

// ✅ 효율적
const activeEvents = useEventsByStatus('ACTIVE');
```

### 3. useEventUpdates의 콜백은 안정적으로
```tsx
// ❌ 매번 새 함수 생성
useEventUpdates({
  onChange: (event) => {
    updateMarker(event);
  }
});

// ✅ useCallback으로 메모이제이션
const handleChange = useCallback((event) => {
  updateMarker(event);
}, []);

useEventUpdates({ onChange: handleChange });
```

---

## 타입 정의

```typescript
interface Event {
  eventId: number;
  deviceId: string;
  objectId: string;
  occurredAt: string;
  status: 'ACTIVE' | 'IN_PROGRESS' | 'RESOLVED';
  level: 'NORMAL' | 'WARNING' | 'CAUTION' | 'DANGER' | 'DISCONNECTED';
  eventName: string;
  siteId: number;
  siteName: string;
  latitude: number;
  longitude: number;
  // ... 기타 필드
}
```

---

## 마이그레이션 가이드

### 기존 코드에서 EventStore로 전환

**Before:**
```tsx
// 각 컴포넌트가 독립적으로 fetch
function EventList() {
  const { data: events } = useEvents({ status: 'ACTIVE' });
  return <div>{events?.map(...)}</div>;
}
```

**After:**
```tsx
// EventStore에서 조회 (이미 캐시됨)
function EventList() {
  const events = useEventsByStatus('ACTIVE');
  return <div>{events.map(...)}</div>;
}
```

---

## 문제 해결

### Q: 이벤트가 업데이트되지 않아요
A: WebSocket 연결 상태를 확인하세요.
```tsx
const { isConnected } = useStompNotifications();
console.log('WebSocket 연결:', isConnected);
```

### Q: 마커가 중복으로 생성돼요
A: `onAdd` 콜백에서 기존 마커 확인 후 추가하세요.
```tsx
onAdd: (event) => {
  const existing = viewer.entities.getById(`event-${event.eventId}`);
  if (!existing) {
    viewer.entities.add({ ... });
  }
}
```

### Q: 성능 이슈가 있어요
A: 필터링을 최대한 store 레벨에서 하고, 불필요한 리렌더링을 방지하세요.
```tsx
// 특정 사이트만 구독
const events = useEventsBySite(siteId);
```

---

## 참고 파일

- `apps/a-iot/src/stores/eventStore.ts` - EventStore 구현
- `apps/a-iot/src/services/hooks/useStompNotifications.ts` - WebSocket 연동
- `apps/a-iot/src/services/hooks/useEventUpdates.ts` - 이벤트 구독 훅
- `apps/a-iot/src/services/hooks/useInitialNotifications.ts` - 초기 이벤트 로드
