import type { Meta, StoryObj } from '@storybook/react'
import { Toggle } from './toggle.component'
import { Bold, Italic, Underline, Eye, EyeOff } from 'lucide-react'
import * as React from 'react'

const meta: Meta<typeof Toggle> = {
  title: 'Atoms/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '눌림/눌림 해제 상태를 가진 토글 버튼 컴포넌트입니다. 텍스트 포맷팅, 즐겨찾기 등 ON/OFF 상태가 필요한 UI에 사용됩니다.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
    pressed: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<any>

export const Default: Story = {
  render: () => (
    <Toggle aria-label="Toggle bold">
      <Bold className="h-4 w-4" />
    </Toggle>
  ),
}

export const Outline: Story = {
  render: () => (
    <Toggle variant="outline" aria-label="Toggle italic">
      <Italic className="h-4 w-4" />
    </Toggle>
  ),
}

export const WithText: Story = {
  render: () => (
    <Toggle aria-label="Toggle bold">
      <Bold className="h-4 w-4 mr-2" />
      Bold
    </Toggle>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center space-y-2">
        <Toggle size="sm" aria-label="Toggle bold">
          <Bold className="h-3 w-3" />
        </Toggle>
        <p className="text-xs text-gray-600">SM</p>
      </div>
      <div className="text-center space-y-2">
        <Toggle size="default" aria-label="Toggle bold">
          <Bold className="h-4 w-4" />
        </Toggle>
        <p className="text-xs text-gray-600">Default</p>
      </div>
      <div className="text-center space-y-2">
        <Toggle size="lg" aria-label="Toggle bold">
          <Bold className="h-4 w-4" />
        </Toggle>
        <p className="text-xs text-gray-600">LG</p>
      </div>
    </div>
  ),
}

export const Pressed: Story = {
  render: () => (
    <Toggle pressed aria-label="Toggle bold">
      <Bold className="h-4 w-4" />
    </Toggle>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Toggle disabled aria-label="Toggle bold">
      <Bold className="h-4 w-4" />
    </Toggle>
  ),
}

export const TextEditor: Story = {
  render: () => (
    <div className="flex items-center gap-1 p-2 border rounded-md">
      <Toggle size="sm" aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" aria-label="Toggle italic">
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" aria-label="Toggle underline">
        <Underline className="h-4 w-4" />
      </Toggle>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center space-y-2">
        <Toggle variant="default" pressed aria-label="Toggle bold">
          <Bold className="h-4 w-4" />
        </Toggle>
        <p className="text-xs text-gray-600">Default</p>
      </div>
      <div className="text-center space-y-2">
        <Toggle variant="outline" pressed aria-label="Toggle bold">
          <Bold className="h-4 w-4" />
        </Toggle>
        <p className="text-xs text-gray-600">Outline</p>
      </div>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Toggle aria-label="Toggle bold">
        <Bold className="h-4 w-4 mr-2" />
        Bold
      </Toggle>
      <Toggle aria-label="Toggle italic">
        <Italic className="h-4 w-4 mr-2" />
        Italic
      </Toggle>
      <Toggle aria-label="Toggle underline">
        <Underline className="h-4 w-4 mr-2" />
        Underline
      </Toggle>
    </div>
  ),
}


export const InteractiveExample: Story = {
  render: () => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [notifications, setNotifications] = React.useState(true)
    const [darkMode, setDarkMode] = React.useState(false)

    return (
      <div className="space-y-4">
        <Toggle
          pressed={showPassword}
          onPressedChange={setShowPassword}
          variant="outline"
          aria-label="Toggle password visibility"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showPassword ? ' Hide' : ' Show'} Password
        </Toggle>

        <Toggle
          pressed={notifications}
          onPressedChange={setNotifications}
          aria-label="Toggle notifications"
        >
          {notifications ? 'Enabled' : 'Disabled'}
        </Toggle>

        <Toggle
          pressed={darkMode}
          onPressedChange={setDarkMode}
          aria-label="Toggle dark mode"
        >
          {darkMode ? 'Dark' : 'Light'}
        </Toggle>
      </div>
    )
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Default</h4>
        <div className="flex gap-2">
          <Toggle aria-label="Toggle bold">
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle pressed aria-label="Toggle italic">
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle disabled aria-label="Toggle underline">
            <Underline className="h-4 w-4" />
          </Toggle>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Outline</h4>
        <div className="flex gap-2">
          <Toggle variant="outline" aria-label="Toggle bold">
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle variant="outline" pressed aria-label="Toggle italic">
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle variant="outline" disabled aria-label="Toggle underline">
            <Underline className="h-4 w-4" />
          </Toggle>
        </div>
      </div>
    </div>
  ),
}