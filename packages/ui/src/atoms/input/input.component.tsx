import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const inputVariants = cva(
  "flex w-full rounded-xl border bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-out-quad relative",
  {
    variants: {
      variant: {
        default: "border-gray-200 hover:border-gray-300 focus-visible:ring-primary-500/20 focus-visible:border-primary-500 focus-visible:shadow-primary/20 focus-visible:shadow-lg",
        error: "border-error-300 bg-error-50/50 text-error-900 focus-visible:ring-error-500/20 focus-visible:border-error-500 focus-visible:shadow-error/20 focus-visible:shadow-lg",
        success: "border-success-300 bg-success-50/50 text-success-900 focus-visible:ring-success-500/20 focus-visible:border-success-500 focus-visible:shadow-success/20 focus-visible:shadow-lg",
        warning: "border-warning-300 bg-warning-50/50 text-warning-900 focus-visible:ring-warning-500/20 focus-visible:border-warning-500 focus-visible:shadow-warning/20 focus-visible:shadow-lg",
        ghost: "border-transparent bg-gray-50 hover:bg-gray-100 focus-visible:ring-primary-500/20 focus-visible:border-primary-200 focus-visible:bg-white",
        premium: "border-gray-200 bg-gradient-to-br from-white to-gray-50/50 hover:border-gray-300 focus-visible:ring-primary-500/20 focus-visible:border-primary-500 focus-visible:shadow-glow"
      },
      scale: {
        sm: "h-8 px-3 py-1 text-xs rounded-lg",
        default: "h-10 px-4 py-2",
        lg: "h-12 px-4 py-3 text-base rounded-2xl",
        xl: "h-14 px-6 py-4 text-lg rounded-2xl"
      },
      floating: {
        true: "pt-6 pb-2",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      scale: "default",
      floating: false
    }
  }
)

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
  Omit<VariantProps<typeof inputVariants>, 'scale'> {
  scale?: NonNullable<VariantProps<typeof inputVariants>['scale']>
  helperText?: string
  errorText?: string
  successText?: string
  label?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  loading?: boolean
  clearable?: boolean
  onClear?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type,
  variant,
  scale: size,
    floating,
    helperText,
    errorText,
    successText,
    label,
    leftIcon,
    rightIcon,
    loading,
    clearable,
    onClear,
    placeholder,
    value,
    disabled,
    ...props
  }, ref) => {
    const [focused, setFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(Boolean(value))

    const finalVariant = errorText ? 'error' : successText ? 'success' : variant
    const helpText = errorText || successText || helperText

    React.useEffect(() => {
      setHasValue(Boolean(value))
    }, [value])

    const handleClear = () => {
      if (onClear) {
        onClear()
      }
    }

    const showFloatingLabel = floating && label && (focused || hasValue)
    const showPlaceholder = !floating || !label || focused || hasValue

    return (
      <div className="space-y-2">
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10",
              size === "sm" && "left-2",
              size === "lg" && "left-4",
              size === "xl" && "left-5"
            )}>
              {leftIcon}
            </div>
          )}

          {/* Floating Label */}
          {floating && label && (
            <label
              className={cn(
                "absolute transition-all duration-300 ease-out-quad pointer-events-none z-10",
                showFloatingLabel
                  ? "top-2 text-xs font-medium"
                  : "top-1/2 -translate-y-1/2 text-sm",
                leftIcon && !showFloatingLabel && "left-10",
                leftIcon && showFloatingLabel && "left-4",
                !leftIcon && showFloatingLabel && "left-4",
                !leftIcon && !showFloatingLabel && "left-4",
                finalVariant === "error" && showFloatingLabel && "text-error-600",
                finalVariant === "success" && showFloatingLabel && "text-success-600",
                finalVariant === "warning" && showFloatingLabel && "text-warning-600",
                (!finalVariant || finalVariant === "default") && showFloatingLabel && "text-primary-600",
                !showFloatingLabel && "text-gray-500"
              )}
            >
              {label}
            </label>
          )}

          {/* Input */}
          <input
            type={type}
            className={cn(
              inputVariants({ variant: finalVariant, scale: size, floating }),
              leftIcon && size === "sm" && "pl-8",
              leftIcon && size === "default" && "pl-10",
              leftIcon && size === "lg" && "pl-12",
              leftIcon && size === "xl" && "pl-14",
              (rightIcon || loading || clearable) && size === "sm" && "pr-8",
              (rightIcon || loading || clearable) && size === "default" && "pr-10",
              (rightIcon || loading || clearable) && size === "lg" && "pr-12",
              (rightIcon || loading || clearable) && size === "xl" && "pr-14",
              className
            )}
            ref={ref}
            placeholder={showPlaceholder ? placeholder : ""}
            value={value}
            disabled={disabled || loading}
            onFocus={(e) => {
              setFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setFocused(false)
              setHasValue(Boolean(e.target.value))
              props.onBlur?.(e)
            }}
            onChange={(e) => {
              setHasValue(Boolean(e.target.value))
              props.onChange?.(e)
            }}
            {...props}
          />

          {/* Right Side Icons */}
          <div className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1",
            size === "sm" && "right-2",
            size === "lg" && "right-4",
            size === "xl" && "right-5"
          )}>
            {/* Loading Spinner */}
            {loading && (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin" />
            )}

            {/* Clear Button */}
            {clearable && hasValue && !loading && (
              <button
                type="button"
                onClick={handleClear}
                className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Right Icon */}
            {rightIcon && !loading && (
              <div className="text-gray-400">
                {rightIcon}
              </div>
            )}
          </div>
        </div>

        {/* Helper/Error Text */}
        {helpText && (
          <div className="flex items-start space-x-1">
            {finalVariant === "error" && (
              <svg className="w-4 h-4 text-error-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {finalVariant === "success" && (
              <svg className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {finalVariant === "warning" && (
              <svg className="w-4 h-4 text-warning-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            )}
            <p className={cn(
              "text-xs leading-relaxed",
              finalVariant === "error" && "text-error-600",
              finalVariant === "success" && "text-success-600",
              finalVariant === "warning" && "text-warning-600",
              (!finalVariant || finalVariant === "default") && "text-gray-600"
            )}>
              {helpText}
            </p>
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }