import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const tooltipVariants = cva(
  "z-50 overflow-hidden rounded-xl border shadow-lg transition-all duration-300 ease-out-quad pointer-events-none select-none backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "bg-gray-900/90 text-white border-gray-700/50 shadow-xl backdrop-blur-md",
        light: "bg-white/95 text-gray-900 border-gray-200/50 shadow-xl backdrop-blur-md",
        primary: "gradient-primary text-white border-primary-400/50 shadow-primary/50",
        success: "gradient-success text-white border-success-400/50 shadow-success/50",
        warning: "gradient-warning text-white border-warning-400/50 shadow-warning/50",
        error: "gradient-error text-white border-error-400/50 shadow-error/50",
        info: "gradient-primary-soft text-primary-900 border-primary-200/50 shadow-primary/20",
        glass: "gradient-glass border-white/20 text-gray-900 shadow-glow backdrop-blur-lg",
        premium: "bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 text-white border-gray-600/50 shadow-2xl backdrop-blur-md"
      },
      size: {
        xs: "px-2 py-1 text-xs rounded-lg",
        sm: "px-2.5 py-1.5 text-xs",
        default: "px-3 py-2 text-sm",
        lg: "px-4 py-2.5 text-base rounded-2xl",
        xl: "px-5 py-3 text-lg rounded-2xl"
      },
      side: {
        top: "data-[side=top]:animate-in data-[side=top]:slide-in-from-bottom-3 data-[side=top]:fade-in-0",
        right: "data-[side=right]:animate-in data-[side=right]:slide-in-from-left-3 data-[side=right]:fade-in-0",
        bottom: "data-[side=bottom]:animate-in data-[side=bottom]:slide-in-from-top-3 data-[side=bottom]:fade-in-0",
        left: "data-[side=left]:animate-in data-[side=left]:slide-in-from-right-3 data-[side=left]:fade-in-0"
      },
      arrow: {
        true: "after:absolute after:w-2.5 after:h-2.5 after:rotate-45 after:border",
        false: ""
      },
      appearance: {
        solid: "",
        soft: "backdrop-blur-xl",
        glow: "shadow-2xl",
        minimal: "shadow-md backdrop-blur-none"
      }
    },
    compoundVariants: [
      {
        variant: "default",
        arrow: true,
        className: "after:bg-gray-900/90 after:border-gray-700/50"
      },
      {
        variant: "light",
        arrow: true,
        className: "after:bg-white/95 after:border-gray-200/50"
      },
      {
        variant: "primary",
        arrow: true,
        className: "after:bg-primary-600 after:border-primary-400/50"
      },
      {
        variant: "success",
        arrow: true,
        className: "after:bg-success-600 after:border-success-400/50"
      },
      {
        variant: "warning",
        arrow: true,
        className: "after:bg-warning-600 after:border-warning-400/50"
      },
      {
        variant: "error",
        arrow: true,
        className: "after:bg-error-600 after:border-error-400/50"
      },
      {
        variant: "info",
        arrow: true,
        className: "after:bg-primary-50 after:border-primary-200/50"
      },
      {
        variant: "glass",
        arrow: true,
        className: "after:bg-white/20 after:border-white/30 after:backdrop-blur-sm"
      },
      {
        variant: "premium",
        arrow: true,
        className: "after:bg-gray-800/95 after:border-gray-600/50"
      },
      {
        appearance: "glow",
        className: "shadow-2xl animate-pulse"
      }
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      side: "top",
      arrow: true,
      appearance: "solid"
    }
  }
)

type TooltipContextType = {
  open: boolean
  setOpen: (open: boolean) => void
  delayDuration: number
  hideDelay: number
  variant: "default" | "light" | "primary" | "success" | "warning" | "error" | "info"
  size: "sm" | "default" | "lg"
}

const TooltipContext = React.createContext<TooltipContextType | null>(null)

const useTooltip = () => {
  const context = React.useContext(TooltipContext)
  if (!context) {
    throw new Error("useTooltip must be used within a TooltipProvider")
  }
  return context
}

export interface TooltipProviderProps {
  children: React.ReactNode
  delayDuration?: number
  hideDelay?: number
  variant?: "default" | "light" | "primary" | "success" | "warning" | "error" | "info"
  size?: "sm" | "default" | "lg"
}

const TooltipProvider = ({
  children,
  delayDuration = 500,
  hideDelay = 0,
  variant = "default",
  size = "default"
}: TooltipProviderProps) => {
  const [open, setOpen] = React.useState(false)

  return (
    <TooltipContext.Provider value={{ open, setOpen, delayDuration, hideDelay, variant, size }}>
      {children}
    </TooltipContext.Provider>
  )
}

export interface TooltipProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  delayDuration?: number
  hideDelay?: number
  disabled?: boolean
}

const Tooltip = ({
  children,
  open,
  onOpenChange,
  delayDuration,
  hideDelay,
  disabled = false
}: TooltipProps) => {
  const context = useTooltip()
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (disabled) return

    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
    context.setOpen(newOpen)
  }, [isControlled, onOpenChange, context, disabled])

  const mergedContext = React.useMemo(() => ({
    ...context,
    open: disabled ? false : isOpen,
    setOpen: handleOpenChange,
    delayDuration: delayDuration ?? context.delayDuration,
    hideDelay: hideDelay ?? context.hideDelay,
  }), [context, isOpen, handleOpenChange, delayDuration, hideDelay, disabled])

  return (
    <TooltipContext.Provider value={mergedContext}>
      <div className="relative inline-block">
        {children}
      </div>
    </TooltipContext.Provider>
  )
}

export interface TooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean
}

const TooltipTrigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(
  ({ children, asChild = false, ...props }, ref) => {
    const { setOpen, delayDuration, hideDelay } = useTooltip()
    const showTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
    const hideTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

    const handleMouseEnter = React.useCallback(() => {
      // Clear any existing hide timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }

      // Set show timeout
      showTimeoutRef.current = setTimeout(() => {
        setOpen(true)
      }, delayDuration)
    }, [setOpen, delayDuration])

    const handleMouseLeave = React.useCallback(() => {
      // Clear show timeout
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current)
        showTimeoutRef.current = null
      }

      // Set hide timeout
      if (hideDelay > 0) {
        hideTimeoutRef.current = setTimeout(() => {
          setOpen(false)
        }, hideDelay)
      } else {
        setOpen(false)
      }
    }, [setOpen, hideDelay])

    const handleFocus = React.useCallback(() => {
      handleMouseEnter()
    }, [handleMouseEnter])

    const handleBlur = React.useCallback(() => {
      handleMouseLeave()
    }, [handleMouseLeave])

    React.useEffect(() => {
      return () => {
        if (showTimeoutRef.current) {
          clearTimeout(showTimeoutRef.current)
        }
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
        }
      }
    }, [])

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ...props,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onFocus: handleFocus,
        onBlur: handleBlur,
        ref
      })
    }

    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
        {...props}
      >
        {children}
      </span>
    )
  }
)
TooltipTrigger.displayName = "TooltipTrigger"

export interface TooltipContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'>,
  Omit<VariantProps<typeof tooltipVariants>, 'appearance'> {
  variant?: "default" | "light" | "primary" | "success" | "warning" | "error" | "info" | "glass" | "premium"
  size?: "xs" | "sm" | "default" | "lg" | "xl"
  arrow?: boolean
  offset?: number
  maxWidth?: number
  animated?: boolean
  interactive?: boolean
  appearance?: NonNullable<VariantProps<typeof tooltipVariants>['appearance']>
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({
    className,
    side = "top",
    variant,
    size,
  appearance,
    arrow = true,
    offset = 8,
    maxWidth = 200,
    animated = true,
    interactive = false,
    children,
    ...props
  }, ref) => {
    const { open, variant: contextVariant, size: contextSize } = useTooltip()
    const [isVisible, setIsVisible] = React.useState(false)
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
      if (open) {
        setIsVisible(true)
        setIsMounted(true)
      } else {
        const timer = setTimeout(() => {
          setIsVisible(false)
          setIsMounted(false)
        }, animated ? 300 : 0)
        return () => clearTimeout(timer)
      }
    }, [open, animated])

    if (!isMounted) return null

    const finalVariant = variant || contextVariant
    const finalSize = size || contextSize

    // Enhanced arrow positioning with better spacing
    const getArrowClasses = () => {
      if (!arrow) return ""

      const arrowOffset = finalSize === "xs" ? "1.5" : finalSize === "sm" ? "2" : finalSize === "lg" ? "3" : finalSize === "xl" ? "4" : "2.5"

      switch (side) {
        case "top":
          return `after:top-full after:left-1/2 after:-translate-x-1/2 after:-mt-[${arrowOffset}px] after:border-t after:border-l`
        case "right":
          return `after:right-full after:top-1/2 after:-translate-y-1/2 after:-ml-[${arrowOffset}px] after:border-r after:border-t`
        case "bottom":
          return `after:bottom-full after:left-1/2 after:-translate-x-1/2 after:-mb-[${arrowOffset}px] after:border-b after:border-r`
        case "left":
          return `after:left-full after:top-1/2 after:-translate-y-1/2 after:-mr-[${arrowOffset}px] after:border-l after:border-b`
        default:
          return ""
      }
    }

    // Enhanced positioning with better responsive handling
    const getPositionClasses = () => {
      const baseOffset = offset + (arrow ? 4 : 0)

      switch (side) {
        case "top":
          return `bottom-full left-1/2 -translate-x-1/2 mb-${baseOffset > 8 ? `[${baseOffset}px]` : baseOffset}`
        case "right":
          return `left-full top-1/2 -translate-y-1/2 ml-${baseOffset > 8 ? `[${baseOffset}px]` : baseOffset}`
        case "bottom":
          return `top-full left-1/2 -translate-x-1/2 mt-${baseOffset > 8 ? `[${baseOffset}px]` : baseOffset}`
        case "left":
          return `right-full top-1/2 -translate-y-1/2 mr-${baseOffset > 8 ? `[${baseOffset}px]` : baseOffset}`
        default:
          return ""
      }
    }

    return (
      <div
        ref={ref}
        role="tooltip"
        data-side={side}
        data-state={open ? "open" : "closed"}
        style={{
          maxWidth: `${maxWidth}px`,
          minWidth: finalSize === "xs" ? "80px" : finalSize === "sm" ? "120px" : "160px"
        }}
        className={cn(
          tooltipVariants({ variant: finalVariant, size: finalSize, side, arrow, appearance }),
          "absolute z-50 w-max transform-gpu",
          getPositionClasses(),
          getArrowClasses(),
          interactive && "pointer-events-auto cursor-default",
          !isVisible && animated && "animate-out fade-out-0 zoom-out-95 duration-200",
          isVisible && animated && "animate-in fade-in-0 zoom-in-95 duration-300",
          !animated && !isVisible && "opacity-0",
          !animated && isVisible && "opacity-100",
          className
        )}
        {...props}
      >
        <div className="relative z-10 leading-relaxed font-medium">
          {children}
        </div>
      </div>
    )
  }
)
TooltipContent.displayName = "TooltipContent"

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, tooltipVariants }