"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const checkboxVariants = cva(
  "peer shrink-0 rounded-sm border ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-3 w-3",
        default: "h-4 w-4",
        lg: "h-5 w-5",
        xl: "h-6 w-6"
      },
      variant: {
        default: "border-gray-300 data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600 data-[state=checked]:text-white data-[state=indeterminate]:bg-primary-600 data-[state=indeterminate]:border-primary-600 data-[state=indeterminate]:text-white hover:border-primary-400 disabled:bg-gray-100 disabled:border-gray-200",
        success: "border-gray-300 data-[state=checked]:bg-success-600 data-[state=checked]:border-success-600 data-[state=checked]:text-white data-[state=indeterminate]:bg-success-600 data-[state=indeterminate]:border-success-600 data-[state=indeterminate]:text-white hover:border-success-400 disabled:bg-gray-100 disabled:border-gray-200",
        warning: "border-gray-300 data-[state=checked]:bg-warning-600 data-[state=checked]:border-warning-600 data-[state=checked]:text-white data-[state=indeterminate]:bg-warning-600 data-[state=indeterminate]:border-warning-600 data-[state=indeterminate]:text-white hover:border-warning-400 disabled:bg-gray-100 disabled:border-gray-200",
        error: "border-gray-300 data-[state=checked]:bg-error-600 data-[state=checked]:border-error-600 data-[state=checked]:text-white data-[state=indeterminate]:bg-error-600 data-[state=indeterminate]:border-error-600 data-[state=indeterminate]:text-white hover:border-error-400 disabled:bg-gray-100 disabled:border-gray-200"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default"
    }
  }
)

const checkboxIconVariants = cva(
  "flex items-center justify-center text-current",
  {
    variants: {
      size: {
        sm: "h-2.5 w-2.5",
        default: "h-3 w-3",
        lg: "h-4 w-4",
        xl: "h-5 w-5"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
)

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {
  indeterminate?: boolean
  label?: string
  description?: string
  helperText?: string
  errorText?: string
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({
  className,
  size,
  variant,
  indeterminate,
  label,
  description,
  helperText,
  errorText,
  disabled,
  ...props
}, ref) => {
  const finalVariant = errorText ? 'error' : variant
  const id = React.useId()
  const checkboxId = props.id || id

  return (
    <div className="flex items-start space-x-2">
      <CheckboxPrimitive.Root
        ref={ref}
        id={checkboxId}
        className={cn(checkboxVariants({ size, variant: finalVariant }), className)}
        disabled={disabled}
        {...(indeterminate && { "data-state": "indeterminate" })}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn(checkboxIconVariants({ size }))}
        >
          {indeterminate ? (
            <Minus className={cn(
              size === "sm" && "h-2.5 w-2.5",
              size === "default" && "h-3 w-3",
              size === "lg" && "h-4 w-4",
              size === "xl" && "h-5 w-5"
            )} />
          ) : (
            <Check className={cn(
              size === "sm" && "h-2.5 w-2.5",
              size === "default" && "h-3 w-3",
              size === "lg" && "h-4 w-4",
              size === "xl" && "h-5 w-5"
            )} />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {(label || description || helperText || errorText) && (
        <div className="grid gap-1.5 leading-none">
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                "text-sm font-medium leading-none cursor-pointer",
                disabled && "opacity-70 cursor-not-allowed",
                finalVariant === "error" && "text-error-700",
                finalVariant === "success" && "text-success-700",
                finalVariant === "warning" && "text-warning-700"
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p className={cn(
              "text-xs text-gray-600",
              disabled && "opacity-70",
              finalVariant === "error" && "text-error-600",
              finalVariant === "success" && "text-success-600",
              finalVariant === "warning" && "text-warning-600"
            )}>
              {description}
            </p>
          )}
          {(helperText || errorText) && (
            <p className={cn(
              "text-xs",
              errorText ? "text-error-600" :
              finalVariant === "success" ? "text-success-600" :
              finalVariant === "warning" ? "text-warning-600" : "text-gray-600",
              disabled && "opacity-70"
            )}>
              {errorText || helperText}
            </p>
          )}
        </div>
      )}
    </div>
  )
})

Checkbox.displayName = CheckboxPrimitive.Root.displayName

const SimpleCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
    VariantProps<typeof checkboxVariants> & {
      indeterminate?: boolean
    }
>(({
  className,
  size,
  variant,
  indeterminate,
  ...props
}, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ size, variant }), className)}
    {...(indeterminate && { "data-state": "indeterminate" })}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(checkboxIconVariants({ size }))}
    >
      {indeterminate ? (
        <Minus className={cn(
          size === "sm" && "h-2.5 w-2.5",
          size === "default" && "h-3 w-3",
          size === "lg" && "h-4 w-4",
          size === "xl" && "h-5 w-5"
        )} />
      ) : (
        <Check className={cn(
          size === "sm" && "h-2.5 w-2.5",
          size === "default" && "h-3 w-3",
          size === "lg" && "h-4 w-4",
          size === "xl" && "h-5 w-5"
        )} />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))

SimpleCheckbox.displayName = "SimpleCheckbox"

export { Checkbox, SimpleCheckbox, checkboxVariants }