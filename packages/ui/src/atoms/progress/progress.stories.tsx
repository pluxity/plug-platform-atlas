import type { Meta, StoryObj } from '@storybook/react'
import { Progress } from './progress.component'
import * as React from 'react'

const meta: Meta<typeof Progress> = {
  title: 'Atoms/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '작업 진행 상태를 시각화하는 프로그레스 바 컴포넌트입니다. 작업 완료율을 0-100 범위의 값으로 표시합니다.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: '진행률 (0-100)',
    },
    max: {
      control: { type: 'number' },
      description: '최대값',
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

export const Half: Story = {
  args: {
    value: 50,
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
      <div className="w-[300px]">
        <Progress value={progress} />
      </div>
    )
  },
}

export const WithLabel: Story = {
  render: () => {
    const [progress, setProgress] = React.useState(35)

    React.useEffect(() => {
      const timer = setTimeout(() => setProgress(75), 500)
      return () => clearTimeout(timer)
    }, [])

    return (
      <div className="w-[300px] space-y-2">
        <div className="flex justify-between text-sm">
          <span>Uploading...</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
    )
  },
}
