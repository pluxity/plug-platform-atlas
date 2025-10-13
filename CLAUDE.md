# Claude Code - 작업 컨텍스트

## 프로젝트 개요

**프로젝트명**: plug-platform-atlas
**주요 기술**: React 19, Storybook 8.6.7, Tailwind CSS v4, TypeScript, Radix UI, Cesium.js

---

## 모노레포 구조

```
plug-platform-atlas/
├── apps/
│   ├── a-iot/              # IoT 앱 (Cesium 3D 지도)
│   └── admin/              # 관리자 앱
├── packages/
│   ├── ui/                 # 공유 UI 라이브러리 (43개 컴포넌트)
│   ├── api-hooks/          # API 클라이언트 & React Query hooks
│   ├── types/              # 공유 타입 정의
│   └── web-core/           # 공유 web/admin hooks & 도메인 로직
└── pnpm-workspace.yaml
```

---

## UI 패키지 (`packages/ui/`)

### 컴포넌트 구조

- **Atoms** (16개): Button, Input, Checkbox, Switch, Label, Badge, Avatar, Progress, Separator, Skeleton, Spinner, Toggle, RadioGroup, AspectRatio, InputOTP, Select
- **Molecules** (15개): Accordion, Alert, Card, Tabs, Tooltip, Popover, DropdownMenu, Toast, Collapsible, HoverCard, Pagination, ToggleGroup, ContextMenu, Sonner, **Menubar**, **Sheet**
- **Organisms** (12개): Dialog, AlertDialog, Calendar, DatePicker, Command, Combobox, DataTable, Form, NavigationMenu, Chart, **Sidebar**

### shadcn/ui 최신 버전 사용 원칙

**중요**: 모든 컴포넌트는 shadcn/ui 최신 버전 구조를 따름
- `data-slot` 속성 사용
- `React.ComponentProps` 타입 사용 (forwardRef 제거)
- Tailwind v4 문법
- `outline-hidden` 등 최신 유틸리티 클래스

---

## Cesium 3D 지도 (a-iot 앱)

### 구조
```
apps/a-iot/src/components/
├── CesiumMap.tsx           # Viewer 초기화
├── SeongnamTileset.tsx     # 타일셋 로딩 & 관리
└── AppLayout.tsx           # 레이아웃
```

### 주요 기능
- World Terrain 통합
- LOD 최적화 (maximumScreenSpaceError: 32, cache: 3GB)
- 카메라 고도 기반 lazy loading (< 2km)
- 성남시 3D 타일셋 (+30m height offset)
- nginx 로컬 서버 (`http://localhost/seongnam/sn_3d/`)

---

## 주요 명령어

```bash
# IoT 앱 실행
pnpm dev                    # 또는 pnpm a-iot dev

# Admin 앱 실행
pnpm admin dev

# Storybook 실행
pnpm storybook              # 또는 pnpm ui storybook

# 타입 체크
pnpm type-check

# 빌드
pnpm build
```

---

## 컴포넌트 개발 가이드

### 새 컴포넌트 추가

1. shadcn/ui 최신 버전 소스 가져오기
2. 상대 경로로 import 수정 (`../../lib/utils` 등)
3. Stories 작성 (`*.stories.tsx`)
4. Storybook Auto Docs 자동 생성

### Story 작성 예시

```tsx
const meta: Meta<typeof Component> = {
  title: 'Category/ComponentName',
  component: Component,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '한국어로 상세 설명...',
      },
    },
  },
}

export const Default: Story = {
  args: {
    variant: 'default',
  },
}
```

---

## 엔진 요구사항

- Node.js: >=22.0.0
- pnpm: >=10.0.0

---

## 최근 작업

### 2025-10-01
- Cesium 3D 지도 통합 (SeongnamTileset 분리, LOD 최적화)
- Menubar, Sheet, Sidebar 컴포넌트 추가
- **진행 중**: 모든 UI 컴포넌트를 shadcn 최신 버전으로 일괄 업데이트

### 2025-09-30
- 모노레포 구조 개편 (apps/web → a-iot, admin)
- web-core, api-hooks 패키지 추가
- README 업데이트

---

**마지막 업데이트**: 2025-10-01
