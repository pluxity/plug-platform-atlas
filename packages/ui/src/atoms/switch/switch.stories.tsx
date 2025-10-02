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
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
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
        <Switch id="marketing" />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="security">Security Alerts</Label>
          <p className="text-sm text-muted-foreground">
            Get notified about security issues
          </p>
        </div>
        <Switch id="security" checked />
      </div>
    </div>
  ),
}