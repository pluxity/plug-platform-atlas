export function getDeviceMutationError(error: unknown, fallback: string): string {
  const response = typeof error === 'object' && error !== null && 'response' in error ? error.response : null
  const status = typeof response === 'object' && response !== null && 'status' in response ? response.status : undefined
  switch (status) {
    case 400: return '입력값을 확인한 뒤 다시 시도하세요.'
    case 401: return '로그인 상태를 확인한 뒤 다시 시도하세요.'
    case 403: return '이 작업을 수행할 권한이 없습니다.'
    case 404: return '장비를 찾을 수 없습니다. 목록을 새로고침하세요.'
    case 502: return '연동 업체에 연결하지 못했습니다. 잠시 후 다시 시도하세요.'
    default: return fallback
  }
}
