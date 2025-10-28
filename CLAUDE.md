# Claude Code - 작업 컨텍스트

## 프로젝트 개요

**프로젝트명**: plug-platform-atlas
**주요 기술**: React 19, Storybook 8.6.7, Tailwind CSS v4, TypeScript, Radix UI, Cesium.js

---

## 모노레포 구조

```
plug-platform-atlas/
├── apps/
│   └── a-iot/              # 통합 IoT/관리자 앱 (Cesium 3D 지도 + 관리 기능)
├── packages/
│   ├── ui/                 # 공유 UI 라이브러리 (43개 컴포넌트)
│   ├── api-hooks/          # API 클라이언트 & SWR hooks
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
# 앱 실행
pnpm dev                    # 또는 pnpm a-iot dev

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

## GitHub 이슈 및 프로젝트 관리

### 이슈/PR 관리 스킬

이슈 생성, PR 관리, 프로젝트 필드 설정은 **`github-project-manager` 스킬**이 자동으로 처리합니다.

**사용 예시:**
- "Feature 이슈 만들어줘 - [기능명], high priority로 seung-choi에게 할당"
- "이슈 #42에 대한 PR 생성해줘"
- "이슈에 Sprint 필드 설정해줘"

### 프로젝트 정보

- **Organization**: pluxity
- **Repository**: plug-platform-atlas
- **프로젝트**: plug-platform-atlas
- **프로젝트 URL**: https://github.com/orgs/pluxity/projects/11
- **프로젝트 번호**: 11

### 담당자 목록

- `seung-choi` - 최승철
- `whlee-pluxity` - 이우현
- `yjsun1996` - 선용준
- `Nadk-pluxity` - 김낙현

### API 문서

⚠️ **모든 Feature 이슈는 반드시 API 문서를 참고 자료에 포함해야 합니다:**
- **API 문서**: http://dev.pluxity.com/api/api-docs
- **Swagger UI**: http://dev.pluxity.com/api/swagger-ui/index.html

---

## Git 작업 규칙

### Commit & Push 정책

⚠️ **중요**: 모든 commit과 push는 **사용자 허락 후에만** 진행합니다.

**절차**:
1. 코드 작성 및 변경 완료
2. 사용자에게 변경사항 요약 및 commit 메시지 제안
3. **사용자 승인 대기**
4. 승인 후 commit & push 실행

**예외 없음**: 긴급한 상황이나 자동화된 작업이라도 반드시 사용자 승인 필요

### PR 타이틀 형식

모든 PR 타이틀은 다음 형식을 따릅니다:
```
#이슈번호 - 타이틀
```

**예시**: `#35 - 3D 관제 UI 및 화면 모드 전환`

---

## 최근 작업

### 2025-10-24
- **GitHub Project Manager 스킬 생성**:
  - 이슈/PR 관리 자동화 스킬 개발 (전역 스킬로 설치)
  - 프로젝트 필드 자동 설정 기능
  - 템플릿 기반 이슈 생성
- **CLAUDE.md 간소화**: 이슈 관리 관련 상세 내용을 스킬로 이관
- **.gitignore 업데이트**: .claude/ 디렉토리 추가 (로컬 스킬 제외)

### 2025-10-16
- **앱 통합**: admin 앱을 a-iot로 통합 (단일 앱으로 관리)
- **사이드바 메뉴 구조 개편**:
  - 메인 메뉴: 대시보드(카드형/지도형), 이벤트, IoT 센서, 안내방송
  - 관리 기능: 시설 관리, 사용자 관리, 시스템 관리
  - 실시간 알람: onClick 핸들러로 구현 (페이지 이동 없음)
- **Cesium 3D 지도**: GoogleMap Imagery + World Terrain 통합
- **GitHub 이슈 템플릿**: API 문서 참조 섹션 필수화 (CLAUDE.md 업데이트)

### 2025-10-01
- Cesium 3D 지도 통합 (SeongnamTileset 분리, LOD 최적화)
- Menubar, Sheet, Sidebar 컴포넌트 추가
- **진행 중**: 모든 UI 컴포넌트를 shadcn 최신 버전으로 일괄 업데이트

### 2025-09-30
- 모노레포 구조 개편 (apps/web → a-iot, admin)
- web-core, api-hooks 패키지 추가
- README 업데이트

---

**마지막 업데이트**: 2025-10-24
