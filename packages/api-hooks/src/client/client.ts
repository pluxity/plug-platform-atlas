import ky, { type KyInstance, type Options } from 'ky'

export interface ApiClientConfig {
  baseUrl: string
  timeout?: number
  headers?: Record<string, string>
  onUnauthorized?: () => void
}

export class ApiClient {
  private client: KyInstance
  private config: ApiClientConfig

  constructor(config: ApiClientConfig) {
    this.config = config

    this.client = ky.create({
      prefixUrl: config.baseUrl,
      timeout: config.timeout ?? 30000,
      credentials: 'include', // 쿠키 포함
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      hooks: {
        afterResponse: [
          async (_request, _options, response) => {
            // 401 에러 처리
            if (response.status === 401) {
              this.config.onUnauthorized?.()
            }
            return response
          },
        ],
      },
    })
  }

  public async get<T>(url: string, options?: Options): Promise<T> {
    const response = await this.client.get(url, options)
    return response.json<T>()
  }

  public async post<T = void>(url: string, json?: unknown, options?: Options): Promise<T | void> {
    const response = await this.client.post(url, { ...options, json })
    // 204 No Content는 body 없음
    if (response.status === 204) return
    return response.json<T>()
  }

  public async put<T = void>(url: string, json?: unknown, options?: Options): Promise<T | void> {
    const response = await this.client.put(url, { ...options, json })
    if (response.status === 204) return
    return response.json<T>()
  }

  public async patch<T = void>(url: string, json?: unknown, options?: Options): Promise<T | void> {
    const response = await this.client.patch(url, { ...options, json })
    if (response.status === 204) return
    return response.json<T>()
  }

  public async delete<T = void>(url: string, options?: Options): Promise<T | void> {
    const response = await this.client.delete(url, options)
    if (response.status === 204) return
    return response.json<T>()
  }

  public getInstance(): KyInstance {
    return this.client
  }
}