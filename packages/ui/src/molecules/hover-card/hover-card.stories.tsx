import type { Meta, StoryObj } from '@storybook/react'
import { CalendarDays } from 'lucide-react'
import { Avatar } from '../../atoms/avatar'
import { Button } from '../../atoms/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card.component'

const meta: Meta<typeof HoverCard> = {
  title: 'Molecules/HoverCard',
  component: HoverCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '요소에 마우스를 올렸을 때 카드 형태로 추가 정보를 표시하는 컴포넌트입니다. 프로필 미리보기, 상세 정보 등에 사용됩니다.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@nextjs</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <span className="bg-primary text-primary-foreground">N</span>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}

export const SimpleHover: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer underline">Hover me</span>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Quick Info</h4>
          <p className="text-sm text-muted-foreground">
            This is additional information that appears on hover.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}

export const WithCustomContent: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="outline">Product Info</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-96">
        <div className="space-y-3">
          <div>
            <h4 className="text-lg font-semibold">Premium Plan</h4>
            <p className="text-sm text-muted-foreground">
              Everything you need to get started with your project.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Users</span>
              <span className="text-sm font-medium">Up to 10</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Storage</span>
              <span className="text-sm font-medium">100GB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Support</span>
              <span className="text-sm font-medium">Priority</span>
            </div>
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">$29/month</div>
            <p className="text-xs text-muted-foreground">Billed monthly</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}