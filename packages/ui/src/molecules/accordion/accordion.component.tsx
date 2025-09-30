import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown, Plus, Minus } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const accordionVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "space-y-1",
        bordered: "border border-gray-200 rounded-xl overflow-hidden shadow-sm",
        separated: "space-y-3",
        card: "space-y-3",
        minimal: "space-y-0",
      },
      size: {
        sm: "text-sm",
        default: "",
        lg: "text-lg",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    }
  }
)

const accordionItemVariants = cva(
  "group transition-all duration-300 ease-out overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-b border-gray-200/80 last:border-b-0 hover:bg-gradient-to-r hover:from-gray-50/30 hover:to-transparent backdrop-blur-sm",
        bordered: "first:rounded-t-2xl last:rounded-b-2xl border-b border-gray-100/60 last:border-b-0 hover:bg-gradient-to-r hover:from-primary-50/20 hover:to-blue-50/10",
        separated: "mb-2 last:mb-0 border border-gray-200/70 rounded-2xl shadow-sm hover:shadow-xl hover:border-primary-300/50 bg-white backdrop-blur-md hover:bg-gradient-to-br hover:from-white hover:via-primary-50/10 hover:to-blue-50/20",
        card: "mb-3 last:mb-0 border border-gray-200/60 rounded-2xl shadow-md bg-gradient-to-br from-white to-gray-50/30 hover:shadow-xl hover:border-primary-300/60 hover:bg-gradient-to-br hover:from-white hover:via-primary-50/20 hover:to-blue-50/30 backdrop-blur-sm",
        minimal: "hover:bg-gradient-to-r hover:from-gray-50/40 hover:to-transparent rounded-xl",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const accordionTriggerVariants = cva(
  "relative flex flex-1 items-center justify-between font-semibold transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 group-hover:text-primary-700 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-transparent before:to-transparent before:opacity-0 before:transition-all before:duration-300 group-hover:before:opacity-100",
  {
    variants: {
      variant: {
        default: "py-5 px-2 hover:translate-x-2 before:bg-gradient-to-r before:from-primary-50/30 before:to-blue-50/20",
        bordered: "px-7 py-5 first:rounded-t-2xl before:bg-gradient-to-r before:from-primary-50/40 before:to-blue-50/20",
        separated: "px-6 py-5 rounded-2xl before:bg-gradient-to-r before:from-primary-50/30 before:via-white/20 before:to-blue-50/20",
        card: "px-7 py-6 rounded-2xl before:bg-gradient-to-r before:from-primary-50/40 before:via-white/10 before:to-blue-50/30",
        minimal: "py-4 px-2 hover:translate-x-2 before:bg-gradient-to-r before:from-gray-50/60 before:to-transparent",
      },
      size: {
        sm: "text-sm py-3",
        default: "text-base py-4",
        lg: "text-lg py-6",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

const accordionContentVariants = cva(
  "overflow-hidden transition-all duration-500 ease-out data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
  {
    variants: {
      variant: {
        default: "text-gray-700 leading-relaxed relative before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-gray-200 before:to-transparent before:opacity-60",
        bordered: "text-gray-700 leading-relaxed bg-gradient-to-b from-gray-50/40 to-white/80 backdrop-blur-sm relative before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary-200/60 before:to-transparent",
        separated: "text-gray-700 leading-relaxed relative",
        card: "text-gray-700 leading-relaxed bg-gradient-to-b from-primary-50/30 via-white/40 to-blue-50/20 backdrop-blur-sm relative before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary-300/40 before:to-transparent",
        minimal: "text-gray-600 leading-relaxed relative before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-gray-100 before:to-transparent before:opacity-40",
      },
      size: {
        sm: "text-xs leading-5",
        default: "text-sm leading-6",
        lg: "text-base leading-7",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

// Create a context to pass variant and size to child components
const AccordionContext = React.createContext<{
  variant?: "default" | "bordered" | "separated" | "card" | "minimal"
  size?: "sm" | "default" | "lg"
}>({})

export interface AccordionProps {
  variant?: "default" | "bordered" | "separated" | "card" | "minimal"
  size?: "sm" | "default" | "lg"
  className?: string
  children?: React.ReactNode
  type: "single" | "multiple"
  collapsible?: boolean
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[]) => void
  disabled?: boolean
}

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(({ className, variant, size, children, type, collapsible, value, defaultValue, onValueChange, disabled, ...props }, ref) => (
  <AccordionContext.Provider value={{ variant, size }}>
    <AccordionPrimitive.Root
      ref={ref}
      className={cn(accordionVariants({ variant, size }), className)}
      type={type as any}
      collapsible={collapsible}
      value={value as any}
      defaultValue={defaultValue as any}
      onValueChange={onValueChange as any}
      disabled={disabled}
      {...props}
    >
      {children}
    </AccordionPrimitive.Root>
  </AccordionContext.Provider>
))
Accordion.displayName = AccordionPrimitive.Root.displayName

export interface AccordionItemProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>,
    VariantProps<typeof accordionItemVariants> {}

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, variant, ...props }, ref) => {
  const context = React.useContext(AccordionContext)
  const finalVariant = variant || context.variant

  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(accordionItemVariants({ variant: finalVariant }), className)}
      {...props}
    />
  )
})
AccordionItem.displayName = "AccordionItem"

export interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>,
    VariantProps<typeof accordionTriggerVariants> {
  icon?: "chevron" | "plus" | "none"
  iconPosition?: "left" | "right"
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, variant, size, icon = "chevron", iconPosition = "right", ...props }, ref) => {
  const context = React.useContext(AccordionContext)
  const finalVariant = variant || context.variant
  const finalSize = size || context.size

  const renderIcon = () => {
    if (icon === "none") return null

    const iconClass = "h-5 w-5 shrink-0 transition-all duration-300 ease-out group-hover:text-primary-600 group-hover:scale-110 drop-shadow-sm"

    if (icon === "plus") {
      return (
        <>
          <Plus className={cn(iconClass, "[&[data-state=open]]:hidden")} />
          <Minus className={cn(iconClass, "[&[data-state=closed]]:hidden")} />
        </>
      )
    }

    return <ChevronDown className={cn(iconClass, "[&[data-state=open]]:rotate-180")} />
  }

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          accordionTriggerVariants({ variant: finalVariant, size: finalSize }),
          "[&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {iconPosition === "left" && renderIcon()}
        <span className="flex-1 text-left">{children}</span>
        {iconPosition === "right" && renderIcon()}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
})
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

export interface AccordionContentProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>,
    VariantProps<typeof accordionContentVariants> {}

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(AccordionContext)
  const finalVariant = variant || context.variant
  const finalSize = size || context.size

  const getContentPadding = () => {
    switch (finalVariant) {
      case "bordered":
        return "px-7 pb-7 pt-4"
      case "card":
        return "px-7 pb-8 pt-5"
      case "separated":
        return "px-6 pb-6 pt-4"
      case "minimal":
        return "px-2 pb-5 pt-3"
      default:
        return "px-2 pb-5 pt-4"
    }
  }

  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        accordionContentVariants({ variant: finalVariant, size: finalSize }),
        className
      )}
      {...props}
    >
      <div className={cn(getContentPadding())}>{children}</div>
    </AccordionPrimitive.Content>
  )
})

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
}