import { VariantProps } from "class-variance-authority"
import { spinnerVariants } from "./spinner.component"

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof spinnerVariants> {}

export type SpinnerSize = "xs" | "sm" | "default" | "lg" | "xl"
export type SpinnerVariant = "default"