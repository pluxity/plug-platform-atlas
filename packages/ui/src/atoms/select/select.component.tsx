"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { cva } from "class-variance-authority"
import { Check, ChevronDown, ChevronUp, Loader2, X, AlertCircle, CheckCircle } from "lucide-react"

import { cn } from "../../lib/utils"
import {
  SelectTriggerProps,
  SelectContentProps,
  SelectItemProps,
  SelectLabelProps,
  SelectGroupProps,
  SelectSeparatorProps,
  SelectScrollButtonProps
} from "./select.types"

// Variant definitions
const selectTriggerVariants = cva(
  "flex w-full items-center justify-between rounded-[7px] text-sm ring-offset-background transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
  {
    variants: {
      variant: {
        default: "border border-[#bbbfcf] bg-white hover:border-gray-300",
        outline: "border-2 border-[#bbbfcf] bg-white hover:border-primary-300 focus:border-primary-500",
        filled: "border border-[#bbbfcf] bg-gray-50 hover:bg-gray-100 focus:bg-white",
        ghost: "border-0 bg-transparent hover:bg-gray-100 focus:bg-gray-50"
      },
      size: {
        sm: "h-8 px-[10px] py-0 text-xs",
        default: "h-9 px-[10px] py-0",
        lg: "h-12 px-4 py-3 text-base"
      },
      state: {
        default: "",
        error: "border-error-300 focus:border-error-500 focus:ring-error-500",
        success: "border-success-300 focus:border-success-500 focus:ring-success-500",
        warning: "border-warning-300 focus:border-warning-500 focus:ring-warning-500"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default"
    }
  }
)

const selectContentVariants = cva(
  "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md transition-all duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
)

const selectItemVariants = cva(
  "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors duration-150 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  {
    variants: {
      size: {
        sm: "py-1 text-xs",
        default: "py-1.5 text-sm",
        lg: "py-2 text-base"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
)

const Select = SelectPrimitive.Root
const SelectGroup = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Group>,
  SelectGroupProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Group
    ref={ref}
    className={cn(className)}
    {...props}
  />
))
SelectGroup.displayName = SelectPrimitive.Group.displayName

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({
  className,
  children,
  variant,
  size,
  state,
  loading = false,
  error = false,
  success = false,
  icon,
  clearable = false,
  onClear,
  ...props
}, ref) => {
  const computedState = error ? "error" : success ? "success" : state || "default"

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClear?.()
  }

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        selectTriggerVariants({ variant, size, state: computedState }),
        "data-[placeholder]:text-muted-foreground",
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {icon && !loading && (
          <span className="flex-shrink-0 text-muted-foreground">
            {icon}
          </span>
        )}
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground flex-shrink-0" />
        )}
        <span className="truncate flex-1">{children}</span>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {error && (
          <AlertCircle className="h-4 w-4 text-error-500" />
        )}
        {success && (
          <CheckCircle className="h-4 w-4 text-success-500" />
        )}
        {clearable && children && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center justify-center h-4 w-4 rounded-full hover:bg-gray-200 transition-colors"
            tabIndex={-1}
          >
            <X className="h-3 w-3" />
          </button>
        )}
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-4 w-4 opacity-50 transition-transform data-[state=open]:rotate-180" />
        </SelectPrimitive.Icon>
      </div>
    </SelectPrimitive.Trigger>
  )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollUpButton>,
  SelectScrollButtonProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1 text-muted-foreground hover:text-foreground transition-colors",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollDownButton>,
  SelectScrollButtonProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1 text-muted-foreground hover:text-foreground transition-colors",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(({
  className,
  children,
  position = "popper",
  size,
  loading = false,
  emptyMessage = "No options available",
  maxHeight = 384,
  ...props
}, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        selectContentVariants({ size }),
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      style={{ maxHeight }}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        ) : React.Children.count(children) === 0 ? (
          <div className="flex items-center justify-center py-6">
            <span className="text-sm text-muted-foreground">{emptyMessage}</span>
          </div>
        ) : (
          children
        )}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  SelectLabelProps
>(({ className, required = false, children, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "py-1.5 pl-8 pr-2 text-sm font-semibold text-muted-foreground",
      className
    )}
    {...props}
  >
    {children}
    {required && <span className="text-error-500 ml-1">*</span>}
  </SelectPrimitive.Label>
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({
  className,
  children,
  size,
  description,
  icon,
  badge,
  ...props
}, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      selectItemVariants({ size }),
      "hover:bg-accent/50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <div className="flex items-center gap-2 flex-1 min-w-0">
      {icon && (
        <span className="flex-shrink-0 text-muted-foreground">
          {icon}
        </span>
      )}

      <div className="flex-1 min-w-0">
        <SelectPrimitive.ItemText className="block truncate">
          {children}
        </SelectPrimitive.ItemText>
        {description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {description}
          </p>
        )}
      </div>

      {badge && (
        <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {badge}
        </span>
      )}
    </div>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  SelectSeparatorProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton
}