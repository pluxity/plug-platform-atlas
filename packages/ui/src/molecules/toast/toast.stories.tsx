import type { Meta, StoryObj } from '@storybook/react'
import { Toast, ToastAction, ToastClose, ToastTitle, ToastDescription, useToast, ToastContainer } from './toast.component'
import { Button } from '../../atoms/button'

const meta: Meta<typeof Toast> = {
  title: 'Molecules/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '일시적인 알림 메시지를 화면에 표시하는 토스트 컴포넌트입니다. 성공, 경고, 에러 등의 피드백을 사용자에게 전달합니다.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'success', 'warning'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Toast>
      <div className="grid gap-1">
        <ToastTitle>Scheduled: Catch up</ToastTitle>
        <ToastDescription>Friday, February 10, 2023 at 5:57 PM</ToastDescription>
      </div>
      <ToastClose />
    </Toast>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Toast variant="destructive">
      <div className="grid gap-1">
        <ToastTitle>Uh oh! Something went wrong.</ToastTitle>
        <ToastDescription>There was a problem with your request.</ToastDescription>
      </div>
      <ToastClose />
    </Toast>
  ),
}

export const Success: Story = {
  render: () => (
    <Toast variant="success">
      <div className="grid gap-1">
        <ToastTitle>Success!</ToastTitle>
        <ToastDescription>Your changes have been saved successfully.</ToastDescription>
      </div>
      <ToastClose />
    </Toast>
  ),
}

export const Warning: Story = {
  render: () => (
    <Toast variant="warning">
      <div className="grid gap-1">
        <ToastTitle>Warning</ToastTitle>
        <ToastDescription>Please review your changes before proceeding.</ToastDescription>
      </div>
      <ToastClose />
    </Toast>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Toast>
      <div className="grid gap-1">
        <ToastTitle>Scheduled: Catch up</ToastTitle>
        <ToastDescription>Friday, February 10, 2023 at 5:57 PM</ToastDescription>
      </div>
      <ToastAction altText="Undo">Undo</ToastAction>
      <ToastClose />
    </Toast>
  ),
}

export const SimpleToast: Story = {
  render: () => (
    <Toast>
      <ToastDescription>Your message has been sent.</ToastDescription>
      <ToastClose />
    </Toast>
  ),
}

// Demo component for interactive toast
const ToastDemo = () => {
  const { toasts, toast, dismiss } = useToast()

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() =>
            toast({
              title: "Scheduled: Catch up",
              description: "Friday, February 10, 2023 at 5:57 PM",
            })
          }
        >
          Show Toast
        </Button>

        <Button
          variant="destructive"
          onClick={() =>
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "There was a problem with your request.",
            })
          }
        >
          Show Error
        </Button>

        <Button
          onClick={() =>
            toast({
              variant: "success",
              title: "Success!",
              description: "Your changes have been saved.",
            })
          }
        >
          Show Success
        </Button>

        <Button
          onClick={() =>
            toast({
              variant: "warning",
              title: "Warning",
              description: "Please review before proceeding.",
            })
          }
        >
          Show Warning
        </Button>

        <Button
          onClick={() =>
            toast({
              title: "Scheduled: Catch up",
              description: "Friday, February 10, 2023 at 5:57 PM",
              action: <ToastAction altText="Undo">Undo</ToastAction>,
            })
          }
        >
          With Action
        </Button>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

export const Interactive: Story = {
  render: () => <ToastDemo />,
}