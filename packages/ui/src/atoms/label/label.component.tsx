"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const labelVariants = cva(
  "font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors duration-200",
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        default: "text-sm",
        lg: "text-base",
        xl: "text-lg"
      },
      variant: {
        default: "text-gray-900",
        muted: "text-gray-600",
        success: "text-success-700",
        warning: "text-warning-700",
        error: "text-error-700"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default"
    }
  }
)

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  required?: boolean
  helperText?: string
  errorText?: string
  description?: string
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, size, variant, required, helperText, errorText, description, children, ...props }, ref) => {
  const finalVariant = errorText ? 'error' : variant

  return (
    <div className="space-y-1">
      <LabelPrimitive.Root
        ref={ref}
        className={cn(labelVariants({ size, variant: finalVariant }), className)}
        {...props}
      >
        {children}
        {required && (
          <span className="text-error-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </LabelPrimitive.Root>
      {description && (
        <p className={cn(
          "text-xs",
          finalVariant === "error" ? "text-error-600" :
          finalVariant === "success" ? "text-success-600" :
          finalVariant === "warning" ? "text-warning-600" : "text-gray-600"
        )}>
          {description}
        </p>
      )}
      {(helperText || errorText) && (
        <p className={cn(
          "text-xs",
          errorText ? "text-error-600" :
          finalVariant === "success" ? "text-success-600" :
          finalVariant === "warning" ? "text-warning-600" : "text-gray-600"
        )}>
          {errorText || helperText}
        </p>
      )}
    </div>
  )
})

Label.displayName = LabelPrimitive.Root.displayName

const SimpleLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants> & {
      required?: boolean
    }
>(({ className, size, variant, required, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ size, variant }), className)}
    {...props}
  >
    {children}
    {required && (
      <span className="text-error-500 ml-1" aria-label="required">
        *
      </span>
    )}
  </LabelPrimitive.Root>
))

SimpleLabel.displayName = "SimpleLabel"

export { Label, SimpleLabel, labelVariants }