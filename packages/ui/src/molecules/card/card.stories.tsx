import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card.component'
import { Button } from '../../atoms/button'
import { Badge } from '../../atoms/badge'

const meta: Meta<typeof Card> = {
  title: 'Molecules/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '관련 정보를 그룹화하여 표시하는 카드 컴포넌트입니다. 헤더, 본문, 푸터를 포함하며 다양한 호버 효과와 스타일을 지원합니다.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'ghost'],
    },
    hover: {
      control: 'select',
      options: ['none', 'lift', 'glow', 'scale'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'default', 'lg'],
    },
    clickable: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Set up your new project in minutes with our easy setup wizard.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
}

export const NotificationCard: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-4 rounded-md border p-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Push Notifications
            </p>
            <p className="text-sm text-muted-foreground">
              Send notifications to device.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 rounded-md border p-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Email Notifications
            </p>
            <p className="text-sm text-muted-foreground">
              Send notifications to email.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Mark all as read</Button>
      </CardFooter>
    </Card>
  ),
}

export const ProductCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Wireless Headphones</CardTitle>
          <Badge variant="secondary">New</Badge>
        </div>
        <CardDescription>Premium wireless audio experience</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">$99.99</span>
          <span className="text-sm text-muted-foreground line-through">$129.99</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          High-quality wireless headphones with noise cancellation and 30-hour battery life.
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1">Add to Cart</Button>
        <Button className="flex-1">Buy Now</Button>
      </CardFooter>
    </Card>
  ),
}

export const StatsCard: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+2350</div>
          <p className="text-xs text-muted-foreground">+180.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+12,234</div>
          <p className="text-xs text-muted-foreground">+19% from last month</p>
        </CardContent>
      </Card>
    </div>
  ),
}

export const CardVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
      <Card variant="default" className="w-full">
        <CardHeader>
          <CardTitle>Default Card</CardTitle>
          <CardDescription>Standard card with subtle shadow</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the default card variant with standard styling.</p>
        </CardContent>
      </Card>

      <Card variant="elevated" className="w-full">
        <CardHeader>
          <CardTitle>Elevated Card</CardTitle>
          <CardDescription>Card with enhanced shadow and hover effect</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card has more pronounced shadows and elevation.</p>
        </CardContent>
      </Card>

      <Card variant="outlined" className="w-full">
        <CardHeader>
          <CardTitle>Outlined Card</CardTitle>
          <CardDescription>Card with border emphasis, no shadow</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card uses border styling without shadows.</p>
        </CardContent>
      </Card>

      <Card variant="ghost" className="w-full">
        <CardHeader>
          <CardTitle>Ghost Card</CardTitle>
          <CardDescription>Minimal card with no border or shadow</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card has minimal visual styling for subtle presentation.</p>
        </CardContent>
      </Card>
    </div>
  ),
}

export const HoverEffects: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
      <Card hover="lift" clickable className="w-full">
        <CardHeader>
          <CardTitle>Lift Hover</CardTitle>
          <CardDescription>Card lifts up on hover</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Hover to see the lift effect.</p>
        </CardContent>
      </Card>

      <Card hover="glow" clickable className="w-full">
        <CardHeader>
          <CardTitle>Glow Hover</CardTitle>
          <CardDescription>Card glows with ring on hover</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Hover to see the glow effect.</p>
        </CardContent>
      </Card>

      <Card hover="scale" clickable className="w-full">
        <CardHeader>
          <CardTitle>Scale Hover</CardTitle>
          <CardDescription>Card scales up on hover</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Hover to see the scale effect.</p>
        </CardContent>
      </Card>

      <Card disabled className="w-full">
        <CardHeader>
          <CardTitle>Disabled Card</CardTitle>
          <CardDescription>Card in disabled state</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card is disabled and shows reduced opacity.</p>
        </CardContent>
      </Card>
    </div>
  ),
}

export const AllComponents: Story = {
  render: () => (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>All Card Components</CardTitle>
        <CardDescription>
          This card demonstrates all available card components working together.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Features:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Responsive design</li>
            <li>• Flexible content areas</li>
            <li>• Customizable styling</li>
          </ul>
        </div>
        <div className="flex gap-2">
          <Badge>Feature</Badge>
          <Badge variant="outline">Available</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost">Learn More</Button>
        <Button>Get Started</Button>
      </CardFooter>
    </Card>
  ),
}