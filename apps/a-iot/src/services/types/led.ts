/** View models backed by /displays and /display-presets. */
export interface LedPanel {
  id: number
  name: string
  siteId: number | null
  siteName: string
  location: string | null
  deviceCode: string
  status: LedPanelStatus
}

export type LedPanelStatus = 'NORMAL' | 'OFFLINE' | 'UNKNOWN'

export interface LedPreset {
  id: number
  title: string
  content: string
  createdAt: string
  createdBy: string
  updatedAt?: string
}

export interface LedPresetCreateRequest { title: string; content: string }
export type LedPresetUpdateRequest = LedPresetCreateRequest

export interface LedDispatchRequest {
  panelIds: number[]
  content: string
  presetId: number | null
}

/** The server accepts a request with 204; per-device outcomes come from history. */
export interface LedBroadcast {
  id: number
  message: string
  displayId: number
  displayName: string
  siteId: number | null
  siteName: string | null
  userId: string
  userName: string
  broadcastAt: string
  success: boolean
  failureReason: string | null
}

export interface LedPage<T> {
  content: T[]
  pageNumber: number
  pageSize: number
  totalElements: number
  first: boolean
  last: boolean
}

export const LED_CONTENT_MAX_LENGTH = 1000
export const LED_TITLE_MAX_LENGTH = 50
