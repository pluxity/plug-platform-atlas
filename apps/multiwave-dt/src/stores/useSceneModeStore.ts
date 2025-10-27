import { create } from 'zustand'

export type SceneMode = 'day' | 'night' | 'tactical'

interface SceneModeState {
  mode: SceneMode
  setMode: (mode: SceneMode) => void
}

export const useSceneModeStore = create<SceneModeState>((set) => ({
  mode: 'day', // 기본값: 주간 모드
  setMode: (mode) => set({ mode }),
}))
