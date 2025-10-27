# 🌍 Plug Platform Atlas

> IoT 플랫폼과 3D 지도 기반 통합 관제 시스템

성남시 3D 지도와 IoT 센서를 결합한 실시간 모니터링 및 관리 플랫폼입니다. Cesium.js 기반 3D 지도, React 19, Tailwind CSS v4를 활용한 현대적인 웹 애플리케이션입니다.

---

## ✨ 주요 기능

### 🗺️ 3D 지도 시각화
- **Cesium.js 기반** 고품질 3D 지도
- **성남시 3D 타일셋** 통합 (30m 높이 오프셋)
- **Google Map Imagery** + **World Terrain**
- **LOD 최적화** (maximumScreenSpaceError: 32, 3GB 캐시)
- **카메라 고도 기반** lazy loading (< 2km)
- **실시간 마커 관리** (CCTV, IoT 센서, 알람)

### 🎨 UI 컴포넌트 라이브러리
- **43개 컴포넌트** (Atoms 16개, Molecules 15개, Organisms 12개)
- **Radix UI** 기반 접근성 보장
- **Tailwind CSS v4** 최신 버전
- **Storybook 8.6.7**로 문서화
- **shadcn/ui** 최신 패턴 적용

### 🏗️ IoT 통합 관리
- **실시간 대시보드** (카드형/지도형)
- **CCTV 관리** (실시간 스트리밍, 녹화)
- **IoT 센서 모니터링** (온도, 습도, 공기질 등)
- **안내방송 시스템**
- **이벤트 알람** (실시간 알림)
- **시설/사용자/시스템 관리**

---

## 🚀 기술 스택

### Frontend
- **Framework**: React 19
- **Language**: TypeScript 5
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4
- **UI Library**: Radix UI
- **State Management**: Zustand, SWR
- **3D Mapping**: Cesium.js

### Backend
- **API Server**: Spring Boot (외부)
- **API 문서**: http://dev.pluxity.com/api/api-docs
- **Swagger UI**: http://dev.pluxity.com/api/swagger-ui/index.html

### DevOps
- **Monorepo**: pnpm workspaces + Turborepo
- **Package Manager**: pnpm >=10.0.0
- **Node**: >=22.0.0
- **Documentation**: Storybook 8.6.7

---

## 📦 프로젝트 구조

```
plug-platform-atlas/
├── apps/
│   └── a-iot/              # 통합 IoT/관리자 앱 (Cesium 3D 지도 + 관리 기능)
│       ├── src/
│       │   ├── components/ # React 컴포넌트
│       │   ├── stores/     # Zustand 상태 관리
│       │   │   └── cesium/ # Cesium Store (Viewer, Camera, Marker)
│       │   ├── hooks/      # 커스텀 훅
│       │   └── pages/      # 페이지 컴포넌트
│       └── README.md
│
├── packages/
│   ├── ui/                 # 공유 UI 컴포넌트 라이브러리 (43개 컴포넌트)
│   │   ├── src/
│   │   │   ├── atoms/      # 기본 컴포넌트 (Button, Input 등)
│   │   │   ├── molecules/  # 조합 컴포넌트 (Card, Dialog 등)
│   │   │   └── organisms/  # 복합 컴포넌트 (DataTable, Form 등)
│   │   └── .storybook/     # Storybook 설정
│   │
│   ├── api-hooks/          # API 클라이언트 & SWR hooks
│   │   ├── src/
│   │   │   ├── client/     # Axios 클라이언트
│   │   │   └── hooks/      # SWR hooks
│   │   └── types/          # API 타입 정의
│   │
│   ├── types/              # 공유 TypeScript 타입 정의
│   │   └── src/
│   │       ├── api/        # API 타입
│   │       ├── domain/     # 도메인 모델
│   │       └── common/     # 공통 타입
│   │
│   └── web-core/           # 공유 web/admin hooks & 도메인 로직
│       └── src/
│           ├── hooks/      # 커스텀 훅
│           └── utils/      # 유틸리티 함수
│
└── pnpm-workspace.yaml     # pnpm 워크스페이스 설정
```

---

## 🛠️ 시작하기

### 1. 필수 요구사항

- **Node.js**: `>=22.0.0`
- **pnpm**: `>=10.0.0`

