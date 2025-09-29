import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const separatorVariants = cva(
  "shrink-0 transition-colors duration-200",
  {
    variants: {
      orientation: {
        horizontal: "h-px w-full",
        vertical: "h-full w-px"
      },
      variant: {
        default: "bg-gray-200",
        subtle: "bg-gray-100",
        bold: "bg-gray-300",
        primary: "bg-primary-200",
        success: "bg-success-200",
        warning: "bg-warning-200",
        error: "bg-error-200",
        gradient: "bg-gradient-to-r from-transparent via-gray-300 to-transparent",
        dashed: "border-t border-dashed border-gray-300 bg-transparent",
        dotted: "border-t border-dotted border-gray-400 bg-transparent"
      },
      size: {
        thin: "",
        default: "",
        thick: ""
      },
      spacing: {
        none: "",
        sm: "",
        default: "",
        lg: "",
        xl: ""
      }
    },
    compoundVariants: [
      // Horizontal sizing
      {
        orientation: "horizontal",
        size: "thin",
        className: "h-px"
      },
      {
        orientation: "horizontal",
        size: "default",
        className: "h-px"
      },
      {
        orientation: "horizontal",
        size: "thick",
        className: "h-0.5"
      },
      // Vertical sizing
      {
        orientation: "vertical",
        size: "thin",
        className: "w-px"
      },
      {
        orientation: "vertical",
        size: "default",
        className: "w-px"
      },
      {
        orientation: "vertical",
        size: "thick",
        className: "w-0.5"
      },
      // Horizontal spacing
      {
        orientation: "horizontal",
        spacing: "sm",
        className: "my-2"
      },
      {
        orientation: "horizontal",
        spacing: "default",
        className: "my-4"
      },
      {
        orientation: "horizontal",
        spacing: "lg",
        className: "my-6"
      },
      {
        orientation: "horizontal",
        spacing: "xl",
        className: "my-8"
      },
      // Vertical spacing
      {
        orientation: "vertical",
        spacing: "sm",
        className: "mx-2"
      },
      {
        orientation: "vertical",
        spacing: "default",
        className: "mx-4"
      },
      {
        orientation: "vertical",
        spacing: "lg",
        className: "mx-6"
      },
      {
        orientation: "vertical",
        spacing: "xl",
        className: "mx-8"
      },
      // Dashed and dotted variants override background
      {
        variant: "dashed",
        orientation: "horizontal",
        className: "border-t border-dashed bg-transparent h-0"
      },
      {
        variant: "dotted",
        orientation: "horizontal",
        className: "border-t border-dotted bg-transparent h-0"
      },
      {
        variant: "dashed",
        orientation: "vertical",
        className: "border-l border-dashed bg-transparent w-0"
      },
      {
        variant: "dotted",
        orientation: "vertical",
        className: "border-l border-dotted bg-transparent w-0"
      }
    ],
    defaultVariants: {
      orientation: "horizontal",
      variant: "default",
      size: "default",
      spacing: "none"
    }
  }
)

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof separatorVariants> {
  decorative?: boolean
  label?: string
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({
    className,
    orientation = "horizontal",
    variant,
    size,
    spacing,
    decorative = true,
    label,
    ...props
  }, ref) => {
    if (label) {
      return (
        <div className="relative flex items-center">
          <div className="flex-grow">
            <div
              ref={ref}
              role={decorative ? "none" : "separator"}
              aria-orientation={orientation || undefined}
              className={cn(separatorVariants({ orientation, variant, size, spacing }), className)}
              {...props}
            />
          </div>
          <span className="flex-shrink mx-4 text-sm text-gray-500 bg-white px-2">
            {label}
          </span>
          <div className="flex-grow">
            <div
              className={cn(separatorVariants({ orientation, variant, size, spacing }), className)}
            />
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        role={decorative ? "none" : "separator"}
        aria-orientation={orientation || undefined}
        className={cn(separatorVariants({ orientation, variant, size, spacing }), className)}
        {...props}
      />
    )
  }
)
Separator.displayName = "Separator"

const SeparatorWithText = React.forwardRef<
  HTMLDivElement,
  SeparatorProps & {
    text: string
    textClassName?: string
  }
>(({
  className,
  orientation = "horizontal",
  variant,
  size,
  spacing,
  decorative = true,
  text,
  textClassName,
  ...props
}, ref) => {
  if (orientation === "vertical") {
    return (
      <div className="relative flex flex-col items-center">
        <div className="flex-grow">
          <Separator
            ref={ref}
            orientation={orientation}
            variant={variant}
            size={size}
            spacing={spacing}
            decorative={decorative}
            className={className}
            {...props}
          />
        </div>
        <span className={cn("flex-shrink my-4 text-sm text-gray-500 bg-white py-2 rotate-90", textClassName)}>
          {text}
        </span>
        <div className="flex-grow">
          <Separator
            orientation={orientation}
            variant={variant}
            size={size}
            spacing={spacing}
            decorative={decorative}
            className={className}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex items-center">
      <div className="flex-grow">
        <Separator
          ref={ref}
          orientation={orientation}
          variant={variant}
          size={size}
          spacing={spacing}
          decorative={decorative}
          className={className}
          {...props}
        />
      </div>
      <span className={cn("flex-shrink mx-4 text-sm text-gray-500 bg-white px-2", textClassName)}>
        {text}
      </span>
      <div className="flex-grow">
        <Separator
          orientation={orientation}
          variant={variant}
          size={size}
          spacing={spacing}
          decorative={decorative}
          className={className}
        />
      </div>
    </div>
  )
})
SeparatorWithText.displayName = "SeparatorWithText"

export { Separator, SeparatorWithText, separatorVariants }