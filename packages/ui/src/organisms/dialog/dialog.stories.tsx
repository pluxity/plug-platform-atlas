import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog.component'
import { Button } from '../../atoms/button'
import { Input } from '../../atoms/input'
import { Label } from '../../atoms/label'

const meta: Meta<typeof DialogContent> = {
  title: 'Organisms/Dialog',
  component: DialogContent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl', '2xl', 'full'],
      description: 'Size variant of the dialog'
    },
    variant: {
      control: 'select',
      options: ['default', 'drawer', 'fullscreen'],
      description: 'Visual variant of the dialog'
    },
    state: {
      control: 'select',
      options: ['default', 'loading', 'error', 'success', 'warning'],
      description: 'State of the dialog'
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Whether to show the close button'
    },
    closeOnOutsideClick: {
      control: 'boolean',
      description: 'Whether dialog closes when clicking outside'
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Whether dialog closes on Escape key'
    },
    loading: {
      control: 'boolean',
      description: 'Whether dialog is in loading state'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: 'default',
    variant: 'default',
    state: 'default',
    showCloseButton: true,
    closeOnOutsideClick: true,
    closeOnEscape: true,
    loading: false
  },
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" defaultValue="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

// Size variants
export const Small: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Small Dialog</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle level={3}>Small Dialog</DialogTitle>
          <DialogDescription>This is a small dialog example.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Perfect for simple confirmations or small forms.
          </p>
        </div>
        <DialogFooter>
          <Button size="sm">OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const Large: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Large Dialog</Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Large Dialog</DialogTitle>
          <DialogDescription>
            This is a large dialog with more space for complex content.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Enter first name" />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Enter last name" />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter email address" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              className="w-full min-h-[100px] px-3 py-2 text-sm border border-input rounded-md"
              placeholder="Enter your message"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Send Message</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const ExtraLarge: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Extra Large Dialog</Button>
      </DialogTrigger>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>Extra Large Dialog</DialogTitle>
          <DialogDescription>
            Perfect for complex forms, data tables, or rich content.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i}>
                <Label htmlFor={`field-${i}`}>Field {i + 1}</Label>
                <Input id={`field-${i}`} placeholder={`Value ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save All</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const FullSize: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Full Size Dialog</Button>
      </DialogTrigger>
      <DialogContent size="full">
        <DialogHeader>
          <DialogTitle>Full Size Dialog</DialogTitle>
          <DialogDescription>
            Takes up most of the viewport space. Great for rich applications.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 py-6">
          <div className="h-[400px] border border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Your full-size content here</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

// State variants
export const LoadingState: Story = {
  render: () => {
    const [loading, setLoading] = useState(false)

    const handleSubmit = () => {
      setLoading(true)
      setTimeout(() => setLoading(false), 3000)
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Loading Dialog</Button>
        </DialogTrigger>
        <DialogContent loading={loading}>
          <DialogHeader>
            <DialogTitle>Submit Form</DialogTitle>
            <DialogDescription>
              Fill out the form below and submit to see the loading state.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" disabled={loading}>Cancel</Button>
            <Button onClick={handleSubmit} loading={loading}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
}

export const ErrorState: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Error Dialog</Button>
      </DialogTrigger>
      <DialogContent state="error">
        <DialogHeader>
          <DialogTitle>Error Occurred</DialogTitle>
          <DialogDescription variant="error">
            There was an error processing your request. Please try again.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <p className="text-sm text-error-700 font-medium">Error Details:</p>
            <p className="text-sm text-error-600 mt-1">
              Network timeout while connecting to server. Please check your connection and try again.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Retry</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const SuccessState: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Success Dialog</Button>
      </DialogTrigger>
      <DialogContent state="success">
        <DialogHeader>
          <DialogTitle>Success!</DialogTitle>
          <DialogDescription variant="success">
            Your changes have been saved successfully.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-success-50 border border-success-200 rounded-lg p-4">
            <p className="text-sm text-success-700 font-medium">✓ Profile updated</p>
            <p className="text-sm text-success-600 mt-1">
              Your profile information has been updated and will be visible immediately.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Close</Button>
          <Button variant="success">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const WarningState: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Warning Dialog</Button>
      </DialogTrigger>
      <DialogContent state="warning">
        <DialogHeader>
          <DialogTitle>Warning</DialogTitle>
          <DialogDescription variant="warning">
            This action may have unintended consequences. Please review carefully.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
            <p className="text-sm text-warning-700 font-medium">⚠ Important Notice:</p>
            <p className="text-sm text-warning-600 mt-1">
              Deleting this item will also remove all associated data. This action cannot be undone.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="warning">Proceed</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

// Variant types
export const Drawer: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DialogTrigger>
      <DialogContent variant="drawer" size="default">
        <DialogHeader>
          <DialogTitle>Drawer Dialog</DialogTitle>
          <DialogDescription>
            This dialog slides up from the bottom like a mobile drawer.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="option1">Option 1</Label>
            <Input id="option1" placeholder="Enter value" />
          </div>
          <div>
            <Label htmlFor="option2">Option 2</Label>
            <Input id="option2" placeholder="Enter value" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

// Behavior variants
export const NonDismissible: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Non-Dismissible Dialog</Button>
      </DialogTrigger>
      <DialogContent
        closeOnOutsideClick={false}
        closeOnEscape={false}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Important Action Required</DialogTitle>
          <DialogDescription>
            This dialog requires your attention and cannot be dismissed by clicking outside or pressing Escape.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            You must explicitly choose one of the options below to continue.
          </p>
        </div>
        <DialogFooter>
          <Button variant="destructive">Decline</Button>
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

// Header alignment variants
export const CenteredHeader: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Centered Header</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader align="center">
          <DialogTitle>Centered Title</DialogTitle>
          <DialogDescription>
            This dialog has a centered header layout.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-center">
          <p className="text-sm text-muted-foreground">
            Perfect for confirmations or announcements.
          </p>
        </div>
        <DialogFooter justify="center">
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}