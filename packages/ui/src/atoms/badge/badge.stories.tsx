import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge.component'

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'success', 'warning', 'destructive', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
    dismissible: {
      control: 'boolean',
    },
    children: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Badge',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
}

export const WithDismiss: Story = {
  args: {
    dismissible: true,
    children: 'Dismissible',
    onDismiss: () => alert('Badge dismissed'),
  },
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge leftIcon={
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      }>
        Verified
      </Badge>

      <Badge variant="warning" rightIcon={
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      }>
        Warning
      </Badge>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="default">Default</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
}

export const WithNumbers: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="flex items-center gap-2">
        <span>Notifications</span>
        <Badge>12</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Messages</span>
        <Badge variant="secondary">3</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Errors</span>
        <Badge variant="destructive">2</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Pending</span>
        <Badge variant="outline">5</Badge>
      </div>
    </div>
  ),
}

export const StatusExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span>Status: </span>
        <Badge variant="default">Active</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Priority: </span>
        <Badge variant="destructive">High</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Type: </span>
        <Badge variant="secondary">Feature</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Environment: </span>
        <Badge variant="outline">Production</Badge>
      </div>
    </div>
  ),
}