import type { Meta, StoryObj } from '@storybook/react'
import { Label, SimpleLabel } from './label.component'
import { Input } from '../input'

const meta: Meta<typeof Label> = {
  title: 'Atoms/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['default', 'muted', 'success', 'warning', 'error'],
    },
    required: {
      control: 'boolean',
    },
    helperText: {
      control: 'text',
    },
    errorText: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    htmlFor: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Label',
  },
}

export const WithInput: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Enter your email" />
    </div>
  ),
}

export const WithRequiredField: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="password" required>
        Password
      </Label>
      <Input type="password" id="password" placeholder="Enter your password" />
    </div>
  ),
}

export const DisabledInput: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="disabled" className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Disabled Field
      </Label>
      <Input id="disabled" placeholder="This field is disabled" disabled />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <Label size="xs">Extra Small Label</Label>
      </div>
      <div>
        <Label size="sm">Small Label</Label>
      </div>
      <div>
        <Label size="default">Default Label</Label>
      </div>
      <div>
        <Label size="lg">Large Label</Label>
      </div>
      <div>
        <Label size="xl">Extra Large Label</Label>
      </div>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <Label variant="default">Default Label</Label>
      </div>
      <div>
        <Label variant="muted">Muted Label</Label>
      </div>
      <div>
        <Label variant="success">Success Label</Label>
      </div>
      <div>
        <Label variant="warning">Warning Label</Label>
      </div>
      <div>
        <Label variant="error">Error Label</Label>
      </div>
    </div>
  ),
}

export const WithHelperText: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <div>
        <Label htmlFor="username" helperText="Choose a unique username">Username</Label>
        <Input type="text" id="username" placeholder="Enter username" />
      </div>
      <div>
        <Label htmlFor="email-help" description="We'll never share your email" helperText="Enter a valid email address">Email</Label>
        <Input type="email" id="email-help" placeholder="Enter email" />
      </div>
      <div>
        <Label htmlFor="password-help" required description="Password must be at least 8 characters" helperText="Use a strong password">Password</Label>
        <Input type="password" id="password-help" placeholder="Enter password" />
      </div>
    </div>
  ),
}

export const WithErrors: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <div>
        <Label htmlFor="email-error" errorText="This email is already taken">Email</Label>
        <Input type="email" id="email-error" placeholder="Enter email" variant="error" />
      </div>
      <div>
        <Label htmlFor="password-error" required errorText="Password must be at least 8 characters">Password</Label>
        <Input type="password" id="password-error" placeholder="Enter password" variant="error" />
      </div>
    </div>
  ),
}

export const FormStates: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <div>
        <Label htmlFor="success-field" variant="success" helperText="Username is available!">Username</Label>
        <Input type="text" id="success-field" placeholder="john_doe" variant="success" />
      </div>
      <div>
        <Label htmlFor="warning-field" variant="warning" helperText="This username will expire soon">Temporary Username</Label>
        <Input type="text" id="warning-field" placeholder="temp_user_123" variant="warning" />
      </div>
      <div>
        <Label htmlFor="error-field" variant="error" errorText="Username contains invalid characters">Username</Label>
        <Input type="text" id="error-field" placeholder="user@123" variant="error" />
      </div>
    </div>
  ),
}

export const SimpleLabels: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <SimpleLabel>Simple Label</SimpleLabel>
      </div>
      <div>
        <SimpleLabel required>Required Simple Label</SimpleLabel>
      </div>
      <div>
        <SimpleLabel size="lg" variant="success">Large Success Label</SimpleLabel>
      </div>
    </div>
  ),
}

export const FormExample: Story = {
  render: () => (
    <div className="grid gap-6 w-96">
      <div>
        <Label htmlFor="name" required description="Enter your full legal name">Full Name</Label>
        <Input type="text" id="name" placeholder="John Doe" />
      </div>
      <div>
        <Label htmlFor="email" required description="We'll use this for account notifications" helperText="Make sure this email is accessible">Email Address</Label>
        <Input type="email" id="email" placeholder="john@example.com" />
      </div>
      <div>
        <Label htmlFor="phone" description="Optional - for account security" helperText="Include country code if outside US">Phone Number</Label>
        <Input type="tel" id="phone" placeholder="+1 (555) 123-4567" />
      </div>
    </div>
  ),
}