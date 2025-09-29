import { VariantProps } from "class-variance-authority"
import { cardVariants } from "./card.component"

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  clickable?: boolean
  disabled?: boolean
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardTitleProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export type CardVariant = "default" | "elevated" | "outlined" | "ghost"
export type CardHover = "none" | "lift" | "glow" | "scale"
export type CardPadding = "none" | "sm" | "default" | "lg"