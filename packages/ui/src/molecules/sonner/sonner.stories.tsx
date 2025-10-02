import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../../atoms/button'
import { Toaster, toast } from './sonner.component'

const meta: Meta<typeof Toaster> = {
  title: 'Molecules/Sonner',
  component: Toaster,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Sonner 라이브러리 기반의 토스트 알림 컴포넌트입니다. 우아한 애니메이션과 스택 기능을 제공하여 여러 알림을 관리합니다.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div>
      <Toaster />
      <div className="space-x-2">
        <Button
          onClick={() =>
            toast("Event has been created", {
              description: "Sunday, December 03, 2023 at 9:00 AM",
              action: {
                label: "Undo",
                onClick: () => console.log("Undo"),
              },
            })
          }
        >
          Show Toast
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.success("Success message")}
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.error("Error message")}
        >
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info("Info message")}
        >
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning("Warning message")}
        >
          Warning
        </Button>
      </div>
    </div>
  ),
}

export const WithAction: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => toast("Undone!"),
            },
          })
        }
      >
        Show Toast with Action
      </Button>
    </div>
  ),
}

export const PromiseToast: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        onClick={() => {
          const promise = new Promise<{ name: string }>((resolve: (value: { name: string }) => void) => {
            setTimeout(() => resolve({ name: "John" }), 2000)
          })

          toast.promise(promise, {
            loading: "Loading...",
            success: (data: { name: string }) => {
              return `${data.name} has been added`
            },
            error: "Error",
          })
        }}
      >
        Show Promise Toast
      </Button>
    </div>
  ),
}

export const ColorVariants: Story = {
  render: () => (
    <div>
      <Toaster />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Button
          onClick={() => toast.default("기본 메시지입니다", {
            description: "일반적인 정보를 표시할 때 사용합니다"
          })}
          variant="outline"
        >
          Default Toast
        </Button>

        <Button
          onClick={() => toast.success("작업이 성공했습니다!", {
            description: "파일이 성공적으로 업로드되었습니다"
          })}
          variant="default"
        >
          Success Toast
        </Button>

        <Button
          onClick={() => toast.warning("주의가 필요합니다", {
            description: "이 작업은 되돌릴 수 없습니다"
          })}
          variant="secondary"
        >
          Warning Toast
        </Button>

        <Button
          onClick={() => toast.error("오류가 발생했습니다", {
            description: "네트워크 연결을 확인해주세요"
          })}
          variant="destructive"
        >
          Error Toast
        </Button>

        <Button
          onClick={() => toast.info("새로운 알림이 있습니다", {
            description: "3개의 새로운 메시지를 확인하세요"
          })}
          className="bg-primary-600 text-white hover:bg-primary-700"
        >
          Info Toast
        </Button>

        <Button
          onClick={() => toast.success("액션이 포함된 토스트", {
            description: "취소하려면 Undo를 클릭하세요",
            action: {
              label: "Undo",
              onClick: () => toast.info("작업이 취소되었습니다")
            }
          })}
          variant="outline"
          className="border-success-300 text-success-700 hover:bg-success-50"
        >
          With Action
        </Button>
      </div>
    </div>
  ),
}