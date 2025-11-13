import * as React from "react"
import { cn } from "../../lib/utils"
import { TwoColumnLayoutProps, ColumnProps } from "./two-column-layout.types"

const LeftColumn = React.forwardRef<HTMLDivElement, ColumnProps>(
  ({ scroll = true, className, style, children }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="left-column"
        className={cn(
          "flex-shrink-0 bg-white rounded-lg shadow-md border",
          scroll && "overflow-y-auto",
          className
        )}
        style={style}
      >
        {children}
      </div>
    )
  }
)
LeftColumn.displayName = "TwoColumnLayout.Left"

const RightColumn = React.forwardRef<HTMLDivElement, ColumnProps>(
  ({ scroll = true, className, style, children }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="right-column"
        className={cn(
          "flex-1 bg-white rounded-lg shadow-md border",
          scroll && "overflow-y-auto",
          className
        )}
        style={style}
      >
        {children}
      </div>
    )
  }
)
RightColumn.displayName = "TwoColumnLayout.Right"

const TwoColumnLayoutRoot = React.forwardRef<HTMLDivElement, TwoColumnLayoutProps>(
  (
    {
      leftWidth = "35%",
      rightWidth = "65%",
      gap = 16,
      minLeftWidth,
      minRightWidth,
      className,
      children,
    },
    ref
  ) => {
    const leftWidthStyle =
      typeof leftWidth === "number" ? `${leftWidth}px` : leftWidth
    const rightWidthStyle =
      typeof rightWidth === "number" ? `${rightWidth}px` : rightWidth

    const childrenArray = React.Children.toArray(children)
    const leftChild = childrenArray.find(
      (child): child is React.ReactElement<ColumnProps> =>
        React.isValidElement<ColumnProps>(child) &&
        (child.type === LeftColumn ||
          (typeof child.props === "object" &&
            child.props !== null &&
            "data-slot" in child.props &&
            child.props["data-slot"] === "left-column"))
    )
    const rightChild = childrenArray.find(
      (child): child is React.ReactElement<ColumnProps> =>
        React.isValidElement<ColumnProps>(child) &&
        (child.type === RightColumn ||
          (typeof child.props === "object" &&
            child.props !== null &&
            "data-slot" in child.props &&
            child.props["data-slot"] === "right-column"))
    )

    if (!leftChild || !rightChild) {
      throw new Error(
        "TwoColumnLayout requires both TwoColumnLayout.Left and TwoColumnLayout.Right as children"
      )
    }

    return (
      <div
        ref={ref}
        className={cn("flex h-full w-full", className)}
        style={{ gap: `${gap}px` }}
      >
        {React.cloneElement(leftChild, {
          style: {
            width: leftWidthStyle,
            minWidth: minLeftWidth ? `${minLeftWidth}px` : undefined,
            ...(leftChild.props.style as React.CSSProperties | undefined),
          },
        })}
        {React.cloneElement(rightChild, {
          style: {
            width: rightWidthStyle,
            minWidth: minRightWidth ? `${minRightWidth}px` : undefined,
            ...(rightChild.props.style as React.CSSProperties | undefined),
          },
        })}
      </div>
    )
  }
)
TwoColumnLayoutRoot.displayName = "TwoColumnLayout"

export const TwoColumnLayout = Object.assign(TwoColumnLayoutRoot, {
  Left: LeftColumn,
  Right: RightColumn,
})
