import { VariantProps } from "class-variance-authority"
import { skeletonVariants } from "./skeleton.component"

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number
  height?: string | number
}

export type SkeletonVariant = "default" | "circular" | "rectangular" | "text"