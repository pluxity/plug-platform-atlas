import * as React from "react"
import { VariantProps } from "class-variance-authority"
import { toggleVariants } from "./toggle.component"

export interface ToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof toggleVariants> {
  pressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}