import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from './switch.component'
import { Label } from '../label'

const meta: Meta<typeof Switch> = {
  title: 'Atoms/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '토글 형태의 스위치 컴포넌트입니다. 설정 활성화/비활성화, 옵션 전환 등에 사용되며 로딩 상태를 지원합니다.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'destructive'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    checked: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
    description: {
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
    label: 'Airplane Mode',
    description: 'Turn on airplane mode',
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
        <Switch size="sm" />
        <p className="text-xs text-gray-600">Small</p>
      </div>
      <div className="text-center space-y-2">
        <Switch size="default" />
        <p className="text-xs text-gray-600">Default</p>
      </div>
      <div className="text-center space-y-2">
        <Switch size="lg" />
        <p className="text-xs text-gray-600">Large</p>
      </div>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-center space-y-2">
        <Switch variant="default" checked />
        <p className="text-xs text-gray-600">Default</p>
      </div>
      <div className="text-center space-y-2">
        <Switch variant="success" checked />
        <p className="text-xs text-gray-600">Success</p>
      </div>
      <div className="text-center space-y-2">
        <Switch variant="warning" checked />
        <p className="text-xs text-gray-600">Warning</p>
      </div>
      <div className="text-center space-y-2">
        <Switch variant="destructive" checked />
        <p className="text-xs text-gray-600">Destructive</p>
      </div>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-center space-y-2">
        <Switch size="sm" loading checked />
        <p className="text-xs text-gray-600">Small Loading</p>
      </div>
      <div className="text-center space-y-2">
        <Switch size="default" loading checked />
        <p className="text-xs text-gray-600">Default Loading</p>
      </div>
      <div className="text-center space-y-2">
        <Switch size="lg" loading checked />
        <p className="text-xs text-gray-600">Large Loading</p>
      </div>
    </div>
  ),
}

export const WithLabelAndDescription: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch label="Push Notifications" description="Receive notifications on your device" />
      <Switch label="Marketing Emails" description="Receive emails about new features and updates" variant="success" />
      <Switch label="Security Alerts" description="Get notified about security issues" checked variant="warning" />
      <Switch label="Loading State" description="This switch is currently loading" loading variant="destructive" />
    </div>
  ),
}

export const SettingsExample: Story = {
  render: () => (
    <div className="space-y-6 max-w-md">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="notifications">Push Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive notifications on your device
          </p>
        </div>
        <Switch id="notifications" />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="marketing">Marketing Emails</Label>
          <p className="text-sm text-muted-foreground">
            Receive emails about new features and updates
          </p>
        </div>
        <Switch id="marketing" variant="success" />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="security">Security Alerts</Label>
          <p className="text-sm text-muted-foreground">
            Get notified about security issues
          </p>
        </div>
        <Switch id="security" checked variant="warning" />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="sync">Sync Settings</Label>
          <p className="text-sm text-muted-foreground">
            Synchronizing your settings...
          </p>
        </div>
        <Switch id="sync" loading variant="destructive" />
      </div>
    </div>
  ),
}