import type { Meta, StoryObj } from '@storybook/react'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from './form.component'
import { Input } from '../../atoms/input'
import { Button } from '../../atoms/button'
import { Checkbox } from '../../atoms/checkbox'
import { useState } from 'react'

const meta: Meta<typeof Form> = {
  title: 'Organisms/Form',
  component: Form,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '폼 레이아웃과 필드 관리를 위한 컴포넌트입니다. FormField, FormLabel, FormControl, FormMessage 등을 조합하여 일관된 폼 UI를 구성할 수 있습니다.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Form>

export const Default: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      console.log('Form submitted:', formData)
      alert(JSON.stringify(formData, null, 2))
    }

    return (
      <Form onSubmit={handleSubmit} className="w-[400px] space-y-6">
        <FormField>
          <FormItem className="space-y-2">
            <FormLabel htmlFor="name">이름</FormLabel>
            <FormControl>
              <Input
                id="name"
                placeholder="홍길동"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </FormControl>
            <FormDescription className="text-sm text-muted-foreground">
              본명을 입력해주세요
            </FormDescription>
          </FormItem>
        </FormField>

        <FormField>
          <FormItem className="space-y-2">
            <FormLabel htmlFor="email">이메일</FormLabel>
            <FormControl>
              <Input
                id="email"
                type="email"
                placeholder="example@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </FormControl>
            <FormDescription className="text-sm text-muted-foreground">
              업무용 이메일 주소를 입력하세요
            </FormDescription>
          </FormItem>
        </FormField>

        <Button type="submit" className="w-full">
          제출
        </Button>
      </Form>
    )
  },
}

export const WithValidation: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      username: '',
      password: '',
    })
    const [errors, setErrors] = useState({
      username: '',
      password: '',
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()

      const newErrors = {
        username: '',
        password: '',
      }

      if (formData.username.length < 3) {
        newErrors.username = '사용자 이름은 최소 3자 이상이어야 합니다'
      }

      if (formData.password.length < 8) {
        newErrors.password = '비밀번호는 최소 8자 이상이어야 합니다'
      }

      setErrors(newErrors)

      if (!newErrors.username && !newErrors.password) {
        alert('폼 검증 성공!')
      }
    }

    return (
      <Form onSubmit={handleSubmit} className="w-[400px] space-y-6">
        <FormField>
          <FormItem className="space-y-2">
            <FormLabel htmlFor="username">사용자 이름</FormLabel>
            <FormControl>
              <Input
                id="username"
                placeholder="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                aria-invalid={!!errors.username}
                className={errors.username ? 'border-error-500' : ''}
              />
            </FormControl>
            {errors.username && (
              <FormMessage>
                {errors.username}
              </FormMessage>
            )}
          </FormItem>
        </FormField>

        <FormField>
          <FormItem className="space-y-2">
            <FormLabel htmlFor="password">비밀번호</FormLabel>
            <FormControl>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                aria-invalid={!!errors.password}
                className={errors.password ? 'border-error-500' : ''}
              />
            </FormControl>
            {errors.password && (
              <FormMessage>
                {errors.password}
              </FormMessage>
            )}
          </FormItem>
        </FormField>

        <Button type="submit" className="w-full">
          로그인
        </Button>
      </Form>
    )
  },
}

export const WithCheckbox: Story = {
  render: () => {
    const [agreed, setAgreed] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!agreed) {
        alert('약관에 동의해주세요')
        return
      }
      alert('가입이 완료되었습니다!')
    }

    return (
      <Form onSubmit={handleSubmit} className="w-[400px] space-y-6">
        <FormField>
          <FormItem className="space-y-2">
            <FormLabel htmlFor="email">이메일</FormLabel>
            <FormControl>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField>
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="cursor-pointer">
                이용약관 및 개인정보처리방침에 동의합니다
              </FormLabel>
              <FormDescription className="text-sm text-muted-foreground">
                서비스 이용을 위해 필수적으로 동의가 필요합니다
              </FormDescription>
            </div>
          </FormItem>
        </FormField>

        <Button type="submit" className="w-full" disabled={!agreed}>
          가입하기
        </Button>
      </Form>
    )
  },
}

export const LoginForm: Story = {
  render: () => {
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        alert('로그인 성공!')
      }, 2000)
    }

    return (
      <div className="w-[400px] space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">로그인</h2>
          <p className="text-sm text-muted-foreground">
            계정에 로그인하여 계속하세요
          </p>
        </div>

        <Form onSubmit={handleSubmit} className="space-y-4">
          <FormField>
            <FormItem className="space-y-2">
              <FormLabel htmlFor="email">이메일</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField>
            <FormItem className="space-y-2">
              <FormLabel htmlFor="password">비밀번호</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField>
            <FormItem className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <FormLabel htmlFor="remember" className="cursor-pointer font-normal">
                로그인 상태 유지
              </FormLabel>
            </FormItem>
          </FormField>

          <Button type="submit" className="w-full" loading={loading}>
            로그인
          </Button>
        </Form>

        <div className="text-center text-sm">
          <a href="#" className="text-primary-600 hover:underline">
            비밀번호를 잊으셨나요?
          </a>
        </div>
      </div>
    )
  },
}

export const SettingsForm: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      displayName: '홍길동',
      email: 'hong@example.com',
      bio: '',
      notifications: true,
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      alert('설정이 저장되었습니다!')
    }

    return (
      <div className="w-[500px] space-y-6">
        <div>
          <h2 className="text-2xl font-bold">설정</h2>
          <p className="text-sm text-muted-foreground mt-1">
            프로필 정보와 알림 설정을 관리하세요
          </p>
        </div>

        <Form onSubmit={handleSubmit} className="space-y-6">
          <FormField>
            <FormItem className="space-y-2">
              <FormLabel htmlFor="displayName">표시 이름</FormLabel>
              <FormControl>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                />
              </FormControl>
              <FormDescription className="text-sm text-muted-foreground">
                다른 사용자에게 표시되는 이름입니다
              </FormDescription>
            </FormItem>
          </FormField>

          <FormField>
            <FormItem className="space-y-2">
              <FormLabel htmlFor="email">이메일</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </FormControl>
              <FormDescription className="text-sm text-muted-foreground">
                알림을 받을 이메일 주소입니다
              </FormDescription>
            </FormItem>
          </FormField>

          <FormField>
            <FormItem className="space-y-2">
              <FormLabel htmlFor="bio">소개</FormLabel>
              <FormControl>
                <textarea
                  id="bio"
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="자기소개를 입력하세요..."
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                />
              </FormControl>
              <FormDescription className="text-sm text-muted-foreground">
                프로필에 표시될 간단한 소개입니다
              </FormDescription>
            </FormItem>
          </FormField>

          <FormField>
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>이메일 알림</FormLabel>
                <FormDescription className="text-sm text-muted-foreground">
                  중요한 업데이트를 이메일로 받습니다
                </FormDescription>
              </div>
              <FormControl>
                <Checkbox
                  checked={formData.notifications}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, notifications: checked as boolean })
                  }
                />
              </FormControl>
            </FormItem>
          </FormField>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1">
              취소
            </Button>
            <Button type="submit" className="flex-1">
              저장
            </Button>
          </div>
        </Form>
      </div>
    )
  },
}