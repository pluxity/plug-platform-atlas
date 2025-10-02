import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs.component'
import { Badge } from '../../atoms/badge'

const meta: Meta<typeof Tabs> = {
  title: 'Molecules/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '여러 콘텐츠 패널을 탭으로 전환하여 표시하는 컴포넌트입니다. 수평/수직 방향, 다양한 스타일(underline, pills, buttons)을 지원합니다.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'underline', 'pills', 'buttons', 'card', 'minimal'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    animated: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Account</h3>
          <p className="text-sm text-muted-foreground">
            Make changes to your account here. Click save when you're done.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="password">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Password</h3>
          <p className="text-sm text-muted-foreground">
            Change your password here. After saving, you'll be logged out.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-8 w-[400px]">
      <div>
        <h4 className="text-sm font-medium mb-2">Small</h4>
        <Tabs defaultValue="tab1" size="sm">
          <TabsList>
            <TabsTrigger value="tab1">Tab One</TabsTrigger>
            <TabsTrigger value="tab2">Tab Two</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Small tab content 1</TabsContent>
          <TabsContent value="tab2">Small tab content 2</TabsContent>
        </Tabs>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Default</h4>
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab One</TabsTrigger>
            <TabsTrigger value="tab2">Tab Two</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Default tab content 1</TabsContent>
          <TabsContent value="tab2">Default tab content 2</TabsContent>
        </Tabs>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Large</h4>
        <Tabs defaultValue="tab1" size="lg">
          <TabsList>
            <TabsTrigger value="tab1">Tab One</TabsTrigger>
            <TabsTrigger value="tab2">Tab Two</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Large tab content 1</TabsContent>
          <TabsContent value="tab2">Large tab content 2</TabsContent>
        </Tabs>
      </div>
    </div>
  ),
}

export const MultipleTabs: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[600px]">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-2">
        <h3 className="text-lg font-medium">Overview</h3>
        <p className="text-sm text-muted-foreground">
          View a summary of your account activity and performance metrics.
        </p>
      </TabsContent>
      <TabsContent value="analytics" className="space-y-2">
        <h3 className="text-lg font-medium">Analytics</h3>
        <p className="text-sm text-muted-foreground">
          Detailed analytics and insights about your data and usage patterns.
        </p>
      </TabsContent>
      <TabsContent value="reports" className="space-y-2">
        <h3 className="text-lg font-medium">Reports</h3>
        <p className="text-sm text-muted-foreground">
          Generate and download comprehensive reports for your records.
        </p>
      </TabsContent>
      <TabsContent value="notifications" className="space-y-2">
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Manage your notification preferences and settings.
        </p>
      </TabsContent>
    </Tabs>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 w-[500px]">
      <div>
        <h4 className="text-sm font-medium mb-3">Default</h4>
        <Tabs defaultValue="tab1" variant="default">
          <TabsList>
            <TabsTrigger value="tab1">Tab One</TabsTrigger>
            <TabsTrigger value="tab2">Tab Two</TabsTrigger>
            <TabsTrigger value="tab3">Tab Three</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Default variant content</TabsContent>
          <TabsContent value="tab2">Tab Two content</TabsContent>
          <TabsContent value="tab3">Tab Three content</TabsContent>
        </Tabs>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Underline</h4>
        <Tabs defaultValue="tab1" variant="underline">
          <TabsList>
            <TabsTrigger value="tab1">Tab One</TabsTrigger>
            <TabsTrigger value="tab2">Tab Two</TabsTrigger>
            <TabsTrigger value="tab3">Tab Three</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Underline variant content</TabsContent>
          <TabsContent value="tab2">Tab Two content</TabsContent>
          <TabsContent value="tab3">Tab Three content</TabsContent>
        </Tabs>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Pills</h4>
        <Tabs defaultValue="tab1" variant="pills">
          <TabsList>
            <TabsTrigger value="tab1">Tab One</TabsTrigger>
            <TabsTrigger value="tab2">Tab Two</TabsTrigger>
            <TabsTrigger value="tab3">Tab Three</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Pills variant content</TabsContent>
          <TabsContent value="tab2">Tab Two content</TabsContent>
          <TabsContent value="tab3">Tab Three content</TabsContent>
        </Tabs>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Buttons</h4>
        <Tabs defaultValue="tab1" variant="buttons">
          <TabsList>
            <TabsTrigger value="tab1">Tab One</TabsTrigger>
            <TabsTrigger value="tab2">Tab Two</TabsTrigger>
            <TabsTrigger value="tab3">Tab Three</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Buttons variant content</TabsContent>
          <TabsContent value="tab2">Tab Two content</TabsContent>
          <TabsContent value="tab3">Tab Three content</TabsContent>
        </Tabs>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Card</h4>
        <Tabs defaultValue="tab1" variant="card">
          <TabsList>
            <TabsTrigger value="tab1">Tab One</TabsTrigger>
            <TabsTrigger value="tab2">Tab Two</TabsTrigger>
            <TabsTrigger value="tab3">Tab Three</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Card variant content</TabsContent>
          <TabsContent value="tab2">Tab Two content</TabsContent>
          <TabsContent value="tab3">Tab Three content</TabsContent>
        </Tabs>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Minimal</h4>
        <Tabs defaultValue="tab1" variant="minimal">
          <TabsList>
            <TabsTrigger value="tab1">Tab One</TabsTrigger>
            <TabsTrigger value="tab2">Tab Two</TabsTrigger>
            <TabsTrigger value="tab3">Tab Three</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Minimal variant content</TabsContent>
          <TabsContent value="tab2">Tab Two content</TabsContent>
          <TabsContent value="tab3">Tab Three content</TabsContent>
        </Tabs>
      </div>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => {
    const HomeIcon = () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
    const UserIcon = () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
    const CogIcon = () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )

    return (
      <Tabs defaultValue="home" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="home" icon={<HomeIcon />}>
            Home
          </TabsTrigger>
          <TabsTrigger value="profile" icon={<UserIcon />}>
            Profile
          </TabsTrigger>
          <TabsTrigger value="settings" icon={<CogIcon />}>
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="home">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Home</h3>
            <p className="text-sm text-muted-foreground">
              Welcome to your dashboard. Here you can see an overview of your activity.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="profile">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Profile</h3>
            <p className="text-sm text-muted-foreground">
              Manage your profile information and preferences.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure your application settings and preferences.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    )
  },
}

export const WithBadges: Story = {
  render: () => (
    <Tabs defaultValue="inbox" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="inbox" badge={<Badge variant="destructive">5</Badge>}>
          Inbox
        </TabsTrigger>
        <TabsTrigger value="sent" badge={<Badge variant="secondary">12</Badge>}>
          Sent
        </TabsTrigger>
        <TabsTrigger value="drafts" badge={<Badge variant="outline">3</Badge>}>
          Drafts
        </TabsTrigger>
      </TabsList>
      <TabsContent value="inbox">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Inbox (5 unread)</h3>
          <p className="text-sm text-muted-foreground">
            You have 5 unread messages in your inbox.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="sent">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Sent (12 total)</h3>
          <p className="text-sm text-muted-foreground">
            View your sent messages and delivery status.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="drafts">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Drafts (3 saved)</h3>
          <p className="text-sm text-muted-foreground">
            Continue working on your draft messages.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
}


export const VerticalOrientation: Story = {
  render: () => (
    <Tabs defaultValue="tab1" orientation="vertical" className="w-[500px]">
      <TabsList>
        <TabsTrigger value="tab1">Dashboard</TabsTrigger>
        <TabsTrigger value="tab2">Projects</TabsTrigger>
        <TabsTrigger value="tab3">Team</TabsTrigger>
        <TabsTrigger value="tab4">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className="flex-1">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            View your dashboard with overview statistics and recent activity.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="tab2" className="flex-1">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Projects</h3>
          <p className="text-sm text-muted-foreground">
            Manage your projects and track their progress.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="tab3" className="flex-1">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Team</h3>
          <p className="text-sm text-muted-foreground">
            Collaborate with your team members and manage permissions.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="tab4" className="flex-1">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure your application preferences and account settings.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
}

export const DisabledTabs: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">Active Tab</TabsTrigger>
        <TabsTrigger value="tab2" disabled>
          Disabled Tab
        </TabsTrigger>
        <TabsTrigger value="tab3">Another Active</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Active Tab</h3>
          <p className="text-sm text-muted-foreground">
            This tab is active and clickable.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="tab2">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Disabled Tab</h3>
          <p className="text-sm text-muted-foreground">
            This tab is disabled and cannot be accessed.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="tab3">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Another Active</h3>
          <p className="text-sm text-muted-foreground">
            This is another active tab that can be clicked.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
}