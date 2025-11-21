import { create } from 'zustand'
import type { TrackingObject } from '../types/tracking.types'

interface ObjectModalState {
  isOpen: boolean
  selectedObject: TrackingObject | null
  snapshotImage: string | null
  openModal: (object: TrackingObject, snapshot?: string) => void
  closeModal: () => void
}

export const useObjectModalStore = create<ObjectModalState>((set) => ({
  isOpen: false,
  selectedObject: null,
  snapshotImage: null,
  openModal: (object, snapshot) => set({ isOpen: true, selectedObject: object, snapshotImage: snapshot || null }),
  closeModal: () => set({ isOpen: false, selectedObject: null, snapshotImage: null }),
}))
