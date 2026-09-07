/**
 * ⚠️ 목업 전용 파일 — 백엔드 연동 시 통째로 삭제한다.
 *
 * 삭제 절차는 두 줄이다:
 *   1. index.ts 의 USE_MOCK 을 false 로
 *   2. 이 파일과 index.ts 의 mock import 를 삭제
 * 나머지 코드(화면·훅·실 구현)는 이 파일을 직접 import 하지 않으므로
 * 손댈 곳이 없다.
 *
 * 백엔드가 아직 없어(aiot-api #24·#25·#26 OPEN, 하드웨어 업체 스펙 미수령)
 * 화면을 완성·검증하기 위해 둔 것이다.
 */
import type { ApiClient } from '@plug-atlas/api-hooks'
import type {
  LedActiveDisplay,
  LedDispatchRequest,
  LedDispatchResult,
  LedPanel,
  LedPreset,
  LedPresetCreateRequest,
  LedPresetUpdateRequest,
} from '../types/led'
import type { Site } from '../types/site'
import { DEFAULT_DISPLAY_OPTIONS } from '../types/led'
import type { LedApi } from './ledApi.types'

/** 공원당 설치되는 전광판 수 (가정) */
const PANELS_PER_SITE = 4

const PANEL_SPOTS = ['정문', '주차장', '산책로 입구', '광장', '후문', '전망대']

/**
 * 공원 API 를 못 불러왔을 때 쓰는 대체 공원.
 * 로그인 전이거나 사내망 밖에서도 화면이 혼자 뜨게 하려는 것이다.
 * id·이름은 실제 운영 데이터와 맞춰 뒀다.
 */
const FALLBACK_SITES: Pick<Site, 'id' | 'name'>[] = [
  { id: 1, name: '율동공원' },
  { id: 2, name: '중앙공원' },
  { id: 3, name: '위례공원' },
]

/** 마지막으로 만들어 낸 전광판 목록. 송출 시 오프라인 판정에 쓴다. */
let panelRegistry: LedPanel[] = []

function buildPanels(sites: Site[] | Pick<Site, 'id' | 'name'>[]): LedPanel[] {
  const source = sites.length > 0 ? sites : FALLBACK_SITES
  const panels: LedPanel[] = []

  source.forEach((site, siteIndex) => {
    for (let i = 0; i < PANELS_PER_SITE; i += 1) {
      const spot = PANEL_SPOTS[i % PANEL_SPOTS.length]!
      // 공원마다 1대는 오프라인으로 둬서 부분 실패 경로를 확인할 수 있게 한다
      const offline = i === PANELS_PER_SITE - 1
      panels.push({
        id: (siteIndex + 1) * 100 + i + 1,
        name: `${site.name} ${spot}`,
        siteId: site.id,
        siteName: site.name,
        location: spot,
        deviceCode: `SNLED-${String(site.id).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
        status: offline ? 'OFFLINE' : 'ONLINE',
      })
    }
  })

  return panels
}

let presets: LedPreset[] = [
  {
    id: 1,
    title: '폭염 주의',
    content: '폭염주의보 발령. 야외활동을 자제하고 충분한 수분을 섭취하세요.',
    displayOptions: { durationSeconds: 15, repeatCount: 5 },
    createdAt: '2026-08-20T09:12:00',
    createdBy: '관리자',
  },
  {
    id: 2,
    title: '공원 이용 안내',
    content: '공원 내 자전거 및 킥보드 주행을 금지합니다.',
    displayOptions: DEFAULT_DISPLAY_OPTIONS,
    createdAt: '2026-08-22T14:03:00',
    createdBy: '관리자',
  },
  {
    id: 3,
    title: '야간 개방 시간',
    content: '공원 야간 개방은 22시까지입니다. 안전에 유의하세요.',
    displayOptions: { durationSeconds: 10, repeatCount: 2 },
    createdAt: '2026-08-28T18:40:00',
    createdBy: '관리자',
  },
]

/** 현재 표출 중인 내용 (전광판 id → 표출 정보) */
const activeDisplays = new Map<number, LedActiveDisplay>()

let presetSeq = 100
let dispatchSeq = 1000

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))
const nowIso = () => new Date().toISOString().slice(0, 19)

export const mockLedApi: LedApi = {
  async fetchPanels(_client: ApiClient, sites: Site[]): Promise<LedPanel[]> {
    await delay()
    panelRegistry = buildPanels(sites)
    return panelRegistry
  },

  async fetchPresets(): Promise<LedPreset[]> {
    await delay()
    return [...presets]
  },

  async createPreset(_client: ApiClient, request: LedPresetCreateRequest): Promise<LedPreset> {
    await delay()
    presetSeq += 1
    const created: LedPreset = {
      id: presetSeq,
      title: request.title,
      content: request.content,
      displayOptions: request.displayOptions,
      createdAt: nowIso(),
      createdBy: '나',
    }
    presets = [created, ...presets]
    return created
  },

  async updatePreset(
    _client: ApiClient,
    id: number,
    request: LedPresetUpdateRequest,
  ): Promise<void> {
    await delay()
    presets = presets.map((preset) =>
      preset.id === id ? { ...preset, ...request, updatedAt: nowIso() } : preset,
    )
  },

  async deletePreset(_client: ApiClient, id: number): Promise<void> {
    await delay()
    presets = presets.filter((preset) => preset.id !== id)
  },

  async dispatch(_client: ApiClient, request: LedDispatchRequest): Promise<LedDispatchResult> {
    await delay(700)
    dispatchSeq += 1
    const dispatchedAt = nowIso()

    const results = request.panelIds.map((panelId) => {
      const panel = panelRegistry.find((p) => p.id === panelId)
      const offline = panel?.status === 'OFFLINE'

      if (!offline && panel) {
        activeDisplays.set(panelId, {
          panelId,
          panelName: panel.name,
          siteId: panel.siteId,
          content: request.content,
          source: 'MANUAL',
          dispatchedAt,
          dispatchedBy: '나',
        })
      }

      return {
        panelId,
        panelName: panel?.name ?? `#${panelId}`,
        success: !offline,
        ...(offline ? { message: '전광판이 오프라인 상태입니다.' } : {}),
      }
    })

    return { dispatchId: dispatchSeq, dispatchedAt, results }
  },

  async fetchActiveDisplays(): Promise<LedActiveDisplay[]> {
    await delay(200)
    return [...activeDisplays.values()]
  },

  async clearDisplays(_client: ApiClient, panelIds: number[]): Promise<LedDispatchResult> {
    await delay(400)
    dispatchSeq += 1

    const results = panelIds.map((panelId) => {
      const panel = panelRegistry.find((p) => p.id === panelId)
      activeDisplays.delete(panelId)
      return { panelId, panelName: panel?.name ?? `#${panelId}`, success: true }
    })

    return { dispatchId: dispatchSeq, dispatchedAt: nowIso(), results }
  },
}
