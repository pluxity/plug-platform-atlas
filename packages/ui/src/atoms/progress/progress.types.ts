import { VariantProps } from "class-variance-authority"
import { progressVariants } from "./progress.component"

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof progressVariants> {
  value?: number
  max?: number
}

export type ProgressSize = "sm" | "default" | "lg"