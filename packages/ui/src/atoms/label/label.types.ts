import * as LabelPrimitive from "@radix-ui/react-label"
import { VariantProps } from "class-variance-authority"
import { labelVariants } from "./label.component"

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
  VariantProps<typeof labelVariants> {}