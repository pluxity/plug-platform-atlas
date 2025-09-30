import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from './skeleton.component'

const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '콘텐츠 로딩 중 표시되는 플레이스홀더 컴포넌트입니다. 다양한 형태(원형, 사각형, 텍스트)를 지원하여 로딩 상태를 표현합니다.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'circular', 'rectangular', 'text'],
    },
    width: {
      control: 'text',
    },
    height: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    width: 200,
    height: 20,
  },
}

export const Circular: Story = {
  args: {
    variant: 'circular',
    width: 40,
    height: 40,
  },
}

export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    width: 300,
    height: 200,
  },
}

export const Text: Story = {
  args: {
    variant: 'text',
    width: 250,
  },
}

export const CardSkeleton: Story = {
  render: () => (
    <div className="flex items-center space-x-4 p-4 border rounded-lg w-96">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="space-y-2 flex-1">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="80%" />
      </div>
    </div>
  ),
}

export const ArticleSkeleton: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Skeleton variant="rectangular" width="100%" height={200} />
      <div className="space-y-2">
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="85%" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" width={100} />
      </div>
    </div>
  ),
}

export const ProfileSkeleton: Story = {
  render: () => (
    <div className="space-y-6 w-72">
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width={60} height={60} />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="50%" />
        </div>
      </div>

      <div className="space-y-3">
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="85%" />
        <Skeleton variant="text" width="92%" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Skeleton variant="rectangular" width="100%" height={80} />
        <Skeleton variant="rectangular" width="100%" height={80} />
      </div>
    </div>
  ),
}