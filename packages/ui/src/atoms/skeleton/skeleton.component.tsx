import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const skeletonVariants = cva(
  "animate-pulse rounded-md bg-gray-200",
  {
    variants: {
      variant: {
        default: "bg-gray-200",
        circular: "rounded-full bg-gray-200",
        rectangular: "rounded-md bg-gray-200",
        text: "rounded bg-gray-200 h-4",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number
  height?: string | number
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, width, height, style, ...props }, ref) => {
    const skeletonStyle = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      ...style
    }

    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant }), className)}
        style={skeletonStyle}
        {...props}
      />
    )
  }
)

Skeleton.displayName = "Skeleton"

export { Skeleton, skeletonVariants }