import ky, { type KyInstance, type Options } from 'ky'

export interface ApiClientConfig {
  baseUrl: string
  timeout?: number
  headers?: Record<string, string>
  onUnauthorized?: () => void
  onForbidden?: () => void
}

export class ApiClient {
  private client: KyInstance
  private config: ApiClientConfig
  // 동시에 401이 여러 개 떠도 refresh 요청은 1번만 수행 (single-flight)
  private refreshPromise: Promise<boolean> | null = null

  constructor(config: ApiClientConfig) {
    this.config = config

    this.client = ky.create({
      prefixUrl: config.baseUrl,
      timeout: config.timeout ?? 30000,
      credentials: 'include',
      headers: {
        ...config.headers,
      },
      hooks: {
        afterResponse: [
          async (request, _options, response) => {
            if (response.status === 403) {
              this.config.onForbidden?.()
              return response
            }
            if (response.status !== 401) return response

            const path = (() => {
              try { return new URL(request.url).pathname } catch { return request.url }
            })()
            const isAuthEndpoint =
              path.includes('/auth/sign-in') || path.includes('/auth/refresh-token')

            // 인증 엔드포인트 자체의 401 또는 이미 재시도한 요청 → 로그아웃
            if (isAuthEndpoint || request.headers.get('X-Auth-Retry')) {
              this.config.onUnauthorized?.()
              return response
            }

            // AccessToken 만료 추정 → RefreshToken 으로 갱신 시도
            const refreshed = await this.refreshAccessToken()
            if (!refreshed) {
              this.config.onUnauthorized?.()
              return response
            }

            // 갱신 성공 → 원 요청 1회 재시도
            try {
              const retryRequest = new Request(request, { headers: new Headers(request.headers) })
              retryRequest.headers.set('X-Auth-Retry', '1')
              return await this.client(retryRequest)
            } catch {
              this.config.onUnauthorized?.()
              return response
            }
          },
        ],
        beforeError: [
          async (error) => {
            const { response } = error
            try {
              const text = await response.text()
              try {
                const errorData = JSON.parse(text)
                if (errorData.message) {
                  error.message = `${response.status}: ${errorData.message}`
                }
              } catch (e) {
                console.error("Error parsing JSON:", e)
              }
            } catch (e) {
              console.error("Error reading response text:", e)
            }
            return error
          },
        ],
      },
    })
  }

  /**
   * RefreshToken 쿠키로 AccessToken 갱신 (204 성공).
   * 동시 요청이 여러 개여도 실제 refresh 호출은 1번만 나가도록 promise 를 공유한다.
   * ky 클라이언트가 아닌 raw fetch 를 써서 afterResponse 훅 재진입(무한루프)을 피한다.
   */
  private refreshAccessToken(): Promise<boolean> {
    if (!this.refreshPromise) {
      this.refreshPromise = fetch(`${this.config.baseUrl}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      })
        .then((res) => res.ok)
        .catch(() => false)
        .finally(() => { this.refreshPromise = null })
    }
    return this.refreshPromise
  }

  public async get<T>(url: string, options?: Options): Promise<T> {
    const response = await this.client.get(url, options)
    return response.json<T>()
  }

  public async post<T = void>(url: string, json?: unknown, options?: Options): Promise<T | void> {
    const requestOptions: Options = json instanceof FormData
        ? { ...options, body: json }
        : { ...options, json }

    const response = await this.client.post(url, requestOptions)

    if (response.status === 201) {
      const location = response.headers.get('location')
      if (location) {
        const match = location.match(/\/(\d+)$/)
        if (match && match[1]) {
          return parseInt(match[1], 10) as T
        }
      }
      return
    }

    if (response.status === 204) return

    const text = await response.text()
    if (!text || text.trim() === '') return

    return JSON.parse(text) as T
  }

  public async put<T = void>(url: string, json?: unknown, options?: Options): Promise<T | void> {
    const response = await this.client.put(url, { ...options, json })
    if (response.status === 204) return

    const text = await response.text()
    if (!text || text.trim() === '') return

    return JSON.parse(text) as T
  }

  public async patch<T = void>(url: string, json?: unknown, options?: Options): Promise<T | void> {
    const response = await this.client.patch(url, { ...options, json })
    if (response.status === 204) return

    const text = await response.text()
    if (!text || text.trim() === '') return

    return JSON.parse(text) as T
  }

  public async delete<T = void>(url: string, options?: Options): Promise<T | void> {
    const response = await this.client.delete(url, options)
    if (response.status === 204) return

    const text = await response.text()
    if (!text || text.trim() === '') return

    return JSON.parse(text) as T
  }

  public getInstance(): KyInstance {
    return this.client
  }
}
