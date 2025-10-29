import * as React from "react"

export interface TwoColumnLayoutProps {
  leftWidth?: string | number
  rightWidth?: string | number
  gap?: number
  leftScroll?: boolean
  rightScroll?: boolean
  minLeftWidth?: number
  minRightWidth?: number
  className?: string
  leftClassName?: string
  rightClassName?: string
  children: [React.ReactNode, React.ReactNode]
}
