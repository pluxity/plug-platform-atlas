"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
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

const SideMenu = PopoverPrimitive.Root

const SideMenuTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  SideMenuTriggerProps
>(({ className, children, ...props }, ref) => (
  <PopoverPrimitive.Trigger
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
  </PopoverPrimitive.Trigger>
))
SideMenuTrigger.displayName = PopoverPrimitive.Trigger.displayName

const SideMenuContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  SideMenuContentProps
>(({ className, align = "start", sideOffset = 8, children, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-lg border bg-white shadow-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    >
      <div className="flex flex-col max-h-[80vh]">
        {children}
      </div>
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
))
SideMenuContent.displayName = PopoverPrimitive.Content.displayName

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
