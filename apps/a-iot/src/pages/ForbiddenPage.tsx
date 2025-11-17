import { useNavigate } from 'react-router-dom'
import { Button } from '@plug-atlas/ui'

export default function ForbiddenPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">403</h1>
        <p className="mt-4 text-2xl font-semibold text-gray-700">접근 권한이 없습니다</p>
        <p className="mt-2 text-gray-500">
          이 페이지에 접근할 권한이 없습니다.
          <br />
          관리자에게 문의하시거나 이전 페이지로 돌아가주세요.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button onClick={() => navigate(-1)} variant="outline">
            이전 페이지
          </Button>
          <Button onClick={() => navigate('/login')} variant="outline">
            로그인
          </Button>
          <Button onClick={() => navigate('/')}>
            홈으로 이동
          </Button>
        </div>
      </div>
    </div>
  )
}
