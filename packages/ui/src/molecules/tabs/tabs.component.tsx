import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const tabsListVariants = cva(
  "inline-flex items-center justify-center text-gray-600 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "rounded-lg bg-gray-100 p-1",
        underline: "border-b border-gray-200",
        pills: "gap-1",
        buttons: "gap-2",
        card: "rounded-lg border border-gray-200 bg-white p-1 shadow-sm",
        minimal: "gap-4"
      },
      size: {
        sm: "h-8 text-sm",
        default: "h-10 text-sm",
        lg: "h-12 text-base"
      },
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col w-fit"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      orientation: "horizontal"
    }
  }
)

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "rounded-md px-3 py-1.5 hover:bg-gray-200/80 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm",
        underline: "relative px-4 py-2 border-b-2 border-transparent hover:text-gray-900 hover:border-gray-300 data-[state=active]:text-primary-600 data-[state=active]:border-primary-600",
        pills: "rounded-full px-4 py-2 bg-gray-200 hover:bg-gray-300 data-[state=active]:bg-primary-600 data-[state=active]:text-white data-[state=active]:shadow-sm",
        buttons: "rounded-lg px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 data-[state=active]:bg-primary-600 data-[state=active]:text-white data-[state=active]:border-primary-600 data-[state=active]:shadow-sm",
        card: "rounded-md px-3 py-1.5 hover:bg-gray-100 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700 data-[state=active]:shadow-sm",
        minimal: "px-4 py-2 hover:text-gray-900 data-[state=active]:text-primary-600 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600 after:scale-x-0 after:transition-transform after:duration-200 data-[state=active]:after:scale-x-100"
      },
      size: {
        sm: "text-xs min-h-[28px]",
        default: "text-sm min-h-[36px]",
        lg: "text-base min-h-[44px]"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

type TabsContextType = {
  value?: string
  onValueChange?: (value: string) => void
  variant?: "default" | "underline" | "pills" | "buttons" | "card" | "minimal"
  size?: "sm" | "default" | "lg"
  orientation?: "horizontal" | "vertical"
}

const TabsContext = React.createContext<TabsContextType>({})

const useTabs = () => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("useTabs must be used within a Tabs provider")
  }
  return context
}

export interface TabsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsListVariants> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  animated?: boolean
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({
    className,
    value,
    defaultValue,
    onValueChange,
    variant = "default",
    size = "default",
    orientation = "horizontal",
    animated = true,
    children,
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : internalValue

    const handleValueChange = React.useCallback((newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    }, [isControlled, onValueChange])

    return (
      <TabsContext.Provider
        value={{
          value: currentValue,
          onValueChange: handleValueChange,
          variant: variant || "default",
          size: size || "default",
          orientation: orientation || "horizontal"
        }}
      >
        <div
          ref={ref}
          className={cn(
            "flex gap-2",
            orientation === "vertical" ? "flex-row" : "flex-col",
            animated && "transition-all duration-200",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = "Tabs"

export interface TabsListProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => {
    const { variant, size, orientation } = useTabs()

    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          tabsListVariants({ variant, size, orientation }),
          className
        )}
        {...props}
      />
    )
  }
)
TabsList.displayName = "TabsList"

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  icon?: React.ReactNode
  badge?: React.ReactNode
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, children, icon, badge, disabled, ...props }, ref) => {
    const { value: selectedValue, onValueChange, variant, size } = useTabs()
    const isActive = selectedValue === value

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          tabsTriggerVariants({ variant, size }),
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onClick={() => !disabled && onValueChange?.(value)}
        disabled={disabled}
        {...props}
      >
        {icon && (
          <span className="mr-2 flex-shrink-0">
            {icon}
          </span>
        )}
        <span className="truncate">{children}</span>
        {badge && (
          <span className="ml-2 flex-shrink-0">
            {badge}
          </span>
        )}
      </button>
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  forceMount?: boolean
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, forceMount = false, ...props }, ref) => {
    const { value: selectedValue } = useTabs()
    const isActive = value === selectedValue
    const [shouldRender, setShouldRender] = React.useState(isActive || forceMount)

    React.useEffect(() => {
      if (isActive) {
        setShouldRender(true)
      } else if (!forceMount) {
        const timer = setTimeout(() => setShouldRender(false), 200)
        return () => clearTimeout(timer)
      }
    }, [isActive, forceMount])

    if (!shouldRender) {
      return null
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        tabIndex={-1}
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
          "transition-all duration-200",
          !isActive && !forceMount && "opacity-0 pointer-events-none",
          isActive && "opacity-100",
          className
        )}
        hidden={!isActive && !forceMount}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsTriggerVariants }