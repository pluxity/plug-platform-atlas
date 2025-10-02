import type { Meta, StoryObj } from '@storybook/react'
import { Label } from './label.component'
import { Input } from '../input'

const meta: Meta<typeof Label> = {
  title: 'Atoms/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '폼 요소와 연결되는 레이블 컴포넌트입니다. htmlFor 속성을 통해 입력 필드와 연결할 수 있습니다.',
      },
    },
  },
  argTypes: {
    htmlFor: {
      control: 'text',
      description: '연결할 input 요소의 id',
    },
    children: {
      control: 'text',
      description: '레이블 텍스트',
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
    <div className="grid gap-2 w-80">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Enter your email" />
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <div className="grid gap-2 w-80">
      <Label htmlFor="password">
        Password <span className="text-red-500">*</span>
      </Label>
      <Input type="password" id="password" placeholder="Enter your password" />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="grid gap-2 w-80">
      <Label htmlFor="disabled">Disabled Field</Label>
      <Input id="disabled" placeholder="This field is disabled" disabled />
    </div>
  ),
}

export const MultipleFields: Story = {
  render: () => (
    <div className="grid gap-6 w-96">
      <div className="grid gap-2">
        <Label htmlFor="name">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input type="text" id="name" placeholder="John Doe" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email-form">
          Email Address <span className="text-red-500">*</span>
        </Label>
        <Input type="email" id="email-form" placeholder="john@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input type="tel" id="phone" placeholder="+1 (555) 123-4567" />
      </div>
    </div>
  ),
}