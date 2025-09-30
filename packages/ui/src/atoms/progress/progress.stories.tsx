import type { Meta, StoryObj } from '@storybook/react'
import { Progress, ProgressCircular } from './progress.component'
import * as React from 'react'

const meta: Meta<typeof Progress> = {
  title: 'Atoms/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '작업 진행 상태를 시각화하는 프로그레스 바 컴포넌트입니다. 선형과 원형 두 가지 형태를 지원하며 애니메이션 효과가 있습니다.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    max: {
      control: { type: 'number' },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
    },
    animated: {
      control: 'boolean',
    },
    showLabel: {
      control: 'boolean',
    },
    striped: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 60,
  },
  render: (args) => (
    <div className="w-[300px]">
      <Progress {...args} />
    </div>
  ),
}

export const Empty: Story = {
  args: {
    value: 0,
  },
  render: (args) => (
    <div className="w-[300px]">
      <Progress {...args} />
    </div>
  ),
}

export const Full: Story = {
  args: {
    value: 100,
  },
  render: (args) => (
    <div className="w-[300px]">
      <Progress {...args} />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div>
        <p className="text-sm mb-2">Extra Small</p>
        <Progress value={45} size="xs" />
      </div>
      <div>
        <p className="text-sm mb-2">Small</p>
        <Progress value={55} size="sm" />
      </div>
      <div>
        <p className="text-sm mb-2">Default</p>
        <Progress value={65} size="default" />
      </div>
      <div>
        <p className="text-sm mb-2">Large</p>
        <Progress value={75} size="lg" />
      </div>
      <div>
        <p className="text-sm mb-2">Extra Large</p>
        <Progress value={85} size="xl" />
      </div>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div>
        <p className="text-sm mb-2">Default</p>
        <Progress value={65} variant="default" showLabel />
      </div>
      <div>
        <p className="text-sm mb-2">Success</p>
        <Progress value={80} variant="success" showLabel />
      </div>
      <div>
        <p className="text-sm mb-2">Warning</p>
        <Progress value={45} variant="warning" showLabel />
      </div>
      <div>
        <p className="text-sm mb-2">Error</p>
        <Progress value={25} variant="error" showLabel />
      </div>
    </div>
  ),
}

export const WithLabels: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <Progress value={25} showLabel />
      <Progress value={50} showLabel variant="success" />
      <Progress value={75} showLabel variant="warning" />
    </div>
  ),
}

export const Animated: Story = {
  render: () => {
    const [progress, setProgress] = React.useState(0)

    React.useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0
          return prev + 10
        })
      }, 500)

      return () => clearInterval(timer)
    }, [])

    return (
      <div className="w-[400px] space-y-4">
        <div>
          <p className="text-sm mb-2">Animated Progress</p>
          <Progress value={progress} animated showLabel />
        </div>
        <div>
          <p className="text-sm mb-2">Striped Progress</p>
          <Progress value={75} striped variant="success" showLabel />
        </div>
        <div>
          <p className="text-sm mb-2">Animated Striped Progress</p>
          <Progress value={60} animated striped variant="warning" showLabel />
        </div>
      </div>
    )
  },
}

export const CircularProgress: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="text-center space-y-2">
        <ProgressCircular value={25} variant="default" showLabel />
        <p className="text-xs text-gray-600">Default</p>
      </div>
      <div className="text-center space-y-2">
        <ProgressCircular value={50} variant="success" showLabel />
        <p className="text-xs text-gray-600">Success</p>
      </div>
      <div className="text-center space-y-2">
        <ProgressCircular value={75} variant="warning" showLabel />
        <p className="text-xs text-gray-600">Warning</p>
      </div>
      <div className="text-center space-y-2">
        <ProgressCircular value={90} variant="error" showLabel />
        <p className="text-xs text-gray-600">Error</p>
      </div>
    </div>
  ),
}

export const CircularSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="text-center space-y-2">
        <ProgressCircular value={65} size={80} strokeWidth={6} showLabel />
        <p className="text-xs text-gray-600">Small</p>
      </div>
      <div className="text-center space-y-2">
        <ProgressCircular value={65} size={120} strokeWidth={8} showLabel />
        <p className="text-xs text-gray-600">Default</p>
      </div>
      <div className="text-center space-y-2">
        <ProgressCircular value={65} size={160} strokeWidth={10} showLabel />
        <p className="text-xs text-gray-600">Large</p>
      </div>
    </div>
  ),
}

export const LoadingStates: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">File Upload</h3>
        <Progress value={35} variant="default" showLabel label="Uploading... 35%" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Installation</h3>
        <Progress value={80} variant="success" showLabel striped label="Installing packages... 80%" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Error State</h3>
        <Progress value={45} variant="error" showLabel label="Upload failed at 45%" />
      </div>
    </div>
  ),
}