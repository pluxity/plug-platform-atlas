import type { Meta, StoryObj } from '@storybook/react'
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
    docs: {
      description: {
        component: '모달 형태의 대화상자 컴포넌트입니다. 사용자의 주의가 필요한 중요한 정보나 폼을 표시할 때 사용하며, 배경을 오버레이로 가립니다.',
      },
    },
  },
  argTypes: {
    showCloseButton: {
      control: 'boolean',
      description: 'Show the top-right close button'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { showCloseButton: true },
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
        <div className="grid gap-4 p-4">
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
export const Simple: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Simple Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Simple Dialog</DialogTitle>
          <DialogDescription>Minimal content example.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Form Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile Form</DialogTitle>
          <DialogDescription>
            Update profile information below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 p-4">
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

// Removed size variants (API simplified)

// Fullsize / drawer / states removed

// State variants
// Loading / error / success / warning states removed

// Removed ErrorState story

// Removed SuccessState story

// Removed WarningState story

// Variant types
// Removed Drawer variant story

// Behavior variants
// Removed NonDismissible story (behavior props removed)

// Header alignment variants
// Removed CenteredHeader story (alignment props removed)