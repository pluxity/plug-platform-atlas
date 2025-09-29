"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-5 w-9",
        default: "h-6 w-11",
        lg: "h-7 w-13"
      },
      variant: {
        default: "data-[state=checked]:bg-primary-600 data-[state=unchecked]:bg-gray-200 hover:data-[state=checked]:bg-primary-700 hover:data-[state=unchecked]:bg-gray-300",
        success: "data-[state=checked]:bg-success-600 data-[state=unchecked]:bg-gray-200 hover:data-[state=checked]:bg-success-700 hover:data-[state=unchecked]:bg-gray-300",
        warning: "data-[state=checked]:bg-warning-600 data-[state=unchecked]:bg-gray-200 hover:data-[state=checked]:bg-warning-700 hover:data-[state=unchecked]:bg-gray-300",
        destructive: "data-[state=checked]:bg-error-600 data-[state=unchecked]:bg-gray-200 hover:data-[state=checked]:bg-error-700 hover:data-[state=unchecked]:bg-gray-300"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default"
    }
  }
)

const switchThumbVariants = cva(
  "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-all duration-200",
  {
    variants: {
      size: {
        sm: "h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        default: "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        lg: "h-6 w-6 data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
)

const LoadingSpinner = ({ size }: { size: "sm" | "default" | "lg" }) => {
  const spinnerSize = {
    sm: "h-2.5 w-2.5",
    default: "h-3 w-3",
    lg: "h-3.5 w-3.5"
  }[size]

  return (
    <svg
      className={cn("animate-spin text-white", spinnerSize)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants> {
  loading?: boolean
  label?: string
  description?: string
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, size, variant, loading, label, description, disabled, ...props }, ref) => (
  <div className="flex items-center space-x-2">
    <SwitchPrimitives.Root
      className={cn(switchVariants({ size, variant }), className)}
      disabled={disabled || loading}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          switchThumbVariants({ size }),
          loading && "flex items-center justify-center"
        )}
      >
        {loading && <LoadingSpinner size={size || "default"} />}
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
    {(label || description) && (
      <div className="grid gap-1.5 leading-none">
        {label && (
          <label
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              (disabled || loading) && "opacity-70 cursor-not-allowed"
            )}
          >
            {label}
          </label>
        )}
        {description && (
          <p className={cn(
            "text-xs text-gray-600",
            (disabled || loading) && "opacity-70"
          )}>
            {description}
          </p>
        )}
      </div>
    )}
  </div>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch, switchVariants }