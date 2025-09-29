import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 ease-out-quad focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background relative overflow-hidden transform-gpu",
  {
    variants: {
      variant: {
        default: "gradient-primary text-white hover:shadow-primary hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-primary-500 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none",
        destructive: "gradient-error text-white hover:shadow-error hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-error-500 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none",
        success: "gradient-success text-white hover:shadow-success hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-success-500 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none",
        warning: "gradient-warning text-white hover:shadow-warning hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-warning-500 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none",
        outline: "border border-gray-200 text-gray-700 bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-white hover:border-gray-300 hover:shadow-medium active:scale-[0.98] focus-visible:ring-gray-500 disabled:border-gray-200 disabled:text-gray-400 disabled:bg-gray-50",
        secondary: "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 hover:shadow-medium hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-gray-500 disabled:bg-gray-100 disabled:text-gray-400",
        ghost: "text-gray-700 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 hover:shadow-soft active:scale-[0.98] focus-visible:ring-gray-500 disabled:text-gray-400 disabled:bg-transparent",
        link: "text-primary-600 underline-offset-4 hover:underline hover:text-primary-700 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-primary-500 disabled:text-gray-400 disabled:no-underline",
        premium: "gradient-glass border border-white/20 text-gray-900 hover:shadow-glow hover:border-white/30 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-primary-500 backdrop-blur-sm",
        shimmer: "bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 bg-size-200 text-white hover:bg-pos-0 hover:shadow-primary hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-primary-500 animate-shimmer"
      },
      size: {
        xs: "h-8 px-3 text-xs rounded-lg",
        sm: "h-9 px-4 text-sm rounded-lg",
        default: "h-10 px-6 text-sm",
        lg: "h-12 px-8 text-base rounded-2xl",
        xl: "h-14 px-10 text-lg rounded-2xl",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-lg",
        "icon-lg": "h-12 w-12 rounded-2xl"
      },
      effect: {
        none: "",
        shimmer: "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        glow: "hover:shadow-lg hover:shadow-current/25",
        lift: "hover:-translate-y-1 hover:shadow-xl",
        bounce: "hover:animate-pulse"
      }
    },
    compoundVariants: [
      {
        variant: "premium",
        effect: "glow",
        className: "hover:shadow-primary/20"
      },
      {
        variant: "shimmer",
        effect: "shimmer",
        className: "bg-size-200 hover:bg-pos-100"
      }
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      effect: "none"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  loadingText?: string
  pulse?: boolean
  fullWidth?: boolean
}

const LoadingSpinner = ({ size = "sm" }: { size?: "xs" | "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  }

  return (
    <svg
      className={cn("animate-spin", sizeClasses[size])}
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


const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    effect,
    loading,
    leftIcon,
    rightIcon,
    children,
    loadingText,
    pulse,
    fullWidth,
    disabled,
    ...props
  }, ref) => {
    const getSpinnerSize = () => {
      switch (size) {
        case "xs":
        case "icon-sm":
          return "xs"
        case "sm":
          return "sm"
        case "lg":
        case "xl":
        case "icon-lg":
          return "md"
        default:
          return "sm"
      }
    }

    const isIconOnly = size?.includes("icon")
    const showText = !isIconOnly && children

    return (
      <button
        className={cn(
          buttonVariants({ variant, size, effect }),
          fullWidth && "w-full",
          pulse && !loading && "animate-pulse",
          loading && "pointer-events-none",
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            {isIconOnly ? (
              <LoadingSpinner size={getSpinnerSize()} />
            ) : (
              <>
                <LoadingSpinner size={getSpinnerSize()} />
                {loadingText && <span className="ml-2">{loadingText}</span>}
              </>
            )}
          </>
        ) : (
          <>
            {leftIcon && (
              <span className={cn(showText && "mr-2", "flex items-center")}>
                {leftIcon}
              </span>
            )}
            {showText && (
              <span className="relative z-10">{children}</span>
            )}
            {rightIcon && (
              <span className={cn(showText && "ml-2", "flex items-center")}>
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }