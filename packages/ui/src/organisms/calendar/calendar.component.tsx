import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { DayButton, DayPicker } from "react-day-picker"

import { cn } from "../../lib/utils"
import { Button } from "../../atoms/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: CalendarProps) {

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-3 border border-gray-200 rounded-lg",
        className
      )}
      captionLayout={captionLayout}
      startMonth={new Date(1900, 0)}
      endMonth={new Date(2100, 11)}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "long" }),
        formatYearDropdown: (date) => date.getFullYear().toString(),
        formatWeekdayName: (date) => {
          const weekdays = ["일", "월", "화", "수", "목", "금", "토"]
          return weekdays[date.getDay()] || ""
        },
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit"),
        months: cn("flex gap-4 flex-col md:flex-row relative"),
        month: cn("flex flex-col w-full gap-4"),
        nav: cn("flex items-center gap-1 w-full absolute top-1.5 inset-x-0 justify-between z-20"),
        button_previous: cn(
          "inline-flex items-center justify-center h-9 w-9 p-0 rounded-sm",
          "text-gray-700 bg-white hover:bg-gray-100 transition-colors cursor-pointer",
          "aria-disabled:opacity-30 aria-disabled:cursor-not-allowed"
        ),
        button_next: cn(
          "inline-flex items-center justify-center h-9 w-9 p-0 rounded-sm",
          "text-gray-700 bg-white hover:bg-gray-100 transition-colors cursor-pointer",
          "aria-disabled:opacity-30 aria-disabled:cursor-not-allowed"
        ),
        month_caption: cn("flex items-center justify-center h-12 w-full px-10 relative"),
        dropdowns: cn("flex items-center text-sm font-medium justify-center gap-2 relative z-20"),
        dropdown_root: cn("relative border border-gray-200 rounded-sm shadow-sm bg-white"),
        dropdown: cn("absolute inset-0 opacity-0 cursor-pointer z-30 w-full h-full appearance-none"),
        caption_label: cn(
          "font-medium z-10 relative",
          captionLayout === "label"
            ? "text-sm pointer-events-none"
            : "rounded-md px-3 py-1.5 flex items-center gap-1 text-sm h-9"
        ),
        month_grid: cn("w-full border-collapse"),
        weekdays: cn("flex justify-around"),
        weekday: cn("text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] select-none flex items-center justify-center"),
        week: cn("flex w-full mt-2"),
        day: cn("relative w-8 h-8 p-0 flex items-center justify-center text-xs rounded-md"),
        range_start: cn("rounded-l-md rounded-r-none bg-gray-100"),
        range_end: cn("rounded-r-md rounded-l-none bg-gray-100"),
        range_middle: cn("rounded-none bg-gray-100"),
        today: cn("bg-gray-400 text-white font-semibold"),
        selected: cn("bg-gray-700 text-white font-semibold"),
        outside: cn("text-muted-foreground opacity-50"),
        disabled: cn("text-muted-foreground opacity-50"),
        hidden: cn("invisible"),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
          }
          if (orientation === "right") {
            return <ChevronRight className={cn("h-4 w-4", className)} {...props} />
          }
          return <ChevronDown className={cn("h-3.5 w-3.5", className)} {...props} />
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  children,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  // Check if it's selected (for both single and range modes)
  const isSelected = modifiers.selected || modifiers.range_start || modifiers.range_end

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="xs"
      aria-selected={isSelected}
      data-selected={modifiers.selected}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        modifiers.day,
        // 선택된 날짜와 오늘 날짜는 흰색 텍스트
        (modifiers.selected || modifiers.range_start || modifiers.range_end || modifiers.today) && "text-white hover:text-white",
        // hover 효과 제거 (배경, scale, transform)
        "hover:bg-transparent hover:shadow-none hover:scale-100 active:scale-100 hover:translate-y-0",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}

Calendar.displayName = "Calendar"

export { Calendar, CalendarDayButton }