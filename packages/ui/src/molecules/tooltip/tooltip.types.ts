import { VariantProps } from "class-variance-authority"
import { tooltipVariants } from "./tooltip.component"

export interface TooltipProviderProps {
  children: React.ReactNode
  delayDuration?: number
}

export interface TooltipProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export interface TooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean
}

export interface TooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof tooltipVariants> {}

export type TooltipSide = "top" | "right" | "bottom" | "left"