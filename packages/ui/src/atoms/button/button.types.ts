import { VariantProps } from "class-variance-authority"
import { buttonVariants } from "./button.component"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {}

export type ButtonVariant = "default" | "destructive" | "success" | "warning" | "outline" | "secondary" | "ghost" | "link"
export type ButtonSize = "default" | "sm" | "lg" | "icon"