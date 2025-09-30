import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"

export interface SelectProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
  loading?: boolean
  error?: string
  required?: boolean
}

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  variant?: "default" | "outline" | "filled" | "ghost"
  size?: "sm" | "default" | "lg"
  state?: "default" | "error" | "success" | "warning"
  loading?: boolean
  error?: boolean
  success?: boolean
  icon?: React.ReactNode
  clearable?: boolean
  onClear?: () => void
}

export interface SelectContentProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {
  size?: "sm" | "default" | "lg"
  loading?: boolean
  emptyMessage?: string
  maxHeight?: number
}

export interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  size?: "sm" | "default" | "lg"
  description?: string
  icon?: React.ReactNode
  badge?: string
}

export interface SelectLabelProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> {
  required?: boolean
}

export interface SelectGroupProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Group> {}

export interface SelectSeparatorProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> {}

export interface SelectScrollButtonProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton> {}

export type SelectSize = "sm" | "default" | "lg"
export type SelectVariant = "default" | "outline" | "filled" | "ghost"
export type SelectState = "default" | "error" | "success" | "warning"