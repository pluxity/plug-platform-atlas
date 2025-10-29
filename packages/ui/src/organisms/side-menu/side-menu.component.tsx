import * as React from "react"
import { cn } from "../../lib/utils"
import {
  SideMenuProps,
  SideMenuLogoProps,
  SideMenuContentProps,
  SideMenuHeaderProps,
  SideMenuFooterProps,
  SideMenuNavProps,
} from "./side-menu.types"

const SideMenu = React.forwardRef<HTMLDivElement, SideMenuProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col", className)}
      {...props}
    >
      {children}
    </div>
  )
)
SideMenu.displayName = "SideMenu"

const SideMenuLogo = React.forwardRef<HTMLDivElement, SideMenuLogoProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center px-3 py-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
SideMenuLogo.displayName = "SideMenuLogo"

const SideMenuContent = React.forwardRef<HTMLDivElement, SideMenuContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-1 flex-col overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  )
)
SideMenuContent.displayName = "SideMenuContent"

const SideMenuHeader = React.forwardRef<HTMLDivElement, SideMenuHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-3 py-2", className)}
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
      className={cn("flex-1 overflow-y-auto px-2 py-1", className)}
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
      className={cn("border-t border-gray-200 px-3 py-2", className)}
      {...props}
    >
      {children}
    </div>
  )
)
SideMenuFooter.displayName = "SideMenuFooter"

export {
  SideMenu,
  SideMenuLogo,
  SideMenuContent,
  SideMenuHeader,
  SideMenuNav,
  SideMenuFooter,
}
