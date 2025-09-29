import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground transition-all duration-300 ease-out-quad relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-gray-200 shadow-soft backdrop-blur-sm",
        elevated: "border-gray-200 shadow-medium hover:shadow-large",
        premium: "gradient-glass border-white/20 shadow-glow",
        gradient: "gradient-primary-soft border-primary-200/50 shadow-primary text-primary-900",
        outlined: "border-gray-300 shadow-none hover:border-gray-400",
        ghost: "border-transparent shadow-none hover:bg-gray-50/50",
        glass: "glass border-white/10",
      },
      hover: {
        none: "",
        lift: "hover:shadow-large hover:-translate-y-1 hover:scale-[1.01]",
        glow: "hover:shadow-glow hover:ring-1 hover:ring-primary-200/50 hover:border-primary-300/50",
        scale: "hover:scale-[1.02] hover:shadow-medium",
        shimmer: "shimmer hover:shadow-medium",
        gradient: "hover:shadow-primary hover:scale-[1.01] hover:-translate-y-0.5",
      },
      padding: {
        none: "",
        xs: "p-3",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      size: {
        sm: "max-w-sm",
        default: "",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "w-full",
      },
      background: {
        default: "",
        soft: "bg-gradient-to-br from-white to-gray-50/50",
        primary: "gradient-primary-soft",
        success: "gradient-success-soft",
        warning: "gradient-warning-soft",
        error: "gradient-error-soft",
      }
    },
    compoundVariants: [
      {
        variant: "premium",
        hover: "glow",
        className: "hover:shadow-xl hover:border-white/30"
      },
      {
        variant: "gradient",
        hover: "gradient",
        className: "hover:shadow-xl"
      }
    ],
    defaultVariants: {
      variant: "default",
      hover: "none",
      padding: "none",
      size: "default",
      background: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  clickable?: boolean
  disabled?: boolean
  loading?: boolean
  animated?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    variant,
    hover,
    padding,
    size,
    background,
    clickable,
    disabled,
    loading,
    animated = true,
    children,
    ...props
  }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, hover, padding, size, background }),
        clickable && "cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        disabled && "opacity-60 cursor-not-allowed pointer-events-none",
        loading && "pointer-events-none",
        animated && "transform-gpu",
        className
      )}
      role={clickable ? "button" : undefined}
      tabIndex={clickable && !disabled ? 0 : undefined}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
          <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {children}
    </div>
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    gradient?: boolean
    centerAlign?: boolean
  }
>(({ className, gradient, centerAlign, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-2 p-6 relative",
      gradient && "bg-gradient-to-r from-primary-50 to-primary-100/50 -mx-6 -mt-6 mb-6 rounded-t-xl border-b border-primary-200/50",
      centerAlign && "text-center items-center",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: "sm" | "md" | "lg" | "xl"
    gradient?: boolean
  }
>(({ className, size = "md", gradient, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "font-semibold leading-tight tracking-tight",
      {
        "text-lg": size === "sm",
        "text-xl": size === "md",
        "text-2xl": size === "lg",
        "text-3xl": size === "xl",
      },
      gradient && "bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    muted?: boolean
  }
>(({ className, muted = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm leading-relaxed",
      muted ? "text-muted-foreground" : "text-foreground/80",
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    spacing?: "none" | "sm" | "md" | "lg"
  }
>(({ className, spacing = "md", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      {
        "": spacing === "none",
        "p-3 pt-0": spacing === "sm",
        "p-6 pt-0": spacing === "md",
        "p-8 pt-0": spacing === "lg",
      },
      className
    )}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    justify?: "start" | "center" | "end" | "between"
    spacing?: "none" | "sm" | "md" | "lg"
    border?: boolean
  }
>(({ className, justify = "start", spacing = "md", border, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center",
      {
        "": spacing === "none",
        "p-3 pt-0": spacing === "sm",
        "p-6 pt-0": spacing === "md",
        "p-8 pt-0": spacing === "lg",
      },
      {
        "justify-start": justify === "start",
        "justify-center": justify === "center",
        "justify-end": justify === "end",
        "justify-between": justify === "between",
      },
      border && "border-t border-gray-200/50 mt-4 pt-4",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }