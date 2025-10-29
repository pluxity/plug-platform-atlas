"use client"

import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"
import {
  SideMenuProps,
  SideMenuTriggerProps,
  SideMenuContentProps,
  SideMenuLogoProps,
  SideMenuHeaderProps,
  SideMenuFooterProps,
  SideMenuNavProps,
} from "./side-menu.types"

const SideMenu = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  SideMenuProps
>(({ defaultOpen = true, collapsible = true, children, ...props }, ref) => {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <CollapsiblePrimitive.Root
      ref={ref}
      open={collapsible ? open : true}
      onOpenChange={collapsible ? setOpen : undefined}
      {...props}
    >
      {typeof children === 'function' ? children({ open }) : children}
    </CollapsiblePrimitive.Root>
  )
})
SideMenu.displayName = "SideMenu"

const SideMenuTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
  SideMenuTriggerProps
>(({ className, children, showChevron = true, open, ...props }, ref) => (
  <CollapsiblePrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2",
      "bg-white border border-gray-200 shadow-sm",
      "hover:bg-gray-50 active:bg-gray-100",
      "transition-colors",
      className
    )}
    {...props}
  >
    {children}
    {showChevron && (
      <ChevronDown
        className={cn(
          "h-4 w-4 text-gray-500 transition-transform duration-200",
          open && "rotate-180"
        )}
      />
    )}
  </CollapsiblePrimitive.Trigger>
))
SideMenuTrigger.displayName = "SideMenuTrigger"

const SideMenuContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  SideMenuContentProps
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  >
    <div className={cn(
      "mt-2 rounded-lg border bg-white shadow-lg",
      "w-72"
    )}>
      <div className="flex flex-col max-h-[80vh]">
        {children}
      </div>
    </div>
  </CollapsiblePrimitive.Content>
))
SideMenuContent.displayName = "SideMenuContent"

const SideMenuLogo = React.forwardRef<HTMLDivElement, SideMenuLogoProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center px-4 py-3 border-b",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
SideMenuLogo.displayName = "SideMenuLogo"

const SideMenuHeader = React.forwardRef<HTMLDivElement, SideMenuHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-4 py-3 border-b", className)}
      {...props}
    >
      {children}
    </div>
  )
)
SideMenuHeader.displayName = "SideMenuHeader"

const SideMenuNav = React.forwardRef<HTMLDivElement, SideMenuNavProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex-1 overflow-y-auto px-2 py-2", className)}
      {...props}
    >
      {children}
    </div>
  )
)
SideMenuNav.displayName = "SideMenuNav"

const SideMenuFooter = React.forwardRef<HTMLDivElement, SideMenuFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("border-t px-4 py-3", className)}
      {...props}
    >
      {children}
    </div>
  )
)
SideMenuFooter.displayName = "SideMenuFooter"

export {
  SideMenu,
  SideMenuTrigger,
  SideMenuContent,
  SideMenuLogo,
  SideMenuHeader,
  SideMenuNav,
  SideMenuFooter,
}
