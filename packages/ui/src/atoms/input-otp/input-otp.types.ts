import * as React from "react"

export interface InputOTPProps {
  containerClassName?: string
  className?: string
  maxLength?: number
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  disabled?: boolean
  autoFocus?: boolean
  pattern?: string
  render?: (props: { slots: any[]; isFocused: boolean }) => React.ReactNode
}

export interface InputOTPGroupProps extends React.ComponentPropsWithoutRef<"div"> {}

export interface InputOTPSlotProps extends React.ComponentPropsWithoutRef<"div"> {
  index: number
}

export interface InputOTPSeparatorProps extends React.ComponentPropsWithoutRef<"div"> {}