# Claude Code - 작업 컨텍스트

## 프로젝트 개요

**프로젝트명**: plug-platform-atlas
**UI 패키지 경로**: `packages/ui/`
**주요 기술**: React 19, Storybook 8.6.7, Tailwind CSS v4, TypeScript, Radix UI

---

## 프로젝트 구조

```
packages/ui/
├── .storybook/          # Storybook 설정
│   ├── main.ts
│   └── preview.ts
├── src/
│   ├── atoms/          # 원자 컴포넌트 (15개)
│   ├── molecules/      # 분자 컴포넌트 (14개)
│   ├── organisms/      # 유기체 컴포넌트 (10개)
│   ├── globals.css     # Tailwind v4 글로벌 스타일
│   ├── index.ts
│   └── Introduction.mdx # Storybook 인트로 페이지
├── package.json
└── tsconfig.json
```

---

## 문서 시스템

### Storybook Auto Docs 사용 ✅

**결정**: 커스텀 MDX 파일 대신 Storybook의 Auto Docs 기능 사용

**이유**:
- Storybook이 자동으로 Description, Controls, Stories를 생성
- 수동 문서 파일 관리 불필요
- Stories 수정 시 자동 반영
- 유지보수 부담 제거

**컴포넌트 문서화 방법**:
```tsx
const meta: Meta<typeof Component> = {
  title: 'Category/ComponentName',
  component: Component,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '컴포넌트에 대한 상세 설명...',
      },
    },
  },
}
```

### 모든 컴포넌트에 Description 추가 ✅

**총 39개 컴포넌트**:
- **Atoms** (15개): Button, Input, Checkbox, Switch, Label, Badge, Avatar, Progress, Separator, Skeleton, Spinner, Toggle, RadioGroup, AspectRatio, InputOTP
- **Molecules** (14개): Accordion, Alert, Card, Tabs, Tooltip, Popover, DropdownMenu, Toast, Collapsible, HoverCard, Pagination, ToggleGroup, ContextMenu, Sonner
- **Organisms** (10개): Dialog, Select, AlertDialog, Calendar, DatePicker, Command, Combobox, DataTable, Form, NavigationMenu, Chart

---

## 주요 명령어

```bash
# Storybook 실행
npm run storybook

# Storybook 빌드
npm run build-storybook

# 타입 체크
npm run type-check

# 정리
npm run clean
```

---

## 워크플로우

### 새 컴포넌트 추가 시

1. **컴포넌트 파일 작성**
   ```
   src/atoms/new-component/
   ├── new-component.component.tsx
   ├── new-component.types.ts
   ├── new-component.stories.tsx
   └── index.ts
   ```

2. **Stories에 description 추가**
   ```tsx
   const meta: Meta<typeof NewComponent> = {
     title: 'Atoms/NewComponent',
     component: NewComponent,
     parameters: {
       layout: 'centered',
       docs: {
         description: {
           component: '컴포넌트 설명을 여기에 작성...',
         },
       },
     },
     argTypes: {
       // Controls 설정
     },
   }
   ```

3. **Stories 작성** (다양한 사용 예제)
   ```tsx
   export const Default: Story = {
     args: {
       // 기본 props
     },
   }

   export const Variant1: Story = {
     args: {
       variant: 'primary',
     },
   }
   ```

4. **확인**
   ```bash
   npm run storybook
   ```

   Auto Docs가 자동으로 생성됩니다.

---

## 설정 파일

### package.json

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "type-check": "tsc --noEmit",
    "clean": "rimraf dist storybook-static node_modules .turbo"
  }
}
```

### .storybook/main.ts

- Storybook + Vite 설정
- Auto Docs 활성화
- Tailwind v4 통합

### .storybook/preview.ts

- 글로벌 스타일 (globals.css)
- 테마 전환 (light/dark)
- Controls 설정

---

## 주요 결정사항

### 1. Storybook Auto Docs 사용

**결정**: 커스텀 MDX 파일 제거, Auto Docs 사용

**이유**:
- Storybook 기본 기능으로 충분
- 수동 문서 관리 불필요
- Stories가 단일 진실 공급원 (Single Source of Truth)
- 유지보수 부담 감소

### 2. 한국어 Description

**결정**: 모든 컴포넌트 description을 한국어로 작성

**이유**:
- 주 사용자가 한국인
- 더 나은 이해도와 접근성

### 3. Controls 중심 문서

**결정**: Story에서 `args`를 사용하여 Controls와 연동

**이유**:
- 사용자가 직접 props를 조작하며 테스트 가능
- 문서가 인터랙티브하게 동작
- 코드 예제가 실제 동작과 일치

---

## 컴포넌트 개발 가이드

### Story 작성 시 주의사항

1. **Default Story 필수**: Controls 표시를 위해 필요
2. **args 사용**: `render` 함수에서 하드코딩 대신 `args` prop 활용
3. **Description 작성**: `parameters.docs.description.component`에 명확한 설명 추가
4. **argTypes 정의**: 필요한 경우 Controls 커스터마이징

### 예시

```tsx
// ✅ Good - Controls가 동작함
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
  },
  render: (args) => <Component {...args} />,
}

// ❌ Bad - Controls가 동작하지 않음
export const Default: Story = {
  render: () => <Component variant="default" size="md" />,
}
```

---

## 최근 수정사항

### 2025-09-30
- Calendar 컴포넌트 스타일 수정 (hover 효과, 텍스트 색상)
- 커스텀 MDX 문서 시스템 제거
- Auto Docs로 전환
- `generate-mdx-docs.mjs` 스크립트 삭제
- 모든 `.docs.mdx` 파일 삭제

---

## 참고사항

- **React 버전**: 19.0.0
- **Storybook 버전**: 8.6.7
- **Tailwind CSS**: v4.0.0
- **Node.js**: v22.19.0

---

## 문의 및 피드백

프로젝트 관련 문의나 버그 리포트는 팀 리포지토리 이슈 트래커에 등록해주세요.

---

**마지막 업데이트**: 2025-09-30
**작성자**: Claude Code Assistant