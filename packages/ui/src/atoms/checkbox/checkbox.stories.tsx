import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox, SimpleCheckbox } from './checkbox.component'
import { Label } from '../label'
import * as React from 'react'

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '선택/미선택 상태를 표현하는 체크박스 컴포넌트입니다. 다양한 크기와 상태(성공, 경고, 에러)를 지원합니다.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
    },
    disabled: {
      control: 'boolean',
    },
    checked: {
      control: 'boolean',
    },
    indeterminate: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
    description: {
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
  args: {},
}

export const WithLabel: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
}

export const Checked: Story = {
  args: {
    checked: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-center space-y-2">
        <SimpleCheckbox size="sm" checked />
        <p className="text-xs text-gray-600">Small</p>
      </div>
      <div className="text-center space-y-2">
        <SimpleCheckbox size="default" checked />
        <p className="text-xs text-gray-600">Default</p>
      </div>
      <div className="text-center space-y-2">
        <SimpleCheckbox size="lg" checked />
        <p className="text-xs text-gray-600">Large</p>
      </div>
      <div className="text-center space-y-2">
        <SimpleCheckbox size="xl" checked />
        <p className="text-xs text-gray-600">Extra Large</p>
      </div>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-center space-y-2">
        <SimpleCheckbox variant="default" checked />
        <p className="text-xs text-gray-600">Default</p>
      </div>
      <div className="text-center space-y-2">
        <SimpleCheckbox variant="success" checked />
        <p className="text-xs text-gray-600">Success</p>
      </div>
      <div className="text-center space-y-2">
        <SimpleCheckbox variant="warning" checked />
        <p className="text-xs text-gray-600">Warning</p>
      </div>
      <div className="text-center space-y-2">
        <SimpleCheckbox variant="error" checked />
        <p className="text-xs text-gray-600">Error</p>
      </div>
    </div>
  ),
}

export const IndeterminateState: Story = {
  render: () => {
    const [checkedItems, setCheckedItems] = React.useState([false, false, false])

    const allChecked = checkedItems.every(Boolean)
    const isIndeterminate = checkedItems.some(Boolean) && !allChecked

    return (
      <div className="space-y-4">
        <SimpleCheckbox
          checked={allChecked}
          indeterminate={isIndeterminate}
          onChange={(checked) =>
            setCheckedItems([!!checked, !!checked, !!checked])
          }
        />
        <Label className="ml-6 text-sm font-medium">Select All</Label>

        <div className="ml-6 space-y-2">
          {checkedItems.map((checked, index) => (
            <div key={index} className="flex items-center space-x-2">
              <SimpleCheckbox
                checked={checked}
                onChange={(newChecked) => {
                  const newItems = [...checkedItems]
                  newItems[index] = !!newChecked
                  setCheckedItems(newItems)
                }}
              />
              <Label className="text-sm">Option {index + 1}</Label>
            </div>
          ))}
        </div>
      </div>
    )
  },
}

export const WithLabelsAndDescriptions: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Checkbox
        label="Newsletter Subscription"
        description="Get the latest updates and news"
        helperText="You can unsubscribe at any time"
      />
      <Checkbox
        label="Marketing Communications"
        description="Receive promotional content"
        variant="success"
        checked
      />
      <Checkbox
        label="Required Agreement"
        description="You must accept to continue"
        errorText="This field is required"
      />
      <Checkbox
        label="Beta Features"
        description="Access experimental features"
        disabled
        helperText="Coming soon"
      />
    </div>
  ),
}

export const FormStates: Story = {
  render: () => (
    <div className="space-y-6 max-w-md">
      <div>
        <h3 className="text-sm font-medium mb-4">Account Preferences</h3>
        <div className="space-y-3">
          <Checkbox
            label="Email Notifications"
            description="Receive important account updates"
            variant="success"
            checked
            helperText="Currently enabled"
          />
          <Checkbox
            label="SMS Notifications"
            description="Get alerts via text message"
            variant="warning"
            helperText="Requires phone verification"
          />
          <Checkbox
            label="Terms of Service"
            description="I agree to the terms and conditions"
            variant="error"
            errorText="You must accept the terms to continue"
          />
        </div>
      </div>
    </div>
  ),
}

export const LegacyComposition: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <SimpleCheckbox id="newsletter" />
        <Label htmlFor="newsletter">Subscribe to newsletter</Label>
      </div>
      <div className="flex items-center space-x-2">
        <SimpleCheckbox id="marketing" />
        <Label htmlFor="marketing">Receive marketing emails</Label>
      </div>
      <div className="flex items-center space-x-2">
        <SimpleCheckbox id="updates" disabled />
        <Label htmlFor="updates">Product updates (coming soon)</Label>
      </div>
    </div>
  ),
}