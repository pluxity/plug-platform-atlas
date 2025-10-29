import * as React from "react"
import { cn } from "../../lib/utils"
import { TwoColumnLayoutProps } from "./two-column-layout.types"

export const TwoColumnLayout = React.forwardRef<HTMLDivElement, TwoColumnLayoutProps>(
  (
    {
      leftWidth = "35%",
      rightWidth = "65%",
      gap = 16,
      leftScroll = true,
      rightScroll = true,
      minLeftWidth,
      minRightWidth,
      className,
      leftClassName,
      rightClassName,
      children,
    },
    ref
  ) => {
    if (!Array.isArray(children) || children.length !== 2) {
      throw new Error("TwoColumnLayout requires exactly 2 children")
    }

    const [leftChild, rightChild] = children

    const leftWidthStyle =
      typeof leftWidth === "number" ? `${leftWidth}px` : leftWidth
    const rightWidthStyle =
      typeof rightWidth === "number" ? `${rightWidth}px` : rightWidth

    return (
      <div
        ref={ref}
        className={cn("flex h-full w-full", className)}
        style={{ gap: `${gap}px` }}
      >
        <div
          className={cn(
            "flex-shrink-0",
            leftScroll && "overflow-y-auto",
            leftClassName
          )}
          style={{
            width: leftWidthStyle,
            minWidth: minLeftWidth ? `${minLeftWidth}px` : undefined,
          }}
        >
          {leftChild}
        </div>

        <div
          className={cn(
            "flex-1",
            rightScroll && "overflow-y-auto",
            rightClassName
          )}
          style={{
            width: rightWidthStyle,
            minWidth: minRightWidth ? `${minRightWidth}px` : undefined,
          }}
        >
          {rightChild}
        </div>
      </div>
    )
  }
)

TwoColumnLayout.displayName = "TwoColumnLayout"
