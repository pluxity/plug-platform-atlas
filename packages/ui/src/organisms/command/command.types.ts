import { Command as CommandPrimitive } from "cmdk"
import { type DialogProps } from "@radix-ui/react-dialog"

export interface CommandProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {}

export interface CommandDialogProps extends DialogProps {}

export interface CommandInputProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> {}

export interface CommandListProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.List> {}

export interface CommandEmptyProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty> {}

export interface CommandGroupProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group> {}

export interface CommandItemProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> {}

export interface CommandSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator> {}

export interface CommandShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {}