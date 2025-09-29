export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  status: number
  message?: string
}