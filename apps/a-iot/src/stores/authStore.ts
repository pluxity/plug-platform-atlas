import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserResponse } from '@plug-atlas/types'

interface AuthState {
  user: UserResponse | null
  isAuthenticated: boolean
  token: string | null
}

interface AuthActions {
  setUser: (user: UserResponse) => void
  setToken: (token: string) => void
  login: (user: UserResponse, token: string) => void
  logout: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
