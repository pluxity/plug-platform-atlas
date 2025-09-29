import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border font-medium transition-all duration-300 ease-out-quad focus:outline-none focus:ring-2 focus:ring-offset-1 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "gradient-primary border-transparent text-white shadow-soft hover:shadow-primary hover:scale-105",
        secondary: "bg-gradient-to-br from-gray-100 to-gray-200 border-transparent text-gray-900 hover:from-gray-200 hover:to-gray-300 hover:shadow-medium",
        success: "gradient-success border-transparent text-white shadow-soft hover:shadow-success hover:scale-105",
        warning: "gradient-warning border-transparent text-white shadow-soft hover:shadow-warning hover:scale-105",
        destructive: "gradient-error border-transparent text-white shadow-soft hover:shadow-error hover:scale-105",
        outline: "border-gray-200 text-gray-700 bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-white hover:border-gray-300 hover:shadow-medium",
        soft: "bg-primary-50 border-primary-200/50 text-primary-700 hover:bg-primary-100 hover:border-primary-300",
        glass: "gradient-glass border-white/20 text-gray-900 hover:border-white/30 hover:shadow-glow backdrop-blur-sm",
        glow: "bg-primary-600 border-transparent text-white shadow-primary hover:shadow-xl hover:scale-105",
        shimmer: "bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 bg-size-200 border-transparent text-white hover:bg-pos-100 hover:shadow-primary animate-shimmer"
      },
      size: {
        xs: "px-1.5 py-0.5 text-xs rounded-md font-normal",
        sm: "px-2 py-0.5 text-xs rounded-lg font-medium",
        default: "px-2.5 py-1 text-xs rounded-full font-medium",
        lg: "px-3 py-1.5 text-sm rounded-full font-semibold",
        xl: "px-4 py-2 text-base rounded-2xl font-semibold"
      },
      appearance: {
        solid: "",
        soft: "bg-opacity-10 hover:bg-opacity-20",
        outline: "bg-transparent",
        gradient: "bg-gradient-to-r",
        dot: "relative pl-4"
      }
    },
    compoundVariants: [
      {
        variant: "soft",
        appearance: "soft",
        className: "bg-opacity-10 hover:bg-opacity-20"
      },
      {
        appearance: "dot",
        className: "before:absolute before:left-1.5 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-current"
      }
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      appearance: "solid"
    },
  }
)

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'>,
  Omit<VariantProps<typeof badgeVariants>, 'appearance'> {
  appearance?: NonNullable<VariantProps<typeof badgeVariants>['appearance']>
  dismissible?: boolean
  onDismiss?: () => void
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  pulse?: boolean
  animated?: boolean
  clickable?: boolean
  loading?: boolean
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({
  className,
  variant,
  size,
  appearance,
  dismissible,
  onDismiss,
  leftIcon,
  rightIcon,
  children,
  pulse,
  animated = true,
  clickable,
  loading,
  onClick,
  ...props
}, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (clickable && onClick && !loading) {
      onClick(e)
    }
  }

  const handleDismiss = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onDismiss?.()
  }

  const showLeftIcon = leftIcon && !loading
  const showRightIcon = rightIcon && !loading && !dismissible

  return (
    <div
      ref={ref}
      className={cn(
  badgeVariants({ variant, size, appearance }),
        clickable && "cursor-pointer hover:scale-105 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1",
        pulse && "animate-pulse",
        loading && "pointer-events-none",
        animated && "transform-gpu",
        className
      )}
      onClick={handleClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1" />
      )}

      {showLeftIcon && (
        <span className={cn(
          "flex items-center",
          children && "mr-1",
          size === "xs" && "mr-0.5",
          size === "xl" && "mr-1.5"
        )}>
          {leftIcon}
        </span>
      )}

      <span className="relative z-10 leading-none">{children}</span>

      {showRightIcon && (
        <span className={cn(
          "flex items-center",
          children && "ml-1",
          size === "xs" && "ml-0.5",
          size === "xl" && "ml-1.5"
        )}>
          {rightIcon}
        </span>
      )}

      {dismissible && !loading && (
        <button
          onClick={handleDismiss}
          className={cn(
            "ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-current",
            size === "xs" && "p-0.5 ml-0.5",
            size === "sm" && "p-0.5",
            size === "default" && "p-0.5",
            size === "lg" && "p-1 ml-1.5",
            size === "xl" && "p-1 ml-2"
          )}
          aria-label="Remove badge"
          tabIndex={-1}
        >
          <svg
            className={cn(
              "fill-none stroke-current",
              size === "xs" && "w-2 h-2",
              size === "sm" && "w-2.5 h-2.5",
              size === "default" && "w-3 h-3",
              size === "lg" && "w-3.5 h-3.5",
              size === "xl" && "w-4 h-4"
            )}
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
})

Badge.displayName = "Badge"

export { Badge, badgeVariants }