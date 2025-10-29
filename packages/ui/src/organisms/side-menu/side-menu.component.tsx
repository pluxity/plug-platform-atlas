"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
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

const SideMenu = SheetPrimitive.Root

const SideMenuTrigger = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Trigger>,
  SideMenuTriggerProps
>(({ className, children, ...props }, ref) => (
  <SheetPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md",
      "hover:bg-gray-100 active:bg-gray-200",
      "transition-colors",
      className
    )}
    {...props}
  >
    {children}
  </SheetPrimitive.Trigger>
))
SideMenuTrigger.displayName = SheetPrimitive.Trigger.displayName

const SideMenuOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
SideMenuOverlay.displayName = SheetPrimitive.Overlay.displayName

const SideMenuContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SideMenuContentProps
>(({ className, children, ...props }, ref) => (
  <SheetPrimitive.Portal>
    <SideMenuOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 left-0 z-50 h-full w-80 bg-white shadow-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        "data-[state=closed]:duration-300 data-[state=open]:duration-300",
        className
      )}
      {...props}
    >
      <div className="flex flex-col h-full">
        {children}
      </div>
    </SheetPrimitive.Content>
  </SheetPrimitive.Portal>
))
SideMenuContent.displayName = SheetPrimitive.Content.displayName

const SideMenuLogo = React.forwardRef<HTMLDivElement, SideMenuLogoProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center px-6 py-4 border-b",
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
      className={cn("px-6 py-3 border-b", className)}
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
      className={cn("flex-1 overflow-y-auto px-3 py-4", className)}
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
      className={cn("border-t px-6 py-4", className)}
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
