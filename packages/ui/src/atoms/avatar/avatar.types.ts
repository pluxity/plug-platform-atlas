import { VariantProps } from "class-variance-authority"
import { avatarVariants } from "./avatar.component"

export interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof avatarVariants> {}

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {}

export type AvatarSize = "xs" | "sm" | "default" | "lg" | "xl" | "2xl"