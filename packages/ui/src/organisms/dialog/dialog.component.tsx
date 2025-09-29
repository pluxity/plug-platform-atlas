"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cva } from "class-variance-authority"
import { X, Loader2, AlertTriangle, CheckCircle, Info } from "lucide-react"

import { cn } from "../../lib/utils"
import {
  DialogTriggerProps,
  DialogContentProps,
  DialogOverlayProps,
  DialogHeaderProps,
  DialogFooterProps,
  DialogTitleProps,
  DialogDescriptionProps
} from "./dialog.types"

// Variant definitions
const dialogOverlayVariants = cva(
  "fixed inset-0 z-50 transition-all duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  {
    variants: {
      variant: {
        default: "bg-black/80 backdrop-blur-sm",
        light: "bg-black/40 backdrop-blur-sm",
        dark: "bg-black/90 backdrop-blur-md",
        blur: "bg-white/10 backdrop-blur-lg"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const dialogContentVariants = cva(
  "fixed left-[50%] top-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg transition-all duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg focus:outline-none",
  {
    variants: {
      size: {
        sm: "w-full max-w-sm p-4",
        default: "w-full max-w-lg p-6",
        lg: "w-full max-w-2xl p-6",
        xl: "w-full max-w-4xl p-8",
        "2xl": "w-full max-w-6xl p-8",
        full: "w-[95vw] h-[95vh] max-w-none p-6 sm:p-8"
      },
      variant: {
        default: "border-gray-200",
        drawer: "fixed inset-x-0 bottom-0 top-auto translate-x-0 translate-y-0 rounded-t-lg data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        fullscreen: "w-screen h-screen max-w-none rounded-none translate-x-[-50%] translate-y-[-50%] data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100"
      },
      state: {
        default: "",
        loading: "opacity-75 pointer-events-none",
        error: "border-error-200 shadow-error-100/50",
        success: "border-success-200 shadow-success-100/50",
        warning: "border-warning-200 shadow-warning-100/50"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default",
      state: "default"
    }
  }
)

const Dialog = DialogPrimitive.Root

const DialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  DialogTriggerProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Trigger
    ref={ref}
    className={cn(className)}
    {...props}
  />
))
DialogTrigger.displayName = DialogPrimitive.Trigger.displayName

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, variant, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(dialogOverlayVariants({ variant }), className)}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({
  className,
  children,
  size,
  variant,
  state,
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  loading = false,
  onOpenAutoFocus,
  onCloseAutoFocus,
  ...props
}, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(dialogContentVariants({ size, variant, state }), className)}
      onOpenAutoFocus={onOpenAutoFocus}
      onCloseAutoFocus={onCloseAutoFocus}
      onEscapeKeyDown={closeOnEscape ? undefined : (e) => e.preventDefault()}
      onPointerDownOutside={closeOnOutsideClick ? undefined : (e) => e.preventDefault()}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      )}

      {state === "error" && (
        <div className="absolute -top-2 left-4 flex items-center gap-1 px-2 py-1 text-xs font-medium text-error-700 bg-error-100 rounded border border-error-200">
          <AlertTriangle className="h-3 w-3" />
          Error
        </div>
      )}

      {state === "success" && (
        <div className="absolute -top-2 left-4 flex items-center gap-1 px-2 py-1 text-xs font-medium text-success-700 bg-success-100 rounded border border-success-200">
          <CheckCircle className="h-3 w-3" />
          Success
        </div>
      )}

      {state === "warning" && (
        <div className="absolute -top-2 left-4 flex items-center gap-1 px-2 py-1 text-xs font-medium text-warning-700 bg-warning-100 rounded border border-warning-200">
          <Info className="h-3 w-3" />
          Warning
        </div>
      )}

      {children}

      {showCloseButton && (
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-all duration-200 hover:opacity-100 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground p-1">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  align = "left",
  ...props
}: DialogHeaderProps) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5",
      {
        "text-left": align === "left",
        "text-center": align === "center",
        "text-right": align === "right"
      },
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  justify = "end",
  direction = "row",
  ...props
}: DialogFooterProps) => (
  <div
    className={cn(
      "flex gap-2",
      {
        "flex-col": direction === "column",
        "flex-row": direction === "row",
        "justify-start": justify === "start",
        "justify-center": justify === "center",
        "justify-end": justify === "end",
        "justify-between": justify === "between"
      },
      direction === "column" ? "space-y-2" : "space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, level = 2, ...props }, ref) => {
  const Component = `h${level}` as React.ElementType
  const sizeClasses = {
    1: "text-2xl font-bold",
    2: "text-xl font-semibold",
    3: "text-lg font-semibold",
    4: "text-base font-semibold",
    5: "text-sm font-semibold",
    6: "text-xs font-semibold"
  }

  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn(
        "leading-none tracking-tight text-foreground",
        sizeClasses[level],
        className
      )}
      {...props}
      asChild
    >
      <Component>{props.children}</Component>
    </DialogPrimitive.Title>
  )
})
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "text-muted-foreground",
    subtle: "text-gray-500",
    error: "text-error-600",
    warning: "text-warning-600",
    success: "text-success-600"
  }

  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn(
        "text-sm leading-relaxed",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
})
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
}