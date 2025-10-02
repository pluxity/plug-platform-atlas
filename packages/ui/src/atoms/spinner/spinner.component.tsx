import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const spinnerVariants = cva(
  "animate-spin",
  {
    variants: {
      size: {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        default: "h-5 w-5",
        lg: "h-6 w-6",
        xl: "h-8 w-8"
      },
      variant: {
        default: "text-current"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default"
    }
  }
)

function Spinner({
  className,
  size,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof spinnerVariants>) {
  return (
    <div
      data-slot="spinner"
      className={cn(spinnerVariants({ size, variant, className }))}
      {...props}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6v-4z"
        />
      </svg>
    </div>
  )
}

export { Spinner, spinnerVariants }
