# Sonner Toast Component

우리 디자인 시스템의 색상과 연동된 토스트 컴포넌트입니다.

## 사용법

### 기본 설정

```tsx
import { Toaster } from '@plug-atlas/ui'

function App() {
  return (
    <div>
      {/* 앱의 최상단에 Toaster 추가 */}
      <Toaster />

      {/* 나머지 앱 콘텐츠 */}
    </div>
  )
}
```

### 색상별 토스트 사용

```tsx
import { toast } from '@plug-atlas/ui'

// 기본 토스트
toast.default("기본 메시지입니다")

// 성공 토스트 (녹색)
toast.success("작업이 성공했습니다!")

// 경고 토스트 (주황색)
toast.warning("주의가 필요합니다")

// 에러 토스트 (빨간색)
toast.error("오류가 발생했습니다")

// 정보 토스트 (파란색)
toast.info("새로운 알림이 있습니다")
```

### 설명과 액션 추가

```tsx
// 설명이 있는 토스트
toast.success("파일 업로드 완료", {
  description: "3개의 파일이 성공적으로 업로드되었습니다"
})

// 액션 버튼이 있는 토스트
toast.success("작업이 완료되었습니다", {
  description: "변경사항이 저장되었습니다",
  action: {
    label: "되돌리기",
    onClick: () => {
      // 되돌리기 로직
      toast.info("작업이 취소되었습니다")
    }
  }
})
```

## 색상 시스템

각 토스트는 우리 디자인 시스템의 색상을 사용합니다:

- **default**: 기본 그레이 색상
- **success**: 성공 녹색 (`--color-success-*`)
- **warning**: 경고 주황색 (`--color-warning-*`)
- **error**: 에러 빨간색 (`--color-error-*`)
- **info**: 정보 파란색 (`--color-primary-*`)

## 특징

✨ **현대적인 디자인**: Gradient 배경과 backdrop-blur 효과
🎨 **일관된 색상**: 디자인 시스템 색상과 완벽 연동
🔧 **쉬운 사용**: 직관적인 API
📱 **반응형**: 모든 디바이스에서 완벽 작동
♿ **접근성**: 스크린 리더 지원

## 원본 sonner API

기존 sonner의 모든 기능도 여전히 사용 가능합니다:

```tsx
import { toast } from '@plug-atlas/ui'

// 기존 sonner API
toast("기본 메시지")
toast.promise(promise, {
  loading: '로딩 중...',
  success: '완료!',
  error: '실패!'
})
```