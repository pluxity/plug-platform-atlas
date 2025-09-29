import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-gray-200 transition-all duration-200",
  {
    variants: {
      size: {
        xs: "h-1",
        sm: "h-2",
        default: "h-3",
        lg: "h-4",
        xl: "h-6"
      },
      variant: {
        default: "",
        success: "",
        warning: "",
        error: ""
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default"
    }
  }
)

const progressBarVariants = cva(
  "h-full rounded-full transition-all duration-500 ease-out",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary-500 to-primary-600 shadow-sm",
        success: "bg-gradient-to-r from-success-500 to-success-600 shadow-sm",
        warning: "bg-gradient-to-r from-warning-500 to-warning-600 shadow-sm",
        error: "bg-gradient-to-r from-error-500 to-error-600 shadow-sm"
      },
      animated: {
        true: "bg-[length:30px_30px] animate-pulse",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      animated: false
    }
  }
)

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof progressVariants> {
  value?: number
  max?: number
  animated?: boolean
  showLabel?: boolean
  label?: string
  striped?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({
    className,
    value = 0,
    max = 100,
    size,
    variant,
    animated = false,
    showLabel = false,
    label,
    striped = false,
    ...props
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    const displayLabel = label || `${Math.round(percentage)}%`

    return (
      <div className="w-full space-y-1">
        {showLabel && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className={cn(
              "text-sm font-medium",
              variant === "success" && "text-success-600",
              variant === "warning" && "text-warning-600",
              variant === "error" && "text-error-600",
              variant === "default" && "text-primary-600"
            )}>
              {displayLabel}
            </span>
          </div>
        )}
        <div
          ref={ref}
          className={cn(progressVariants({ size, variant }), className)}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          {...props}
        >
          <div
            className={cn(
              progressBarVariants({ variant, animated }),
              striped && "bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px]",
              animated && striped && "animate-[progress-stripes_1s_linear_infinite]"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)
Progress.displayName = "Progress"

const ProgressCircular = React.forwardRef<
  SVGSVGElement,
  {
    value?: number
    max?: number
    size?: number
    strokeWidth?: number
    variant?: "default" | "success" | "warning" | "error"
    showLabel?: boolean
    className?: string
  }
>(({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = "default",
  showLabel = false,
  className,
  ...props
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const colorMap = {
    default: "text-primary-600",
    success: "text-success-600",
    warning: "text-warning-600",
    error: "text-error-600"
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        ref={ref}
        className={cn("transform -rotate-90", className)}
        width={size}
        height={size}
        {...props}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn(colorMap[variant], "transition-all duration-500 ease-out")}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-medium", colorMap[variant])}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  )
})
ProgressCircular.displayName = "ProgressCircular"

export { Progress, ProgressCircular, progressVariants, progressBarVariants }