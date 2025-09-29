import { Toaster as Sonner, toast } from "sonner"
import { cn } from "../../lib/utils"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:backdrop-blur-sm",
          description: "group-[.toast]:text-gray-600",
          actionButton:
            "group-[.toast]:bg-primary-600 group-[.toast]:text-white group-[.toast]:hover:bg-primary-700 group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-2 group-[.toast]:text-sm group-[.toast]:font-medium",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-600 group-[.toast]:hover:bg-gray-200 group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-2 group-[.toast]:text-sm group-[.toast]:font-medium",
        },
      }}
      {...props}
    />
  )
}

// 색상별 토스트 헬퍼 함수들
const createColoredToast = (variant: 'default' | 'success' | 'warning' | 'error' | 'info') => {
  const variantConfig = {
    default: {
      className: "bg-gradient-to-br from-white to-gray-50/50 border-gray-200 text-gray-900 shadow-lg",
      iconColor: "text-gray-600"
    },
    success: {
      className: "bg-gradient-to-br from-success-50 to-success-100/50 border-success-200 text-success-900 shadow-lg shadow-success-100/50",
      iconColor: "text-success-600"
    },
    warning: {
      className: "bg-gradient-to-br from-warning-50 to-warning-100/50 border-warning-200 text-warning-900 shadow-lg shadow-warning-100/50",
      iconColor: "text-warning-600"
    },
    error: {
      className: "bg-gradient-to-br from-error-50 to-error-100/50 border-error-200 text-error-900 shadow-lg shadow-error-100/50",
      iconColor: "text-error-600"
    },
    info: {
      className: "bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200 text-primary-900 shadow-lg shadow-primary-100/50",
      iconColor: "text-primary-600"
    }
  }

  return (message: string, options?: { description?: string; action?: { label: string; onClick: () => void } }) => {
    const config = variantConfig[variant]
    const icon = getIcon(variant, config.iconColor)

    return toast(message, {
      description: options?.description,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick
      } : undefined,
      className: cn(
        "rounded-xl border backdrop-blur-sm transition-all duration-300 ease-out-quad",
        config.className
      ),
      icon
    })
  }
}

// 아이콘 헬퍼 함수
const getIcon = (variant: string, colorClass: string) => {
  const iconClass = cn("w-5 h-5 flex-shrink-0", colorClass)

  switch (variant) {
    case 'success':
      return (
        <div className={cn("rounded-full p-1 bg-success-100", colorClass)}>
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )
    case 'warning':
      return (
        <div className={cn("rounded-full p-1 bg-warning-100", colorClass)}>
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      )
    case 'error':
      return (
        <div className={cn("rounded-full p-1 bg-error-100", colorClass)}>
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )
    case 'info':
      return (
        <div className={cn("rounded-full p-1 bg-primary-100", colorClass)}>
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )
    default:
      return (
        <div className={cn("rounded-full p-1 bg-gray-100", colorClass)}>
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )
  }
}

// 색상별 토스트 함수들
const toastSuccess = createColoredToast('success')
const toastWarning = createColoredToast('warning')
const toastError = createColoredToast('error')
const toastInfo = createColoredToast('info')
const toastDefault = createColoredToast('default')

// 통합된 toast 객체
type BaseToastFn = typeof toast
type ColoredToast = BaseToastFn & {
  success: ReturnType<typeof createColoredToast>
  warning: ReturnType<typeof createColoredToast>
  error: ReturnType<typeof createColoredToast>
  info: ReturnType<typeof createColoredToast>
  default: ReturnType<typeof createColoredToast>
}

const baseToastFn = ((message: any, opts?: any) => (toast as any)(message, opts)) as ColoredToast
;(baseToastFn as any).success = toastSuccess
;(baseToastFn as any).warning = toastWarning
;(baseToastFn as any).error = toastError
;(baseToastFn as any).info = toastInfo
;(baseToastFn as any).default = toastDefault
// Copy through additional methods from original toast (promise, dismiss, etc.)
Object.keys(toast).forEach(k => {
  if (!(k in baseToastFn)) {
    // @ts-ignore
    baseToastFn[k] = (toast as any)[k]
  }
})

export { Toaster, baseToastFn as toast }