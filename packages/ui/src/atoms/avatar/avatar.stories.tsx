import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarImage, AvatarFallback } from './avatar.component'

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '사용자 프로필 이미지를 표시하는 아바타 컴포넌트입니다. 이미지, 폴백, 온라인 상태 표시를 지원합니다.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl', '2xl'],
    },
    status: {
      control: 'select',
      options: ['none', 'online', 'offline', 'busy', 'away'],
    },
    src: {
      control: 'text',
    },
    alt: {
      control: 'text',
    },
    fallback: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    alt: '@shadcn',
    fallback: 'CN',
  },
}

export const WithFallback: Story = {
  args: {
    src: 'https://broken-image-url.jpg',
    alt: '@broken',
    fallback: 'JD',
  },
}

export const FallbackOnly: Story = {
  args: {
    fallback: 'AB',
    showFallback: true,
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="xs" src="https://github.com/shadcn.png" alt="@shadcn" fallback="XS" />
      <Avatar size="sm" src="https://github.com/shadcn.png" alt="@shadcn" fallback="SM" />
      <Avatar size="default" src="https://github.com/shadcn.png" alt="@shadcn" fallback="MD" />
      <Avatar size="lg" src="https://github.com/shadcn.png" alt="@shadcn" fallback="LG" />
      <Avatar size="xl" src="https://github.com/shadcn.png" alt="@shadcn" fallback="XL" />
      <Avatar size="2xl" src="https://github.com/shadcn.png" alt="@shadcn" fallback="2XL" />
    </div>
  ),
}

export const StatusIndicators: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-center space-y-2">
        <Avatar size="lg" src="https://github.com/shadcn.png" alt="@shadcn" status="online" />
        <p className="text-xs text-gray-600">Online</p>
      </div>
      <div className="text-center space-y-2">
        <Avatar size="lg" src="https://github.com/shadcn.png" alt="@shadcn" status="offline" />
        <p className="text-xs text-gray-600">Offline</p>
      </div>
      <div className="text-center space-y-2">
        <Avatar size="lg" src="https://github.com/shadcn.png" alt="@shadcn" status="busy" />
        <p className="text-xs text-gray-600">Busy</p>
      </div>
      <div className="text-center space-y-2">
        <Avatar size="lg" src="https://github.com/shadcn.png" alt="@shadcn" status="away" />
        <p className="text-xs text-gray-600">Away</p>
      </div>
    </div>
  ),
}

export const FallbackSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="xs" fallback="John Doe" showFallback />
      <Avatar size="sm" fallback="Jane Smith" showFallback />
      <Avatar size="default" fallback="Mike Johnson" showFallback />
      <Avatar size="lg" fallback="Sarah Wilson" showFallback />
      <Avatar size="xl" fallback="David Brown" showFallback />
      <Avatar size="2xl" fallback="Emily Davis" showFallback />
    </div>
  ),
}

export const StatusWithFallback: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-center space-y-2">
        <Avatar size="lg" fallback="John Doe" status="online" showFallback />
        <p className="text-xs text-gray-600">Online</p>
      </div>
      <div className="text-center space-y-2">
        <Avatar size="lg" fallback="Jane Smith" status="busy" showFallback />
        <p className="text-xs text-gray-600">Busy</p>
      </div>
      <div className="text-center space-y-2">
        <Avatar size="lg" fallback="Mike Johnson" status="away" showFallback />
        <p className="text-xs text-gray-600">Away</p>
      </div>
    </div>
  ),
}

export const LegacyComposition: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="lg">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://broken-image-url.jpg" alt="@broken" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    </div>
  ),
}