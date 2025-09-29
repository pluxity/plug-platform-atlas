import { VariantProps } from "class-variance-authority"
import { alertVariants } from "./alert.component"

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export type AlertVariant = "default" | "destructive" | "success" | "warning"