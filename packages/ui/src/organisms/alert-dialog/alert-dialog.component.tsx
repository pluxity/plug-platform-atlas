"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { VariantProps, cva } from "class-variance-authority"
import { AlertTriangle, CheckCircle, Info, XIcon } from "lucide-react"

import { cn } from "../../lib/utils"

// Variant definitions
const alertDialogContentVariants = cva(
  "fixed left-[50%] top-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg transition-all duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg focus:outline-none",
  {
    variants: {
      size: {
        sm: "w-full max-w-sm p-4",
        default: "w-full max-w-lg p-6",
        lg: "w-full max-w-2xl p-6"
      },
      variant: {
        default: "border-gray-200",
        destructive: "border-error-200 shadow-error-100/50",
        warning: "border-warning-200 shadow-warning-100/50",
        success: "border-success-200 shadow-success-100/50"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default"
    }
  }
)

export interface AlertDialogContentProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Content>,
    VariantProps<typeof alertDialogContentVariants> {
  showIcon?: boolean
  iconVariant?: "default" | "destructive" | "warning" | "success"
  showCloseButton?: boolean
  closeButtonClassName?: string
}

export interface AlertDialogActionProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Action>,
    VariantProps<typeof alertDialogActionVariants> {}

export interface AlertDialogCancelProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Cancel>,
    VariantProps<typeof alertDialogCancelVariants> {}

const alertDialogActionVariants = cva(
  "inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800",
        destructive: "bg-error-600 text-white hover:bg-error-700 active:bg-error-800",
        warning: "bg-warning-600 text-white hover:bg-warning-700 active:bg-warning-800",
        success: "bg-success-600 text-white hover:bg-success-700 active:bg-success-800"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const alertDialogCancelVariants = cva(
  "mt-2 inline-flex h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium ring-offset-background transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:mt-0",
  {
    variants: {
      variant: {
        default: "border-gray-200 bg-background text-gray-900",
        outline: "border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-background/10 backdrop-blur-xs data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  children,
  size,
  variant,
  showIcon = false,
  iconVariant,
  showCloseButton = true,
  closeButtonClassName,
  ...props
}: AlertDialogContentProps) {
  const displayIconVariant = iconVariant || variant || "default"

  const IconComponent = {
    default: Info,
    destructive: AlertTriangle,
    warning: AlertTriangle,
    success: CheckCircle
  }[displayIconVariant]

  const iconColorClass = {
    default: "text-primary-600",
    destructive: "text-error-600",
    warning: "text-warning-600",
    success: "text-success-600"
  }[displayIconVariant]

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(alertDialogContentVariants({ size, variant }), className)}
        {...props}
      >
        {showCloseButton && (
          <AlertDialogPrimitive.Cancel
            data-slot="alert-dialog-close"
            className={cn(
              "ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none text-black hover:text-black [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-5 z-10",
              closeButtonClassName
            )}
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </AlertDialogPrimitive.Cancel>
        )}
        {showIcon && (
          <div className="flex justify-center mb-2">
            <div className={cn(
              "flex items-center justify-center size-12 rounded-full",
              variant === "destructive" && "bg-error-100",
              variant === "warning" && "bg-warning-100",
              variant === "success" && "bg-success-100",
              variant === "default" && "bg-primary-100"
            )}>
              <IconComponent className={cn("size-6", iconColorClass)} />
            </div>
          </div>
        )}
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "flex flex-col space-y-2",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex justify-center gap-3",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  variant,
  ...props
}: AlertDialogActionProps) {
  return (
    <AlertDialogPrimitive.Action
      data-slot="alert-dialog-action"
      className={cn(alertDialogActionVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  variant,
  ...props
}: AlertDialogCancelProps) {
  return (
    <AlertDialogPrimitive.Cancel
      data-slot="alert-dialog-cancel"
      className={cn(alertDialogCancelVariants({ variant }), className)}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
