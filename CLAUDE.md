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
apps/a-iot/src/
├── components/map/
│   ├── CesiumMap.tsx           # 메인 지도 (마커·폴리곤·타일셋 오케스트레이션)
│   ├── MapControls.tsx         # 성남 타일셋/행정구역 토글 등 컨트롤
│   └── MapLayerSelector.tsx    # 일반 ↔ 위성 지도 전환
└── stores/cesium/
    ├── viewerStore.ts          # Viewer 생성·초기화, Ion 토큰·배너·카메라 제한
    ├── tilesetStore.ts         # Ion/로컬 타일셋 로딩, 높이 오프셋, 자동 숨김
    ├── imageryStore.ts         # Imagery 레이어 전환
    ├── usePolygonStore.ts      # 폴리곤 그리기(WKT)·행정구역 GeoJSON 렌더링
    ├── cameraStore.ts          # 카메라 제어(focusOn, flyToPosition)
    ├── markerStore.ts          # 마커 생성·색상·깜빡임·호버
    ├── lodStore.ts             # 카메라 거리 기반 LOD
    └── constants.ts            # Asset ID·높이 오프셋 등 환경변수 기반 설정
```
> 상세 API는 `apps/a-iot/src/stores/cesium/README.md` 참고.

### 주요 기능
- Cesium World Terrain 통합, 기본 imagery는 위성(`ion-satellite`, Asset 2)
- LOD 최적화 (maximumScreenSpaceError: 48, cache 1GB + overflow 512MB)
- 카메라 고도 기반 타일셋 자동 숨김 (`TILESET_AUTO_HIDE_THRESHOLD` = 15,000m)
- 성남시 3D 타일셋 (+20m height offset), `https://dev.pluxity.com/3d-tiles` 에서 서빙
- Ion 크레딧 배너는 숨겨진 credit container로 제거 (⚠️ Ion ToS 크레딧 표시 요건과 상충 — 상용 배포 시 검토 필요)
- 모든 Ion Asset ID·토큰은 `.env.*` 환경변수로 관리 (`.env.development`/`.env.production`은 gitignore, `.env.example` 참고)

### 공원(Site) 3D 타일셋

- 공원 데이터(Site)는 API로 관리되나, **3D 타일셋 Asset ID는 `constants.ts`에 하드코딩** (`ION_ASSETS.TILESETS`: 중앙공원·율동공원)
- `loadAllIonTilesets()`가 정의된 모든 공원 타일셋을 항상 로드하고 카메라 거리로만 표시/숨김
- ⚠️ **새 공원 타일셋 추가 시 코드 수정 4곳 필요**: `.env.*`(Asset ID) → `constants.ts`(`ION_ASSETS.TILESETS` + `TILESET_HEIGHT_OFFSETS`) → `vite-env.d.ts`(타입)
- 개선 방향(별도 이슈): Site 엔티티에 `ionAssetId`/`heightOffset` 필드 추가 → 지도가 `sites` 기반 동적 로드 → 코드 수정 없이 공원 추가만으로 반영

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

- `Nadk-pluxity` - 나동규
- `whlee-pluxity` - 이원희
- `yjsun1996` - 윤지선
- `seung-choi` - 최승은

### API 문서

⚠️ **모든 Feature 이슈는 반드시 API 문서를 참고 자료에 포함해야 합니다:**
- **API 문서**: https://dev.pluxity.com/api/api-docs
- **Swagger UI**: https://dev.pluxity.com/api/swagger-ui/index.html

---

## 최근 작업

### 2026-07-07
- **CLAUDE.md 최신화**: Cesium 3D 지도 섹션을 실제 코드와 동기화
  - 구조 갱신: 컴포넌트는 `components/map/`, Cesium 로직은 `stores/cesium/` (store 기반)
  - 값 정정: mSSE 32→48, cache 3GB→1GB(+512MB overflow), 성남 오프셋 +30m→+20m, auto-hide threshold 15,000m
  - 로컬 타일셋 서빙 위치: nginx localhost → `https://dev.pluxity.com/3d-tiles`
  - Ion 크레딧 배너 제거 방식 및 ToS 검토 필요 사항 명시
- **공원 3D 타일셋 결합 구조 문서화**: 타일셋 Asset ID가 `constants.ts`에 하드코딩되어 공원 추가 시 코드 수정 필요함을 명시 + 동적 로드 개선 방향 제안

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

**마지막 업데이트**: 2026-07-07
