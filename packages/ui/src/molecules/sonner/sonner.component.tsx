import { Toaster as Sonner, toast } from "sonner"
import type React from "react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "group w-full rounded-xl border shadow-lg p-4 flex items-start gap-3",
          title: "text-sm font-semibold",
          description: "text-sm opacity-90 mt-1",
          actionButton: "bg-primary-600 text-white hover:bg-primary-700 rounded-lg px-3 py-2 text-sm font-medium ml-auto",
          cancelButton: "bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg px-3 py-2 text-sm font-medium",
          closeButton: "absolute top-2 right-2 rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity",
        },
      }}
      {...props}
    />
  )
}

// Toast 옵션 타입
interface ToastOptions {
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number
}

// Variant별 아이콘
const SuccessIcon = () => (
  <div className="rounded-full p-1 bg-success-100 flex-shrink-0">
    <svg className="w-5 h-5 text-success-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </div>
)

const WarningIcon = () => (
  <div className="rounded-full p-1 bg-warning-100 flex-shrink-0">
    <svg className="w-5 h-5 text-warning-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  </div>
)

const ErrorIcon = () => (
  <div className="rounded-full p-1 bg-error-100 flex-shrink-0">
    <svg className="w-5 h-5 text-error-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </div>
)

const InfoIcon = () => (
  <div className="rounded-full p-1 bg-primary-100 flex-shrink-0">
    <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </div>
)

const DefaultIcon = () => (
  <div className="rounded-full p-1 bg-gray-100 flex-shrink-0">
    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </div>
)

// Success Toast
const toastSuccess = (message: React.ReactNode, options?: ToastOptions) => {
  return toast(message, {
    description: options?.description,
    duration: options?.duration,
    action: options?.action,
    unstyled: true,
    classNames: {
      toast: "bg-success-50 border-success-200 text-success-900",
      title: "text-success-900",
      description: "text-success-800",
    },
    icon: <SuccessIcon />,
  })
}

// Warning Toast
const toastWarning = (message: React.ReactNode, options?: ToastOptions) => {
  return toast(message, {
    description: options?.description,
    duration: options?.duration,
    action: options?.action,
    unstyled: true,
    classNames: {
      toast: "bg-warning-50 border-warning-200 text-warning-900",
      title: "text-warning-900",
      description: "text-warning-800",
    },
    icon: <WarningIcon />,
  })
}

// Error Toast
const toastError = (message: React.ReactNode, options?: ToastOptions) => {
  return toast(message, {
    description: options?.description,
    duration: options?.duration,
    action: options?.action,
    unstyled: true,
    classNames: {
      toast: "bg-error-50 border-error-200 text-error-900",
      title: "text-error-900",
      description: "text-error-800",
    },
    icon: <ErrorIcon />,
  })
}

// Info Toast
const toastInfo = (message: React.ReactNode, options?: ToastOptions) => {
  return toast(message, {
    description: options?.description,
    duration: options?.duration,
    action: options?.action,
    unstyled: true,
    classNames: {
      toast: "bg-primary-50 border-primary-200 text-primary-900",
      title: "text-primary-900",
      description: "text-primary-800",
    },
    icon: <InfoIcon />,
  })
}

// Default Toast
const toastDefault = (message: React.ReactNode, options?: ToastOptions) => {
  return toast(message, {
    description: options?.description,
    duration: options?.duration,
    action: options?.action,
    unstyled: true,
    classNames: {
      toast: "bg-white border-gray-200 text-gray-900",
      title: "text-gray-900",
      description: "text-gray-600",
    },
    icon: <DefaultIcon />,
  })
}

// 통합된 toast 객체 타입
type BaseToastFn = typeof toast
type ColoredToast = BaseToastFn & {
  success: (message: React.ReactNode, options?: ToastOptions) => string | number
  warning: (message: React.ReactNode, options?: ToastOptions) => string | number
  error: (message: React.ReactNode, options?: ToastOptions) => string | number
  info: (message: React.ReactNode, options?: ToastOptions) => string | number
  default: (message: React.ReactNode, options?: ToastOptions) => string | number
}

// toast 객체 확장
const extendedToast = toast as ColoredToast
extendedToast.success = toastSuccess as any
extendedToast.warning = toastWarning as any
extendedToast.error = toastError as any
extendedToast.info = toastInfo as any
extendedToast.default = toastDefault as any

export { Toaster, extendedToast as toast }
