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

  constructor(config: ApiClientConfig) {
    this.config = config

    this.client = ky.create({
      prefixUrl: config.baseUrl,
      timeout: config.timeout ?? 30000,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      hooks: {
        afterResponse: [
          async (_request, _options, response) => {
            if (response.status === 401) {
              this.config.onUnauthorized?.()
            }
            if (response.status === 403) {
              this.config.onForbidden?.()
            }
            return response
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

  public async get<T>(url: string, options?: Options): Promise<T> {
    const response = await this.client.get(url, options)
    return response.json<T>()
  }

  public async post<T = void>(url: string, json?: unknown, options?: Options): Promise<T | void> {
    const response = await this.client.post(url, { ...options, json })

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
