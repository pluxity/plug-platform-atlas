import * as React from "react"
import { Calendar } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../../atoms/button"
import { Popover, PopoverContent, PopoverTrigger } from "../../molecules/popover"

export interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  ({ value, onChange, placeholder = "Pick a date", className }, ref) => {
    const [open, setOpen] = React.useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !value && "text-muted-foreground",
              className
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {value ? value.toDateString() : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <div className="p-4">
            <p className="text-sm text-muted-foreground">
              Date picker component placeholder.
              This would integrate with a calendar library like react-day-picker.
            </p>
            <Button
              onClick={() => {
                onChange?.(new Date())
                setOpen(false)
              }}
              className="w-full mt-2"
            >
              Select Today
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    )
  }
)

DatePicker.displayName = "DatePicker"

export { DatePicker }