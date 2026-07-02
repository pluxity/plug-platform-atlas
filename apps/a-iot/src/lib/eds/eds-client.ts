import { EDS_CONFIG } from '@/constants/eds'
import type {
  EdsResponse,
  EdsLoginRequest,
  EdsLoginResult,
  EdsCameraListRequest,
  EdsCameraListResponse,
  EdsRealtimeStreamRequest,
  EdsRecordStreamRequest,
  EdsStreamResult,
  EdsWebsocketUrlResult,
} from './eds-types'

const BASE = EDS_CONFIG.baseUrl

async function edsRequest<T>(
  path: string,
  options: {
    method?: string
    apiKey?: string
    body?: unknown
    searchParams?: Record<string, string | number>
  } = {},
): Promise<T> {
  const { method = 'POST', apiKey, body, searchParams } = options

  let url = `${BASE}/${path}`
  if (searchParams) {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([k, v]) => params.set(k, String(v)))
    url += `?${params.toString()}`
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (apiKey) headers['api-key'] = apiKey

  const res = await fetch(url, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    throw new Error(`EDS API 오류: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

// ── 인증 ──

export async function edsLogin(): Promise<string> {
  const body: EdsLoginRequest = {
    system_key: EDS_CONFIG.systemKey,
    system_token: EDS_CONFIG.systemToken,
  }
  const res = await edsRequest<EdsResponse<EdsLoginResult>>(
    'api/eds/v1/external/users/login',
    { body },
  )
  const apiKey = res.result?.['api-key']
  if (!apiKey) throw new Error('EDS 로그인 실패: api-key 없음')
  return apiKey
}

export async function edsLogout(apiKey: string): Promise<void> {
  await edsRequest('api/eds/v1/external/users/logout', { apiKey })
}

export async function edsKeepalive(apiKey: string): Promise<void> {
  await edsRequest('api/eds/v1/external/users/keepalive', { apiKey })
}

// ── 카메라 ──

export async function edsCameraList(
  apiKey: string,
  params?: EdsCameraListRequest,
): Promise<EdsCameraListResponse> {
  return edsRequest<EdsCameraListResponse>(
    'api/eds/v1/external/camera/list',
    { apiKey, body: params ?? {} },
  )
}

// ── 영상 스트림 URL ──

export async function edsRealtimeStreamUrl(
  apiKey: string,
  request: EdsRealtimeStreamRequest,
): Promise<EdsStreamResult> {
  const res = await edsRequest<EdsResponse<EdsStreamResult>>(
    'api/eds/v1/external/camera/stream/realtime',
    { apiKey, body: request },
  )
  if (!res.result) throw new Error('스트림 URL 획득 실패')
  return res.result
}

export async function edsRecordStreamUrl(
  apiKey: string,
  request: EdsRecordStreamRequest,
): Promise<EdsStreamResult> {
  const res = await edsRequest<EdsResponse<EdsStreamResult>>(
    'api/eds/v1/external/camera/stream/record',
    { apiKey, body: request },
  )
  if (!res.result) throw new Error('녹화 스트림 URL 획득 실패')
  return res.result
}

// ── 웹소켓 URL (이벤트) ──

export async function edsWebsocketUrl(
  apiKey: string,
  externalFlag = EDS_CONFIG.externalFlag,
): Promise<string> {
  const res = await edsRequest<EdsResponse<EdsWebsocketUrlResult>>(
    'api/eds/v1/external/websocket/url',
    {
      method: 'GET',
      apiKey,
      searchParams: { external_flag: externalFlag },
    },
  )
  if (!res.result?.ws_url) throw new Error('웹소켓 URL 획득 실패')
  return res.result.ws_url
}