```bash
# pnpm 설치
npm install -g pnpm@latest
```

### 2. 의존성 설치

```bash
# 프로젝트 클론
git clone https://github.com/pluxity/plug-platform-atlas.git
cd plug-platform-atlas

# 의존성 설치
pnpm install
```

### 3. 환경 변수 설정

`.env` 파일을 생성하고 다음 변수를 설정하세요:

```env
# Cesium Ion Access Token
VITE_CESIUM_ION_ACCESS_TOKEN=your_token_here

# Cesium Assets
VITE_CESIUM_GOOGLE_MAP_ASSET_ID=your_asset_id
VITE_CESIUM_TERRAIN_ASSET_ID=your_terrain_id

# API Server
VITE_API_BASE_URL=http://dev.pluxity.com/api
```

### 4. 개발 서버 실행

```bash
# IoT 앱 실행 (기본)
pnpm dev

# Storybook 실행 (UI 컴포넌트 개발)
pnpm storybook
```

---

## 💻 개발 가이드

### 주요 명령어

#### 루트 레벨
```bash
pnpm dev              # a-iot 앱 개발 서버 실행 (기본)
pnpm storybook        # Storybook 실행 (UI 라이브러리)
pnpm build            # 전체 빌드
pnpm type-check       # TypeScript 타입 체크
pnpm lint             # 린트 실행
pnpm clean            # 빌드 산출물 및 node_modules 정리
```

#### 패키지별 명령어
```bash
pnpm a-iot <command>  # a-iot 앱에서 명령어 실행
pnpm ui <command>     # ui 패키지에서 명령어 실행
```

#### 사용 예시
```bash
pnpm a-iot build      # IoT 앱 빌드
pnpm a-iot dev        # IoT 앱 개발 서버 실행
pnpm ui storybook     # UI Storybook 실행
pnpm ui docs:gen      # UI 문서 생성
```

---

## 📖 주요 기능 가이드

### 🗺️ Cesium 3D 지도

#### Cesium Store 사용하기

Zustand 기반으로 구성된 Cesium Store는 Viewer, Camera, Marker 관리를 제공합니다.

```tsx
import {
  useViewerStore,
  useCameraStore,
  useMarkerStore,
} from '@/stores/cesium'

function MapComponent() {
  const { viewer, initializeViewer } = useViewerStore()
  const { focusOn } = useCameraStore()
  const { addMarker } = useMarkerStore()

  // Viewer 초기화
  useEffect(() => {
    if (containerRef.current && !viewer) {
      initializeViewer(containerRef.current)
    }
  }, [])

  // CCTV 마커 추가
  const handleAddMarker = () => {
    addMarker(viewer, {
      id: 'cctv-1',
      lon: 127.1114,
      lat: 37.3948,
      height: 3,
      image: '/icons/cctv-marker.png',
      label: 'CCTV #1',
    })

    // 마커로 포커스
    focusOn(viewer, { lon: 127.1114, lat: 37.3948 }, 1500)
  }

  return <div ref={containerRef} style={{ height: '100vh' }} />
}
```

**자세한 가이드**: [Cesium Store README](./apps/a-iot/src/stores/cesium/README.md)

#### 주요 기능
- ✅ Singleton Viewer 패턴 (전역 공유)
- ✅ Google Map Imagery + World Terrain 자동 로드
- ✅ 마커 LOD (거리 기반 자동 스케일링)
- ✅ WKT 좌표 지원 (POINT, POLYGON)
- ✅ 카메라 제어 (setView, flyToPosition, focusOn)

### 🎨 UI 컴포넌트

#### 컴포넌트 사용하기

```tsx
import { Button, Card, Dialog, toast } from '@plug-atlas/ui'

function MyComponent() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>제목</Card.Title>
      </Card.Header>
      <Card.Content>
        <p>내용</p>
      </Card.Content>
      <Card.Footer>
        <Button onClick={() => toast.success("성공!")}>
          저장
        </Button>
      </Card.Footer>
    </Card>
  )
}
```

#### Storybook으로 컴포넌트 탐색

```bash
pnpm storybook
# http://localhost:6006 에서 43개 컴포넌트 확인
```

**Toast 사용법**: [Sonner README](./packages/ui/src/molecules/sonner/README.md)

#### 새 컴포넌트 추가하기

