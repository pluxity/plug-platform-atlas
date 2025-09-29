import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"

export interface ContextMenuProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Root> {}

export interface ContextMenuTriggerProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Trigger> {}

export interface ContextMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content> {}

export interface ContextMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> {
  inset?: boolean
}

export interface ContextMenuCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem> {}

export interface ContextMenuRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem> {}

export interface ContextMenuLabelProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> {
  inset?: boolean
}

export interface ContextMenuSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator> {}

export interface ContextMenuShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {}

export interface ContextMenuSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> {
  inset?: boolean
}

export interface ContextMenuSubContentProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent> {}