import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full border border-gray-200 transition-all duration-200",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-xs",
        default: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-sm",
        xl: "h-16 w-16 text-base",
        "2xl": "h-20 w-20 text-lg"
      },
      status: {
        none: "",
        online: "ring-2 ring-success-500 ring-offset-2 ring-offset-white",
        offline: "ring-2 ring-gray-400 ring-offset-2 ring-offset-white",
        busy: "ring-2 ring-error-500 ring-offset-2 ring-offset-white",
        away: "ring-2 ring-warning-500 ring-offset-2 ring-offset-white"
      }
    },
    defaultVariants: {
      size: "default",
      status: "none"
    }
  }
)

const statusIndicatorVariants = cva(
  "absolute rounded-full border-2 border-white bg-current",
  {
    variants: {
      size: {
        xs: "h-1.5 w-1.5 bottom-0 right-0",
        sm: "h-2 w-2 bottom-0 right-0",
        default: "h-2.5 w-2.5 bottom-0.5 right-0.5",
        lg: "h-3 w-3 bottom-0.5 right-0.5",
        xl: "h-4 w-4 bottom-1 right-1",
        "2xl": "h-5 w-5 bottom-1 right-1"
      },
      status: {
        none: "hidden",
        online: "text-success-500",
        offline: "text-gray-400",
        busy: "text-error-500",
        away: "text-warning-500"
      }
    },
    defaultVariants: {
      size: "default",
      status: "none"
    }
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: string
  showFallback?: boolean
}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, size, status, src, alt, fallback, showFallback, children, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false)
    const [imageLoaded, setImageLoaded] = React.useState(false)

    React.useEffect(() => {
      setImageError(false)
      setImageLoaded(false)
    }, [src])

    const handleImageError = () => {
      setImageError(true)
    }

    const handleImageLoad = () => {
      setImageLoaded(true)
    }

    const shouldShowFallback = !src || imageError || showFallback
    const initials = fallback || (alt ? alt.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?')

    return (
      <span
        ref={ref}
        className={cn(avatarVariants({ size, status, className }))}
        {...props}
      >
        {src && !imageError && (
          <img
            src={src}
            alt={alt || ''}
            className={cn(
              "aspect-square h-full w-full object-cover transition-opacity duration-200",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}
        {shouldShowFallback && (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 font-medium text-gray-700 transition-all duration-200",
              size === "xs" && "text-xs",
              size === "sm" && "text-xs",
              size === "default" && "text-sm",
              size === "lg" && "text-sm",
              size === "xl" && "text-base",
              size === "2xl" && "text-lg"
            )}
          >
            {initials}
          </div>
        )}
        {children}
        <div className={cn(statusIndicatorVariants({ size, status }))} />
      </span>
    )
  }
)
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <img
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
))
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: "xs" | "sm" | "default" | "lg" | "xl" | "2xl"
  }
>(({ className, size = "default", children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 font-medium text-gray-700",
      size === "xs" && "text-xs",
      size === "sm" && "text-xs",
      size === "default" && "text-sm",
      size === "lg" && "text-sm",
      size === "xl" && "text-base",
      size === "2xl" && "text-lg",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
AvatarFallback.displayName = "AvatarFallback"

const AvatarStatusIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: "xs" | "sm" | "default" | "lg" | "xl" | "2xl"
    status?: "none" | "online" | "offline" | "busy" | "away"
  }
>(({ className, size = "default", status = "none", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(statusIndicatorVariants({ size, status }), className)}
    {...props}
  />
))
AvatarStatusIndicator.displayName = "AvatarStatusIndicator"

export { Avatar, AvatarImage, AvatarFallback, AvatarStatusIndicator, avatarVariants, statusIndicatorVariants }