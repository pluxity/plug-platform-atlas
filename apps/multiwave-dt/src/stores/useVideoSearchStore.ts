import { create } from 'zustand'

export interface VideoSearchFilter {
  // 기본 검색 필터
  objectId?: string
  eventType?: 'all' | 'object-detection' | 'fence-proximity' | 'fence-breach'
  startDate?: Date
  endDate?: Date
  startTime?: string
  endTime?: string

  // 세부 속성 필터
  gender?: 'all' | 'male' | 'female'
  ageMin?: number
  ageMax?: number
  topType?: string
  topColor?: string
  bottomType?: string
  bottomColor?: string
  hasBag?: boolean | null
}

export interface VideoSearchResult {
  id: string
  objectId: string
  eventType: string
  timestamp: Date
  location: {
    lat: number
    lon: number
    alt?: number
  }
  snapshotUrl?: string
  videoUrl?: string
  metadata?: {
    gender?: string
    age?: number
    topType?: string
    topColor?: string
    bottomType?: string
    bottomColor?: string
    hasBag?: boolean
  }
}

interface VideoSearchState {
  isOpen: boolean
  filter: VideoSearchFilter
  results: VideoSearchResult[]
  selectedResult: VideoSearchResult | null
  isSearching: boolean

  // Actions
  openDialog: (initialObjectId?: string) => void
  closeDialog: () => void
  setFilter: (filter: Partial<VideoSearchFilter>) => void
  resetFilter: () => void
  search: () => Promise<void>
  selectResult: (result: VideoSearchResult | null) => void
}

// 샘플 데이터 (실제로는 API에서 가져옴)
const mockSearchResults: VideoSearchResult[] = [
  {
    id: '1',
    objectId: 'OBJ-001',
    eventType: 'object-detection',
    timestamp: new Date('2025-11-03T10:30:00'),
    location: { lat: 37.4449, lon: 127.1388 },
    snapshotUrl: 'https://via.placeholder.com/400x300?text=Snapshot+1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    metadata: {
      gender: 'male',
      age: 35,
      topType: 'jacket',
      topColor: 'black',
      bottomType: 'pants',
      bottomColor: 'blue',
      hasBag: true,
    },
  },
  {
    id: '2',
    objectId: 'OBJ-002',
    eventType: 'fence-proximity',
    timestamp: new Date('2025-11-03T11:15:00'),
    location: { lat: 37.4450, lon: 127.1390 },
    snapshotUrl: 'https://via.placeholder.com/400x300?text=Snapshot+2',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    metadata: {
      gender: 'female',
      age: 28,
      topType: 'shirt',
      topColor: 'white',
      bottomType: 'skirt',
      bottomColor: 'red',
      hasBag: false,
    },
  },
]

const defaultFilter: VideoSearchFilter = {
  eventType: 'all',
  gender: 'all',
  hasBag: null,
}

export const useVideoSearchStore = create<VideoSearchState>((set) => ({
  isOpen: false,
  filter: defaultFilter,
  results: [],
  selectedResult: null,
  isSearching: false,

  openDialog: (initialObjectId) => set({
    isOpen: true,
    filter: initialObjectId ? { ...defaultFilter, objectId: initialObjectId } : defaultFilter,
    results: [],
    selectedResult: null,
  }),

  closeDialog: () => set({
    isOpen: false,
    results: [],
    selectedResult: null,
  }),

  setFilter: (newFilter) => set((state) => ({
    filter: { ...state.filter, ...newFilter }
  })),

  resetFilter: () => set({ filter: defaultFilter }),

  search: async () => {
    set({ isSearching: true })

    // 실제로는 API 호출
    // const response = await fetch('/api/video-search', { ... })
    // const results = await response.json()

    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock filtering (실제로는 서버에서 처리)
    const filtered = mockSearchResults

    set({
      results: filtered,
      isSearching: false,
      selectedResult: filtered[0] || null,
    })
  },

  selectResult: (result) => set({ selectedResult: result }),
}))
