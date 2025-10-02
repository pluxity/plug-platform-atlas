import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

import type { Locale } from "date-fns"

import { cn } from "../../lib/utils"
import { Button } from "../../atoms/button"
import { Popover, PopoverContent, PopoverTrigger } from "../../molecules/popover"
import { Calendar } from "../calendar"

export interface DatePickerSingleProps {
  mode?: "single"
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  locale?: Locale
}

export interface DatePickerRangeProps {
  mode: "range"
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  locale?: Locale
  fromDate?: Date
  toDate?: Date
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (props, ref) => {
    const {
      mode = "single",
      placeholder = "날짜를 선택하세요",
      className,
      disabled = false,
      locale = ko,
    } = props

    const [open, setOpen] = React.useState(false)

    const formatRange = (range: DateRange | undefined) => {
      if (!range?.from) return placeholder
      if (!range.to) return format(range.from, "PPP", { locale })
      return `${format(range.from, "PPP", { locale })} - ${format(range.to, "PPP", { locale })}`
    }

    const displayValue = mode === "single"
      ? (props.value ? format(props.value as Date, "PPP", { locale }) : placeholder)
      : formatRange(props.value as DateRange | undefined)

    // 개별 모드에 맞는 onSelect 핸들러 (react-day-picker 타입 호환 해결)
    const handleSelectSingle = (date: Date | undefined) => {
      if (mode !== "single") return
      ;(props as DatePickerSingleProps).onChange?.(date)
      // 단일 날짜는 선택 즉시 닫기
      setOpen(false)
    }

    const handleSelectRange = (range: DateRange | undefined) => {
      if (mode !== "range") return
      ;(props as DatePickerRangeProps).onChange?.(range)
      // range 모드에서는 시작과 종료 날짜가 모두 선택되고, 서로 다른 날짜일 때만 닫기
      if (range?.from && range?.to && range.from.getTime() !== range.to.getTime()) {
        setOpen(false)
      }
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !props.value && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            {displayValue}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {mode === "single" ? (
            <Calendar
              mode="single"
              selected={props.value as Date | undefined}
              onSelect={handleSelectSingle}
              locale={locale}
              disabled={disabled}
            />
          ) : (
            <Calendar
              mode="range"
              selected={props.value as DateRange | undefined}
              onSelect={handleSelectRange}
              locale={locale}
              disabled={disabled}
            />
          )}
        </PopoverContent>
      </Popover>
    )
  }
)

DatePicker.displayName = "DatePicker"

export { DatePicker }