1. **shadcn/ui 최신 버전** 소스 가져오기
2. `packages/ui/src/[category]/`에 컴포넌트 추가
3. Stories 작성 (`*.stories.tsx`)
4. Storybook Auto Docs 자동 생성

```tsx
// packages/ui/src/atoms/new-component/NewComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { NewComponent } from './NewComponent'

const meta: Meta<typeof NewComponent> = {
  title: 'Atoms/NewComponent',
  component: NewComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '컴포넌트 설명을 한국어로 작성합니다.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof NewComponent>

export const Default: Story = {
  args: {
    variant: 'default',
  },
}
```

### 📡 API 연동

#### SWR Hooks 사용

```tsx
import { useCCTV, useSiteList } from '@plug-atlas/api-hooks'

function CCTVList() {
  const { data: cctvs, isLoading, error } = useCCTV()

  if (isLoading) return <div>로딩 중...</div>
  if (error) return <div>에러 발생</div>

  return (
    <ul>
      {cctvs.map(cctv => (
        <li key={cctv.id}>{cctv.name}</li>
      ))}
    </ul>
  )
}
```

#### API 문서

- **API Docs**: http://dev.pluxity.com/api/api-docs
- **Swagger UI**: http://dev.pluxity.com/api/swagger-ui/index.html

---

## 🏗️ 빌드 및 배포

### 프로덕션 빌드

```bash
# 전체 빌드
pnpm build

# 특정 앱만 빌드
pnpm a-iot build
```

### 타입 체크

```bash
pnpm type-check
```

### 린트

```bash
pnpm lint
```

---

## 🤝 기여 가이드

### GitHub 이슈 관리

이슈 생성 및 PR 관리는 **`github-project-manager` 스킬**이 자동으로 처리합니다.

```
"Feature 이슈 만들어줘 - [기능명], high priority로 seung-choi에게 할당"
```

### 이슈 템플릿

- **Feature**: 새로운 기능 구현 요청
- **Bug**: 버그 리포트 및 수정 요청
- **Enhancement**: 기존 기능 개선 제안
- **Documentation**: 문서 작성 및 개선

### GitHub Project

- **프로젝트 URL**: https://github.com/orgs/pluxity/projects/11
- **프로젝트 번호**: 11

### 담당자

- `seung-choi` - 최승철
- `whlee-pluxity` - 이우현
- `yjsun1996` - 선용준
- `Nadk-pluxity` - 김낙현

---

## 📚 문서

- [Cesium Store 가이드](./apps/a-iot/src/stores/cesium/README.md) - Viewer, Camera, Marker 관리
- [Sonner Toast 가이드](./packages/ui/src/molecules/sonner/README.md) - Toast 알림 사용법
- [Storybook](http://localhost:6006) - UI 컴포넌트 문서 (개발 서버 실행 시)
- [API 문서](http://dev.pluxity.com/api/api-docs) - REST API 명세
- [Swagger UI](http://dev.pluxity.com/api/swagger-ui/index.html) - API 테스트

---

## 🔧 트러블슈팅

### Cesium 3D 타일셋이 보이지 않아요

1. nginx 서버가 실행 중인지 확인하세요
2. `http://localhost/seongnam/sn_3d/` 접근 가능 여부 확인
3. 카메라 고도를 2km 이하로 낮추세요 (lazy loading)

### 환경 변수가 작동하지 않아요

1. `.env` 파일이 루트에 있는지 확인
2. 변수명이 `VITE_`로 시작하는지 확인
3. 개발 서버 재시작

### 타입 에러가 발생해요

```bash
pnpm clean
pnpm install
pnpm type-check
```

---

## 📄 라이선스

MIT License

---

## 🌟 최근 업데이트

### 2025-10-24
- GitHub Project Manager 스킬 추가 (이슈/PR 자동화)
- README 한국어 전환 및 구조 개선

### 2025-10-16
- admin 앱을 a-iot로 통합 (단일 앱 구조)
- 사이드바 메뉴 구조 개편
- Cesium 3D 지도 GoogleMap Imagery + World Terrain 통합

### 2025-10-01
- Cesium Store 카테고리별 분리 (Viewer, Camera, Marker)
- Menubar, Sheet, Sidebar 컴포넌트 추가

---

**Made with ❤️ by Pluxity**
