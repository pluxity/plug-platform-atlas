import { create } from 'zustand'

interface EdsState {
  apiKey: string | null
  isAuthenticated: boolean
}

interface EdsActions {
  setApiKey: (key: string) => void
  clearSession: () => void
}

type EdsStore = EdsState & EdsActions

export const useEdsStore = create<EdsStore>()((set) => ({
  apiKey: null,
  isAuthenticated: false,

  setApiKey: (key) => set({ apiKey: key, isAuthenticated: true }),
  clearSession: () => set({ apiKey: null, isAuthenticated: false }),
}))
