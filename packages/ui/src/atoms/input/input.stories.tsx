import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './input.component'

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time'],
    },
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
    helperText: {
      control: 'text',
    },
    errorText: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter email...',
  },
}

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
}

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter number...',
  },
}

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input...',
  },
}

export const WithValue: Story = {
  args: {
    defaultValue: 'Default value',
  },
}

export const WithHelperText: Story = {
  args: {
    placeholder: 'Enter your email',
    helperText: 'We will never share your email',
  },
}

export const WithError: Story = {
  args: {
    placeholder: 'Enter your email',
    errorText: 'Please enter a valid email address',
    defaultValue: 'invalid-email',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    placeholder: 'Enter your email',
    helperText: 'Email is available',
    defaultValue: 'user@example.com',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    placeholder: 'Enter password',
    helperText: 'Password should be at least 8 characters',
    type: 'password',
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <div>
        <label className="block text-sm font-medium mb-2">Default</label>
        <Input placeholder="Enter text..." helperText="This is a helper text" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Success</label>
        <Input variant="success" placeholder="Valid input" helperText="Great! This looks good" defaultValue="valid@example.com" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Warning</label>
        <Input variant="warning" placeholder="Warning input" helperText="Please double-check this" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Error</label>
        <Input placeholder="Error input" errorText="This field is required" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Disabled</label>
        <Input disabled placeholder="Disabled input" helperText="This field is disabled" />
      </div>
    </div>
  ),
}