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
    className: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Skeleton className="h-5 w-52" />,
}

export const Circular: Story = {
  render: () => <Skeleton className="h-10 w-10 rounded-full" />,
}

export const Rectangular: Story = {
  render: () => <Skeleton className="h-48 w-72" />,
}

export const Text: Story = {
  render: () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-4 w-60" />
    </div>
  ),
}

export const CardSkeleton: Story = {
  render: () => (
    <div className="flex items-center space-x-4 p-4 border rounded-lg w-96">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  ),
}

export const ArticleSkeleton: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Skeleton className="h-48 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-7/12" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  ),
}

export const ProfileSkeleton: Story = {
  render: () => (
    <div className="space-y-6 w-72">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-7/10" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>

      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-11/12" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  ),
}