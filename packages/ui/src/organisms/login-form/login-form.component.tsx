import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../molecules/card'
import { Input } from '../../atoms/input'
import { Label } from '../../atoms/label'
import { Button } from '../../atoms/button'

export const LoginFormSchema = z.object({
  username: z.string().min(1, '사용자명을 입력해주세요').max(20),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다').max(20),
})

export type LoginFormData = z.infer<typeof LoginFormSchema>

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void | Promise<void>
  isLoading?: boolean
  error?: string | null
  title?: string
  description?: string
  submitButtonText?: string
}

export const LoginForm = React.forwardRef<HTMLFormElement, LoginFormProps>(
  (
    {
      onSubmit,
      isLoading = false,
      error = null,
      title = '로그인',
      description = '계정에 로그인하세요',
      submitButtonText = '로그인',
    },
    ref
  ) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<LoginFormData>({
      resolver: zodResolver(LoginFormSchema),
      defaultValues: {
        username: '',
        password: '',
      },
    })

    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={ref} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">사용자명</Label>
              <Input
                id="username"
                type="text"
                placeholder="사용자명을 입력하세요"
                disabled={isLoading}
                {...register('username')}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                disabled={isLoading}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '로그인 중...' : submitButtonText}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }
)

LoginForm.displayName = 'LoginForm'
