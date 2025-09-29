import { VariantProps } from "class-variance-authority"
import { tabsListVariants, tabsTriggerVariants } from "./tabs.component"

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export interface TabsListProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof tabsListVariants> {}

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof tabsTriggerVariants> {
  value: string
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export type TabsSize = "sm" | "default" | "lg"