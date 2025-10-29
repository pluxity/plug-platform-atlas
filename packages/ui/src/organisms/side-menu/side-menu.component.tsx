"use client"

import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { ChevronDown, CornerDownRight } from "lucide-react"
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
      "flex items-center justify-between gap-2 rounded-lg px-4 py-2 w-72",
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

const SideMenuSubMenu = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn(
        "ml-3 flex min-w-0 flex-col gap-1 border-l border-gray-200 pl-3 py-1",
        className
      )}
      {...props}
    />
  )
)
SideMenuSubMenu.displayName = "SideMenuSubMenu"

const SideMenuSubItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      className={cn("relative", className)}
      {...props}
    />
  )
)
SideMenuSubItem.displayName = "SideMenuSubItem"

const SideMenuSubButton = React.forwardRef<HTMLAnchorElement, React.ComponentProps<"a">>(
  ({ className, children, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "flex h-7 min-w-0 items-center gap-2 overflow-hidden rounded-md px-2 text-xs",
        "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        "transition-colors",
        className
      )}
      {...props}
    >
      <CornerDownRight className="h-3 w-3 shrink-0 text-gray-400" />
      <span className="truncate">{children}</span>
    </a>
  )
)
SideMenuSubButton.displayName = "SideMenuSubButton"

export {
  SideMenu,
  SideMenuTrigger,
  SideMenuContent,
  SideMenuLogo,
  SideMenuHeader,
  SideMenuNav,
  SideMenuFooter,
  SideMenuSubMenu,
  SideMenuSubItem,
  SideMenuSubButton,
}
