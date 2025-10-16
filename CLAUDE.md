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

## GitHub 이슈 관리

### 이슈 템플릿

프로젝트는 4가지 이슈 템플릿을 제공합니다:
- **Feature**: 새로운 기능 구현 요청
- **Bug**: 버그 리포트 및 수정 요청
- **Enhancement**: 기존 기능 개선 제안
- **Documentation**: 문서 작성 및 개선

### 담당자 목록

- `seung-choi` - 최승철
- `whlee-pluxity` - 이우현
- `yjsun1996` - 선용준
- `Nadk-pluxity` - 김낙현

### GitHub 프로젝트

**프로젝트**: plug-platform-atlas
**URL**: https://github.com/orgs/pluxity/projects/11
**프로젝트 번호**: 11
**프로젝트 ID**: `PVT_kwDOC1m_S84BEip8`

**주요 필드 ID:**
- Start Date: `PVTF_lADOC1m_S84BEip8zg2I3Yc`
- Due Date: `PVTF_lADOC1m_S84BEip8zg2I3Yg`
- Priority: `PVTSSF_lADOC1m_S84BEip8zg2I3bM`
- Component: `PVTSSF_lADOC1m_S84BEip8zg2I_HA`
- Sprint: `PVTSSF_lADOC1m_S84BEip8zg2I3bI`
- Status: `PVTSSF_lADOC1m_S84BEip8zg2I2ls`

⚠️ **중요**: 모든 이슈는 반드시 이 프로젝트에 할당되어야 합니다.

### 이슈 생성 명령어

```bash
# 기본 이슈 생성 (프로젝트에 할당)
ISSUE_URL=$(gh issue create --title "제목" --body "내용" --json url -q .url)
gh project item-add 11 --owner pluxity --url $ISSUE_URL

# 담당자 지정 + 프로젝트 할당
ISSUE_URL=$(gh issue create --title "제목" --body "내용" --assignee seung-choi --json url -q .url)
gh project item-add 11 --owner pluxity --url $ISSUE_URL

# 라벨 추가 + 프로젝트 할당
ISSUE_URL=$(gh issue create --title "제목" --body "내용" --label feature,high-priority --json url -q .url)
gh project item-add 11 --owner pluxity --url $ISSUE_URL

# 완전한 이슈 생성 예시
ISSUE_URL=$(gh issue create \
  --title "[FEATURE] 제목" \
  --body "내용" \
  --assignee seung-choi \
  --label feature,high-priority \
  --json url -q .url)
gh project item-add 11 --owner pluxity --url $ISSUE_URL

# 템플릿 사용
gh issue create --template feature.md
```

### 프로젝트 필드 설정

이슈를 프로젝트에 추가한 후 날짜, 우선순위 등을 설정할 수 있습니다.

```bash
# 프로젝트 아이템 ID 찾기
gh project item-list 11 --owner pluxity --format json --limit 100 | grep "issues/7" -A 5 -B 5

# 또는 이슈 번호로 직접 아이템 ID 추출
ITEM_ID=$(gh project item-list 11 --owner pluxity --format json | jq -r '.items[] | select(.content.number==7) | .id')

# Start Date 설정 (YYYY-MM-DD)
gh project item-edit \
  --id $ITEM_ID \
  --project-id PVT_kwDOC1m_S84BEip8 \
  --field-id PVTF_lADOC1m_S84BEip8zg2I3Yc \
  --date 2025-10-14

# Due Date 설정 (YYYY-MM-DD)
gh project item-edit \
  --id $ITEM_ID \
  --project-id PVT_kwDOC1m_S84BEip8 \
  --field-id PVTF_lADOC1m_S84BEip8zg2I3Yg \
  --date 2025-10-17

# Priority 설정 (High)
gh project item-edit \
  --id $ITEM_ID \
  --project-id PVT_kwDOC1m_S84BEip8 \
  --field-id PVTSSF_lADOC1m_S84BEip8zg2I3bM \
  --single-select-option-id 9355da36

# 우선순위 옵션 ID:
# Critical: e768bd0c
# High: 9355da36
# Medium: cdcaf50d
# Low: 62a4196e
```

### 주요 라벨

- `feature`: 새로운 기능
- `bug`: 버그
- `enhancement`: 개선
- `documentation`: 문서
- `high-priority`: 높은 우선순위
- `low-priority`: 낮은 우선순위
- `in-progress`: 진행 중
- `needs-review`: 리뷰 필요

### 이슈 작성 템플릿 구조

모든 Feature 이슈는 다음 섹션을 포함해야 합니다:

```markdown
## 개요
기능에 대한 간단한 설명

## 주요 기능
1. 기능 1
2. 기능 2
...

## 요구사항

### UI/UX
- [ ] 체크리스트
...

### 기술 요구사항
- [ ] 체크리스트
...

## 기술 스택
- **Frontend**: React 19, TypeScript
- **UI**: Radix UI, Tailwind CSS v4
- **Form**: React Hook Form (권장)
- **Validation**: Zod or Yup
- **API**: [API 이름] (Swagger 참고)
- **State**: React Query

## 참고 자료
- **API 문서**: http://dev.pluxity.com/api/api-docs
- **Swagger UI**: http://dev.pluxity.com/api/swagger-ui/index.html
- **UI 컴포넌트**: packages/ui (관련 컴포넌트 나열)

## 참고사항
- 추가 컨텍스트 및 주의사항
```

### 이슈 작성 주의사항

⚠️ **중요**:
- 이슈 본문에 "Generated with Claude Code" 같은 자동 생성 메시지를 포함하지 마세요.
- **모든 이슈는 반드시 "참고 자료" 섹션에 API 문서와 Swagger UI 링크를 포함해야 합니다.**

---

## 최근 작업

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

**마지막 업데이트**: 2025-10-16
