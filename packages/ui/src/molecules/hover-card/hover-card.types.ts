import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

export interface HoverCardProps
  extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Root> {}

export interface HoverCardTriggerProps
  extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Trigger> {}

export interface HoverCardContentProps
  extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content> {}