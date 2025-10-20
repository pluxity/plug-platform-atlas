import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm, type LoginFormData } from '@plug-atlas/ui'
import { useSignIn, useApiClient } from '@plug-atlas/api-hooks'
import { useAuthStore } from '../stores/authStore'
import type { UserResponse } from '@plug-atlas/types'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { trigger: signIn } = useSignIn()
  const client = useApiClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      await signIn(data)

      const response = await client.get<{ data: UserResponse }>('users/me')
      const userData = response.data

      login(userData, 'session-cookie')

      navigate('/')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '로그인에 실패했습니다. 사용자명과 비밀번호를 확인해주세요.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
    </div>
  )
}
