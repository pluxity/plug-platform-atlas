import { Input, Label } from '@plug-atlas/ui'
import type { LedDisplayOptions } from '../../../../../services/types/led'

interface LedDisplayOptionsFieldsProps {
  value: LedDisplayOptions
  onChange: (value: LedDisplayOptions) => void
  disabled?: boolean
}

/**
 * 표출 옵션 입력
 *
 * ⚠️ 하드웨어 업체 API 스펙 수령 전이라 LED 사이니지에서 사실상 공통인
 * 두 가지(체류 시간·반복 횟수)만 노출한다. 스펙이 오면 여기와
 * types/led.ts 의 LedDisplayOptions 를 함께 확장한다.
 */
export function LedDisplayOptionsFields({
  value,
  onChange,
  disabled = false,
}: LedDisplayOptionsFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <Label htmlFor="led-duration" className="text-xs text-muted-foreground">
          체류 시간 (초)
        </Label>
        <Input
          id="led-duration"
          type="number"
          min={1}
          max={600}
          disabled={disabled}
          value={value.durationSeconds}
          onChange={(e) =>
            onChange({ ...value, durationSeconds: clamp(Number(e.target.value), 1, 600) })
          }
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="led-repeat" className="text-xs text-muted-foreground">
          반복 횟수
        </Label>
        <Input
          id="led-repeat"
          type="number"
          min={1}
          max={99}
          disabled={disabled}
          value={value.repeatCount}
          onChange={(e) =>
            onChange({ ...value, repeatCount: clamp(Number(e.target.value), 1, 99) })
          }
        />
      </div>
    </div>
  )
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.min(Math.max(Math.trunc(value), min), max)
}
