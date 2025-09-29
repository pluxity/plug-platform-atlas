import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive border-destructive bg-destructive text-destructive-foreground",
        success: "border-green-500 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200",
        warning: "border-yellow-500 bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

type ToastActionElement = React.ReactElement<typeof ToastAction>

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof toastVariants> {
  action?: ToastActionElement
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
Toast.displayName = "Toast"

export interface ToastActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  altText: string
}

const ToastAction = React.forwardRef<HTMLButtonElement, ToastActionProps>(
  ({ className, altText, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
        className
      )}
      aria-label={altText}
      {...props}
    />
  )
)
ToastAction.displayName = "ToastAction"

const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    aria-label="Close toast"
    {...props}
  >
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
    >
      <path
        d="m11.7816 4.03157c.0878-.08795.0878-.23087 0-.31882-.0878-.08795-.2309-.08795-.3188 0L7.5 7.68274 3.53715 3.71275c-.08795-.08795-.23087-.08795-.31882 0-.08795.08795-.08795.23087 0 .31882L7.18118 8.00157l-3.96275 3.96158c-.08795.0879-.08795.2309 0 .3188.08795.0879.23087.0879.31882 0L7.5 8.32043l3.9628 3.96155c.0879.0879.2309.0879.3188 0 .0879-.0879.0879-.2309 0-.3188L8.81882 8.00157 11.7816 4.03157Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  </button>
))
ToastClose.displayName = "ToastClose"

const ToastTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = "ToastDescription"


// Hook for managing toasts
type ToastType = "default" | "destructive" | "success" | "warning"

export interface ToastData {
  id: string
  title?: string
  description?: string
  action?: ToastActionElement
  variant?: ToastType
  duration?: number
}

const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastData[]>([])

  const toast = React.useCallback(
    ({ id = Math.random().toString(36), duration = 5000, ...props }: Omit<ToastData, "id"> & { id?: string }) => {
      setToasts((currentToasts) => [...currentToasts, { id, ...props }])

      if (duration > 0) {
        setTimeout(() => {
          setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
        }, duration)
      }

      return id
    },
    []
  )

  const dismiss = React.useCallback((toastId: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== toastId))
  }, [])

  const dismissAll = React.useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    toast,
    dismiss,
    dismissAll
  }
}

// Toast Container Component
export interface ToastContainerProps {
  toasts: ToastData[]
  onDismiss: (id: string) => void
}

const ToastContainer = ({ toasts, onDismiss }: ToastContainerProps) => {
  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast key={toast.id} variant={toast.variant}>
          <div className="grid gap-1">
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
          </div>
          {toast.action}
          <ToastClose onClick={() => onDismiss(toast.id)} />
        </Toast>
      ))}
    </div>
  )
}

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastTitle,
  ToastDescription,
  ToastContainer,
  toastVariants,
  useToast
}