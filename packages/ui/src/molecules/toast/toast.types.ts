import { VariantProps } from "class-variance-authority"
import { toastVariants } from "./toast.component"

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof toastVariants> {
  action?: React.ReactElement
}

export interface ToastActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  altText: string
}

export interface ToastTitleProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface ToastDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface ToastData {
  id: string
  title?: string
  description?: string
  action?: React.ReactElement
  variant?: ToastVariant
  duration?: number
}

export interface ToastContainerProps {
  toasts: ToastData[]
  onDismiss: (id: string) => void
}

export type ToastVariant = "default" | "destructive" | "success" | "warning"