import type { Meta, StoryObj } from '@storybook/react'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './tooltip.component'
import { Button } from '../../atoms/button'
import { Badge } from '../../atoms/badge'

const meta: Meta<typeof Tooltip> = {
  title: 'Molecules/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '요소에 마우스를 올렸을 때 추가 정보를 표시하는 툴팁 컴포넌트입니다. 짧은 설명이나 힌트를 제공하는 데 사용됩니다.',
      },
    },
  },
  argTypes: {
    delayDuration: {
      control: 'number',
    },
    hideDelay: {
      control: 'number',
    },
    disabled: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="p-20">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const Sides: Story = {
  render: () => (
    <div className="flex gap-4 items-center justify-center p-20">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Top</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Tooltip on top</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Right</Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Tooltip on right</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip on bottom</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Left</Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Tooltip on left</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="sm">
          ℹ️
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a helpful tooltip with information</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const LongContent: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover for long content</Button>
      </TooltipTrigger>
      <TooltipContent maxWidth={300}>
        <p>
          This is a longer tooltip content that demonstrates how the tooltip
          handles multiple lines of text and longer descriptions. The tooltip
          automatically wraps content and maintains readability.
        </p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-6 items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Default</Button>
        </TooltipTrigger>
        <TooltipContent variant="default">
          Default dark tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Light</Button>
        </TooltipTrigger>
        <TooltipContent variant="light">
          Light tooltip variant
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Primary</Button>
        </TooltipTrigger>
        <TooltipContent variant="primary">
          Primary color tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Success</Button>
        </TooltipTrigger>
        <TooltipContent variant="success">
          Success message tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Warning</Button>
        </TooltipTrigger>
        <TooltipContent variant="warning">
          Warning alert tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Error</Button>
        </TooltipTrigger>
        <TooltipContent variant="error">
          Error message tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Info</Button>
        </TooltipTrigger>
        <TooltipContent variant="info">
          Information tooltip
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex gap-6 items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">Small</Button>
        </TooltipTrigger>
        <TooltipContent size="sm">
          Small tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Default</Button>
        </TooltipTrigger>
        <TooltipContent size="default">
          Default size tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="lg">Large</Button>
        </TooltipTrigger>
        <TooltipContent size="lg">
          Large tooltip text
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const WithArrows: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">With Arrow</Button>
        </TooltipTrigger>
        <TooltipContent arrow={true}>
          Tooltip with arrow pointing
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">No Arrow</Button>
        </TooltipTrigger>
        <TooltipContent arrow={false}>
          Tooltip without arrow
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const CustomDelays: Story = {
  render: () => (
    <div className="flex gap-6 items-center">
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button variant="outline">Instant</Button>
        </TooltipTrigger>
        <TooltipContent>
          Shows immediately
        </TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={1000}>
        <TooltipTrigger asChild>
          <Button variant="outline">Slow</Button>
        </TooltipTrigger>
        <TooltipContent>
          Shows after 1 second
        </TooltipContent>
      </Tooltip>

      <Tooltip hideDelay={1000}>
        <TooltipTrigger asChild>
          <Button variant="outline">Sticky</Button>
        </TooltipTrigger>
        <TooltipContent>
          Stays for 1 second after mouse leave
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const DisabledState: Story = {
  render: () => (
    <div className="flex gap-6 items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Enabled</Button>
        </TooltipTrigger>
        <TooltipContent>
          This tooltip works normally
        </TooltipContent>
      </Tooltip>

      <Tooltip disabled>
        <TooltipTrigger asChild>
          <Button variant="outline">Disabled</Button>
        </TooltipTrigger>
        <TooltipContent>
          This tooltip won't show
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const ComplexContent: Story = {
  render: () => (
    <div className="flex gap-6 items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Rich Content</Button>
        </TooltipTrigger>
        <TooltipContent variant="light" maxWidth={250}>
          <div className="space-y-2">
            <div className="font-semibold">User Information</div>
            <div className="text-sm">
              <div>Name: John Doe</div>
              <div>Role: Developer</div>
              <div className="flex items-center gap-1 mt-1">
                Status: <Badge variant="success">Active</Badge>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Help Info</Button>
        </TooltipTrigger>
        <TooltipContent variant="info" maxWidth={200}>
          <div className="space-y-1">
            <div className="font-medium">Keyboard Shortcuts</div>
            <div className="text-xs space-y-1">
              <div>Ctrl+S - Save</div>
              <div>Ctrl+Z - Undo</div>
              <div>Ctrl+Y - Redo</div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const OnButtons: Story = {
  render: () => (
    <div className="flex gap-6 items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="destructive">Delete</Button>
        </TooltipTrigger>
        <TooltipContent variant="error">
          This action cannot be undone
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="default">Save</Button>
        </TooltipTrigger>
        <TooltipContent variant="success">
          Save your changes
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            ?
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Get help and support
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}