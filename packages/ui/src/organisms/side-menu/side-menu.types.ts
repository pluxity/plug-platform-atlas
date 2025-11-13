import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

export interface SideMenuProps extends Omit<React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>, 'children'> {
  defaultOpen?: boolean
  collapsible?: boolean
  children?: React.ReactNode | (({ open }: { open: boolean }) => React.ReactNode)
}

export interface SideMenuTriggerProps extends React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger> {
  showChevron?: boolean
  open?: boolean
}

export type SideMenuContentProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>

export type SideMenuLogoProps = React.ComponentProps<"div">

export type SideMenuHeaderProps = React.ComponentProps<"div">

export type SideMenuNavProps = React.ComponentProps<"div">

export type SideMenuFooterProps = React.ComponentProps<"div">
