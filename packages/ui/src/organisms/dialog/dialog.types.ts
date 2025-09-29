import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

export interface DialogProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {
  modal?: boolean
}

export interface DialogTriggerProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> {
  asChild?: boolean
}

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: "sm" | "default" | "lg" | "xl" | "2xl" | "full"
  variant?: "default" | "drawer" | "fullscreen"
  state?: "default" | "loading" | "error" | "success" | "warning"
  showCloseButton?: boolean
  closeOnOutsideClick?: boolean
  closeOnEscape?: boolean
  loading?: boolean
  onOpenAutoFocus?: (event: Event) => void
  onCloseAutoFocus?: (event: Event) => void
}

export interface DialogOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {
  variant?: "default" | "light" | "dark" | "blur"
}

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "left" | "center" | "right"
}

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: "start" | "center" | "end" | "between"
  direction?: "row" | "column"
}

export interface DialogTitleProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

export interface DialogDescriptionProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {
  variant?: "default" | "subtle" | "error" | "warning" | "success"
}

export type DialogSize = "sm" | "default" | "lg" | "xl" | "2xl" | "full"
export type DialogVariant = "default" | "drawer" | "fullscreen"
export type DialogState = "loading" | "error" | "success" | "warning"