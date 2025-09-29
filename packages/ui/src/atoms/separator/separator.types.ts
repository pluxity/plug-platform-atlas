import { VariantProps } from "class-variance-authority"
import { separatorVariants } from "./separator.component"

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof separatorVariants> {}

export type SeparatorOrientation = "horizontal" | "vertical"