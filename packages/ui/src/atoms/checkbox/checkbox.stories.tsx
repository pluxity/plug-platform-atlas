import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './checkbox.component'
import { Label } from '../label'
import * as React from 'react'

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '선택/미선택 상태를 표현하는 체크박스 컴포넌트입니다. Label 컴포넌트와 함께 사용하여 폼을 구성할 수 있습니다.',
      },
    },
  },
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    checked: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
}

export const Checked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="checked" defaultChecked />
      <Label htmlFor="checked">Checked by default</Label>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="disabled" disabled />
      <Label htmlFor="disabled">Disabled checkbox</Label>
    </div>
  ),
}

export const DisabledChecked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="disabled-checked" disabled defaultChecked />
      <Label htmlFor="disabled-checked">Disabled and checked</Label>
    </div>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-start space-x-2">
        <Checkbox id="newsletter" className="mt-1" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="newsletter">Subscribe to newsletter</Label>
          <p className="text-sm text-muted-foreground">
            Get the latest updates and news delivered to your inbox
          </p>
        </div>
      </div>
    </div>
  ),
}

export const MultipleOptions: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="option1" />
        <Label htmlFor="option1">Email notifications</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option2" />
        <Label htmlFor="option2">SMS notifications</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option3" />
        <Label htmlFor="option3">Push notifications</Label>
      </div>
    </div>
  ),
}

export const FormExample: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false)

    return (
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms-form"
            checked={checked}
            onCheckedChange={(value) => setChecked(!!value)}
            className="mt-1"
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="terms-form">
              I agree to the terms and conditions
            </Label>
            <p className="text-sm text-muted-foreground">
              You must accept the terms and conditions to continue
            </p>
          </div>
        </div>
        <p className="text-sm">
          Status: <span className="font-medium">{checked ? 'Accepted' : 'Not accepted'}</span>
        </p>
      </div>
    )
  },
}