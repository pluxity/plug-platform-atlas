import * as React from "react"

export interface TwoColumnLayoutProps {
  leftWidth?: string | number
  rightWidth?: string | number
  gap?: number
  minLeftWidth?: number
  minRightWidth?: number
  className?: string
  children: React.ReactNode
}

export interface ColumnProps {
  scroll?: boolean
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}
