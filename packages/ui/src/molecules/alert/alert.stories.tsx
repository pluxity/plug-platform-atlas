import type { Meta, StoryObj } from '@storybook/react'
import { Alert, AlertDescription, AlertTitle } from './alert.component'

const meta: Meta<typeof Alert> = {
  title: 'Molecules/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '사용자에게 중요한 정보를 전달하는 알림 컴포넌트입니다. 성공, 경고, 에러 등의 상태를 시각적으로 표현하며 닫기 버튼을 추가할 수 있습니다.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'destructive'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[400px]">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
}

export const WithoutTitle: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <AlertDescription>
        A simple alert message without a title.
      </AlertDescription>
    </Alert>
  ),
}

export const Success: Story = {
  render: () => (
    <Alert variant="success" className="w-[400px]">
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        Your changes have been saved successfully.
      </AlertDescription>
    </Alert>
  ),
}

export const Warning: Story = {
  render: () => (
    <Alert variant="warning" className="w-[400px]">
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        Please review your input before proceeding.
      </AlertDescription>
    </Alert>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 w-[500px]">
      <Alert>
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>
          This is a default alert with normal styling.
        </AlertDescription>
      </Alert>

      <Alert variant="success">
        <AlertTitle>Success Alert</AlertTitle>
        <AlertDescription>
          Your operation completed successfully.
        </AlertDescription>
      </Alert>

      <Alert variant="warning">
        <AlertTitle>Warning Alert</AlertTitle>
        <AlertDescription>
          Please check your input before continuing.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertTitle>Error Alert</AlertTitle>
        <AlertDescription>
          Something went wrong. Please try again.
        </AlertDescription>
      </Alert>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => {
    const InfoIcon = () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
    const CheckIcon = () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )
    const ExclamationIcon = () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.08 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    )

    return (
      <div className="space-y-4 w-[500px]">
        <Alert className="w-[400px]">
          <InfoIcon />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            Here's some useful information with an icon.
          </AlertDescription>
        </Alert>

        <Alert variant="success" className="w-[400px]">
          <CheckIcon />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your operation completed successfully.
          </AlertDescription>
        </Alert>

        <Alert variant="warning" className="w-[400px]">
          <ExclamationIcon />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Please review your input before proceeding.
          </AlertDescription>
        </Alert>
      </div>
    )
  },
}