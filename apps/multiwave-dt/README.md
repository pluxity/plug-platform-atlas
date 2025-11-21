# Multiwave Digital Twin - 실시간 객체 트래킹 시스템

> 멀티웨이브 멀티모달 AI 기반 차세대 실시간 디지털트윈 지휘통제 지능화 시스템

CCTV와 센서 데이터를 활용한 실시간 객체 추적 및 경로 시각화 시스템입니다.

## 🎯 주요 기능

### 실시간 추적 (Real-time Tracking)
- WebSocket 기반 실시간 객체 위치 업데이트
- 사람, 차량 등 다양한 객체 타입 지원
- 경로 이력 저장 및 시각화

### 3D 지도 시각화
- Cesium.js 기반 3D 지도
- 실시간 객체 위치 표시
- 경로 궤적 렌더링

### 상태 관리
- Zustand 기반 효율적인 상태 관리
- 추적 객체 및 경로 데이터 관리
- WebSocket 연결 상태 모니터링

---

## 🛠️ 기술 스택

| 카테고리 | 기술 |
|---------|------|
| **Framework** | React 19, TypeScript |
| **Build** | Vite 6 |
| **3D Map** | Cesium.js |
| **Real-time** | WebSocket API |
| **State** | Zustand |
| **UI** | Tailwind CSS v4, Radix UI |
| **Router** | React Router v7 |

---

## 📁 프로젝트 구조

```
apps/multiwave-dt/
├── src/
│   ├── components/
│   │   └── CesiumMap.tsx        # Cesium 3D 지도 컴포넌트
│   ├── pages/
│   │   └── TrackingPage.tsx     # 추적 메인 페이지
│   ├── hooks/
│   │   └── useWebSocket.ts      # WebSocket 훅
│   ├── stores/
│   │   ├── useCesiumViewer.ts      # Cesium Viewer 상태 관리
│   │   └── useTrackingStore.ts     # 추적 데이터 상태 관리
│   ├── App.tsx                  # 라우팅 설정
│   └── main.tsx                 # 엔트리 포인트
├── .env.example                 # 환경 변수 예시
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🚀 시작하기

### 1. 환경 변수 설정

`.env` 파일을 생성하고 다음 값을 설정하세요:

```bash
# Cesium Ion Access Token
VITE_CESIUM_ION_ACCESS_TOKEN=your_token_here

# WebSocket Server
VITE_WEBSOCKET_URL=ws://localhost:8765
```

### 2. 앱 실행

```bash
# 루트에서 실행
pnpm dev:multiwave

# 또는 패키지 필터 사용
pnpm multiwave-dt dev
```

앱이 http://localhost:4000 에서 실행됩니다.

### 3. 빌드

#### 개발 빌드
```bash
# 루트에서 빌드 (localhost 환경)
pnpm build

# 또는 개별 빌드
pnpm multiwave-dt build
```

#### 스테이징/프로덕션 빌드
```bash
# 스테이징 환경 빌드 (.env.staging 사용)
pnpm --filter @plug-atlas/multiwave-dt build:staging

# 결과물: dist/ 폴더
# - Base URL: /multiwave-dt/
# - WebSocket: ws://plugplatform.com/multiwave-dt/ws
```

**⚠️ 중요**: 배포 시 반드시 `build:staging` 명령어를 사용하세요!

---

## 📡 WebSocket API

### 이벤트 수신

#### `tracking:init`
초기 추적 데이터를 수신합니다.

```typescript
{
  id: string              // 객체 고유 ID
  type: 'person' | 'vehicle' | 'unknown'
  position: {
    latitude: number
    longitude: number
    altitude?: number
  }
  timestamp: number       // Unix timestamp (ms)
  cameraId?: string       // 관련 카메라 ID
  metadata?: Record<string, unknown>
}[]
```

#### `tracking:update`
실시간 위치 업데이트를 수신합니다.

```typescript
{
  id: string
  type: 'person' | 'vehicle' | 'unknown'
  position: {
    latitude: number
    longitude: number
    altitude?: number
  }
  timestamp: number
  cameraId?: string
  metadata?: Record<string, unknown>
}
```

---

## 🔧 개발 가이드

### 상태 관리

#### 추적 데이터 (`useTrackingStore`)

```typescript
const {
  objects,              // Map<string, TrackingObject>
  paths,                // Map<string, TrackingPath>
  connectionStatus,     // 'connected' | 'disconnected' | 'error'
  addTrackingData,      // 초기 데이터 추가
  updateObjectPosition, // 위치 업데이트
  removeObject,         // 객체 제거
  clearAll,             // 전체 초기화
} = useTrackingStore()
```

#### Cesium Viewer (`useCesiumViewer`)

```typescript
const {
  viewer,               // CesiumViewer | null
  initializeViewer,     // Viewer 초기화
  destroyViewer,        // Viewer 제거
} = useCesiumViewer()
```

### WebSocket 연결

```typescript
import { useWebSocket } from '@/hooks/useWebSocket'

function MyComponent() {
  const { socket, connect, disconnect } = useWebSocket()

  // 자동으로 연결/해제됨
  // 필요 시 수동 제어 가능
}
```

---

## 🎨 UI 컴포넌트

공유 UI 컴포넌트는 `@plug-atlas/ui` 패키지에서 가져옵니다:

```typescript
import { Button, Card, Toaster } from '@plug-atlas/ui'
```

---

## 📊 상태 표시

앱 우측 상단에 실시간 상태가 표시됩니다:

- **WebSocket 연결 상태**:
  - 🟢 연결됨 (초록)
  - 🔴 오류 (빨강)
  - ⚪ 연결 끊김 (회색)
- **추적 중인 객체 수**

---

## 🔗 관련 링크

- **메인 프로젝트**: [plug-platform-atlas](../../README.md)
- **UI 라이브러리**: [packages/ui](../../packages/ui/README.md)
- **API Hooks**: [packages/api-hooks](../../packages/api-hooks/README.md)

---

## 📝 이슈 및 요청사항

GitHub Issues를 통해 버그 리포트나 기능 요청을 올려주세요.
- **Label**: `app:multiwave-dt`
- **Component**: `multiwave-dt App`

---

**최종 업데이트**: 2025-10-24
