import { cn } from '@plug-atlas/ui'

interface LedPreviewProps {
  content: string
  className?: string
}

/**
 * 전광판 표출 미리보기
 *
 * 실제 장비 해상도·폰트를 알 수 없으므로(업체 스펙 미수령) 픽셀 단위로 맞추지 않고,
 * "어두운 바탕에 발광 문자" 라는 전광판의 시각적 성격과 줄바꿈 정도만 가늠하게 한다.
 * 글자 수가 늘면 자동으로 작아져서, 너무 긴 문구가 어떻게 보일지 감을 준다.
 */
export function LedPreview({ content, className }: LedPreviewProps) {
  const text = content.trim()
  const length = text.length

  // 글자 수에 따라 단계적으로 축소 — 실제 장비의 자동 축소 동작을 흉내낸다
  const sizeClass =
    length > 120 ? 'text-sm' : length > 60 ? 'text-base' : length > 30 ? 'text-lg' : 'text-2xl'

  return (
    <div
      className={cn(
        'flex min-h-[120px] items-center justify-center rounded-md border-4 border-neutral-700 bg-neutral-950 px-4 py-5',
        className,
      )}
    >
      {text ? (
        <p
          className={cn(
            'whitespace-pre-wrap break-keep text-center font-semibold leading-relaxed tracking-wide text-amber-400',
            sizeClass,
          )}
          style={{ textShadow: '0 0 8px rgba(251, 191, 36, 0.55)' }}
        >
          {text}
        </p>
      ) : (
        <p className="text-sm text-neutral-600">메시지를 입력하면 여기에 표출 형태가 보입니다</p>
      )}
    </div>
  )
}
