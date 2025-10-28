import { create } from 'zustand'

export interface TrackingLogData {
  objectId?: string
  name?: string
  objectType?: 'person' | 'wildlife'
  camera?: string
  eventDescription?: string
  snapshot?: string
  error?: string
  code?: number
  reason?: string
}

export interface TrackingLogEntry {
  id: string
  timestamp: number
  type: 'connection' | 'tracking_update' | 'error' | 'info'
  message: string
  data?: TrackingLogData
}

interface TrackingLogState {
  logs: TrackingLogEntry[]
  maxLogs: number
  addLog: (entry: Omit<TrackingLogEntry, 'id' | 'timestamp'>) => void
  clearLogs: () => void
}

let logIdCounter = 0

export const useTrackingLogStore = create<TrackingLogState>((set) => ({
  logs: [],
  maxLogs: 100, // 최대 100개 로그 유지

  addLog: (entry) =>
    set((state) => {
      const newLog: TrackingLogEntry = {
        ...entry,
        id: `log-${++logIdCounter}`,
        timestamp: Date.now(),
      }

      const newLogs = [newLog, ...state.logs]

      // 최대 개수 초과 시 오래된 로그 제거
      if (newLogs.length > state.maxLogs) {
        newLogs.splice(state.maxLogs)
      }

      return { logs: newLogs }
    }),

  clearLogs: () => set({ logs: [] }),
}))
