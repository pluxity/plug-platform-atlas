import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 border",
  {
    variants: {
      variant: {
        default: "bg-transparent border-transparent hover:bg-gray-100 hover:text-gray-900 data-[state=on]:bg-gray-900 data-[state=on]:text-white data-[state=on]:border-gray-900",
        outline: "border-gray-200 bg-transparent hover:bg-gray-50 hover:text-gray-900 data-[state=on]:bg-gray-900 data-[state=on]:text-white data-[state=on]:border-gray-900",
        primary: "bg-transparent border-transparent hover:bg-primary-50 hover:text-primary-700 data-[state=on]:bg-primary-600 data-[state=on]:text-white data-[state=on]:border-primary-600",
        success: "bg-transparent border-transparent hover:bg-success-50 hover:text-success-700 data-[state=on]:bg-success-600 data-[state=on]:text-white data-[state=on]:border-success-600",
        warning: "bg-transparent border-transparent hover:bg-warning-50 hover:text-warning-700 data-[state=on]:bg-warning-600 data-[state=on]:text-white data-[state=on]:border-warning-600",
        destructive: "bg-transparent border-transparent hover:bg-error-50 hover:text-error-700 data-[state=on]:bg-error-600 data-[state=on]:text-white data-[state=on]:border-error-600"
      },
      size: {
        xs: "h-7 px-2 text-xs",
        sm: "h-8 px-2.5 text-sm",
        default: "h-9 px-3 text-sm",
        lg: "h-10 px-4 text-sm",
        xl: "h-11 px-5 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

const LoadingSpinner = ({ size }: { size: "xs" | "sm" | "default" | "lg" | "xl" }) => {
  const spinnerSize = {
    xs: "h-3 w-3",
    sm: "h-3 w-3",
    default: "h-4 w-4",
    lg: "h-4 w-4",
    xl: "h-5 w-5"
  }[size]

  return (
    <svg
      className={cn("animate-spin -ml-1 mr-2", spinnerSize)}
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

export interface ToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof toggleVariants> {
  pressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  label?: string
  description?: string
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({
    className,
    variant,
    size,
    pressed,
    onPressedChange,
    onClick,
    loading,
    leftIcon,
    rightIcon,
    label,
    description,
    children,
    disabled,
    ...props
  }, ref) => {
    const [isPressed, setIsPressed] = React.useState(pressed || false)

    React.useEffect(() => {
      if (pressed !== undefined) {
        setIsPressed(pressed)
      }
    }, [pressed])

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading) return

      const newPressed = !isPressed
      if (pressed === undefined) {
        setIsPressed(newPressed)
      }
      onPressedChange?.(newPressed)
      onClick?.(event)
    }

    const content = (
      <button
        ref={ref}
        className={cn(toggleVariants({ variant, size }), className)}
        data-state={isPressed ? "on" : "off"}
        aria-pressed={isPressed}
        onClick={handleClick}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner size={size || "default"} />}
        {!loading && leftIcon && (
          <span className={cn(
            "mr-2",
            size === "xs" && "mr-1",
            size === "sm" && "mr-1.5"
          )}>
            {leftIcon}
          </span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className={cn(
            "ml-2",
            size === "xs" && "ml-1",
            size === "sm" && "ml-1.5"
          )}>
            {rightIcon}
          </span>
        )}
      </button>
    )

    if (label || description) {
      return (
        <div className="flex items-start space-x-3">
          {content}
          <div className="grid gap-1.5 leading-none">
            {label && (
              <label className={cn(
                "text-sm font-medium leading-none cursor-pointer",
                (disabled || loading) && "opacity-70 cursor-not-allowed"
              )}>
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
        </div>
      )
    }

    return content
  }
)

Toggle.displayName = "Toggle"

export { Toggle, toggleVariants }