import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const alertVariants = cva(
  "relative w-full rounded-xl border transition-all duration-300 ease-out-quad flex items-start gap-3 overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-white to-gray-50/50 text-gray-900 border-gray-200 shadow-soft hover:shadow-medium",
        success: "gradient-success-soft text-success-900 border-success-200/50 shadow-success/20 hover:shadow-success/30 [&>svg]:text-success-600",
        warning: "gradient-warning-soft text-warning-900 border-warning-200/50 shadow-warning/20 hover:shadow-warning/30 [&>svg]:text-warning-600",
        destructive: "gradient-error-soft text-error-900 border-error-200/50 shadow-error/20 hover:shadow-error/30 [&>svg]:text-error-600",
        info: "gradient-primary-soft text-primary-900 border-primary-200/50 shadow-primary/20 hover:shadow-primary/30 [&>svg]:text-primary-600",
        glass: "gradient-glass border-white/20 text-gray-900 shadow-glow hover:shadow-xl backdrop-blur-sm",
        premium: "bg-gradient-to-br from-white via-gray-50/50 to-white border-gray-200 shadow-glow hover:shadow-xl"
      },
      size: {
        sm: "p-3 text-sm gap-2",
        default: "p-4 gap-3",
        lg: "p-6 text-lg gap-4",
        xl: "p-8 text-xl gap-5"
      },
      borderStyle: {
        solid: "border-solid",
        dashed: "border-dashed border-2",
        none: "border-none",
        left: "border-l-4 border-y-0 border-r-0 rounded-l-none",
        glow: "border-solid shadow-lg"
      },
      appearance: {
        filled: "",
        outlined: "bg-transparent",
        soft: "bg-opacity-10",
        gradient: "bg-gradient-to-r"
      }
    },
    compoundVariants: [
      {
        variant: "success",
        borderStyle: "left",
        className: "border-l-success-500"
      },
      {
        variant: "warning",
        borderStyle: "left",
        className: "border-l-warning-500"
      },
      {
        variant: "destructive",
        borderStyle: "left",
        className: "border-l-error-500"
      },
      {
        variant: "info",
        borderStyle: "left",
        className: "border-l-primary-500"
      },
      {
        variant: "glass",
        borderStyle: "glow",
        className: "shadow-xl border-white/30"
      }
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      borderStyle: "solid",
      appearance: "filled"
    },
  }
)

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'>,
  Omit<VariantProps<typeof alertVariants>, 'appearance'> {
  appearance?: NonNullable<VariantProps<typeof alertVariants>['appearance']>
  dismissible?: boolean
  onDismiss?: () => void
  icon?: React.ReactNode
  animated?: boolean
  closable?: boolean
  showDefaultIcon?: boolean
  pulse?: boolean
  interactive?: boolean
}

// Default icons for each variant
const DefaultIcons = {
  default: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  destructive: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  glass: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  premium: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({
    className,
    variant = "default",
    size,
    borderStyle,
  appearance,
    dismissible,
    closable = dismissible,
    onDismiss,
    icon,
    showDefaultIcon = true,
    animated = true,
    pulse,
    interactive,
    children,
    ...props
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true)
    const [isExiting, setIsExiting] = React.useState(false)

    const handleDismiss = React.useCallback(() => {
      if (animated) {
        setIsExiting(true)
        setTimeout(() => {
          setIsVisible(false)
          onDismiss?.()
        }, 300)
      } else {
        setIsVisible(false)
        onDismiss?.()
      }
    }, [animated, onDismiss])

    if (!isVisible) return null

    const displayIcon = icon || (showDefaultIcon && DefaultIcons[variant as keyof typeof DefaultIcons])

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          alertVariants({ variant, size, borderStyle, appearance }),
          animated && "transition-all duration-300",
          isExiting && "opacity-0 scale-95 translate-y-2",
          pulse && "animate-pulse",
          interactive && "hover:scale-[1.01] cursor-pointer",
          className
        )}
        {...props}
      >
        {displayIcon && (
          <div className={cn(
            "flex-shrink-0",
            size === "sm" && "mt-0",
            size === "default" && "mt-0.5",
            size === "lg" && "mt-1",
            size === "xl" && "mt-1.5"
          )}>
            <div className={cn(
              "rounded-full p-1 transition-all duration-300",
              variant === "success" && "bg-success-100",
              variant === "warning" && "bg-warning-100",
              variant === "destructive" && "bg-error-100",
              variant === "info" && "bg-primary-100",
              variant === "default" && "bg-gray-100"
            )}>
              {displayIcon}
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">{children}</div>

        {closable && (
          <button
            onClick={handleDismiss}
            className={cn(
              "flex-shrink-0 ml-auto opacity-70 hover:opacity-100 transition-all duration-300",
              "p-2 -m-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-1",
              variant === "default" && "focus:ring-gray-500",
              variant === "success" && "focus:ring-success-500",
              variant === "warning" && "focus:ring-warning-500",
              variant === "destructive" && "focus:ring-error-500",
              variant === "info" && "focus:ring-primary-500",
              "hover:scale-110 active:scale-95"
            )}
            aria-label="Dismiss alert"
          >
            <svg
              className={cn(
                "fill-none stroke-current",
                size === "sm" && "w-3 h-3",
                size === "default" && "w-4 h-4",
                size === "lg" && "w-5 h-5",
                size === "xl" && "w-6 h-6"
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
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    size?: "sm" | "md" | "lg"
    gradient?: boolean
  }
>(({ className, size = "md", gradient, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "mb-2 font-semibold leading-tight tracking-tight",
      {
        "text-sm": size === "sm",
        "text-base": size === "md",
        "text-lg": size === "lg"
      },
      gradient && "bg-gradient-to-r from-current to-current/80 bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    size?: "sm" | "md" | "lg"
  }
>(({ className, size = "md", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "leading-relaxed [&_p]:leading-relaxed [&_a]:underline [&_a]:underline-offset-2 [&_a]:font-medium hover:[&_a]:opacity-80",
      {
        "text-xs": size === "sm",
        "text-sm": size === "md",
        "text-base": size === "lg"
      },
      className
    )}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription, alertVariants }