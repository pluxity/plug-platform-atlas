/**
 * LED 전광판 API 어댑터
 *
 * 백엔드(aiot-api #24·#25·#26)가 미구현이라 지금은 목업으로 동작한다.
 * 실제 호출부는 아래에 이미 작성돼 있고, 백엔드가 나오면
 * LED_API_MOCK 을 false 로 바꾸는 것만으로 전환된다.
 * 스키마가 어긋나면 여기와 types/led.ts 두 파일만 고치면 되고
 * 화면 코드는 건드릴 필요가 없다.
 */
import type { ApiClient } from '@plug-atlas/api-hooks'
import type {
  LedDispatchRequest,
  LedDispatchResult,
  LedPanel,
  LedPreset,
  LedPresetCreateRequest,
  LedPresetUpdateRequest,
} from '../types/led'
import type { Site } from '../types/site'
import { DEFAULT_DISPLAY_OPTIONS } from '../types/led'

/** 백엔드 준비되면 false. 이 플래그 하나로 목업↔실 API 가 갈린다. */
export const LED_API_MOCK = true

/** 프론트가 제안하는 엔드포인트. 백엔드 확정 시 여기만 맞춘다. */
export const LED_ENDPOINTS = {
  panels: 'led/panels',
  presets: 'led/presets',
  dispatch: 'led/dispatch',
} as const

type DataResponse<T> = { data: T }

// ---------------------------------------------------------------------------
// 목업 데이터
// ---------------------------------------------------------------------------

/** 공원당 설치되는 전광판 수 (목업용 가정) */
const MOCK_PANELS_PER_SITE = 4

const MOCK_PANEL_SPOTS = ['정문', '주차장', '산책로 입구', '광장', '후문', '전망대']

/**
 * 공원 API 를 못 불러왔을 때 쓰는 대체 공원.
 * 목업 화면이 백엔드 없이도 혼자 뜨게 하려는 것이다.
 * (로그인 전이거나 사내망 밖에서 여는 경우)
 */
const MOCK_FALLBACK_SITES: Pick<Site, 'id' | 'name'>[] = [
  { id: 1, name: '중앙공원' },
  { id: 2, name: '율동공원' },
  { id: 3, name: '위례공원' },
]

/**
 * 실제 공원(Site) 목록 위에 전광판을 얹어 목업을 만든다.
 * 공원 이름·id 가 진짜라서 권한 게이팅이 실제와 같은 조건으로 검증된다.
 * 공원 목록이 비어 있으면 대체 공원으로 채운다.
 */
export function buildMockPanels(sites: Site[]): LedPanel[] {
  const panels: LedPanel[] = []
  const source = sites.length > 0 ? sites : MOCK_FALLBACK_SITES

  source.forEach((site, siteIndex) => {
    for (let i = 0; i < MOCK_PANELS_PER_SITE; i += 1) {
      const spot = MOCK_PANEL_SPOTS[i % MOCK_PANEL_SPOTS.length]!
      // 4대 중 1대는 오프라인으로 둬서 상태 표시와 실패 처리를 확인할 수 있게 한다
      const offline = i === MOCK_PANELS_PER_SITE - 1
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

/** 목업 프리셋 저장소 — 새로고침 전까지 세션 내에서만 유지된다 */
let mockPresets: LedPreset[] = [
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

let mockPresetSeq = 100
let mockDispatchSeq = 1000

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function nowIso() {
  return new Date().toISOString().slice(0, 19)
}

// ---------------------------------------------------------------------------
// 전광판
// ---------------------------------------------------------------------------

export async function fetchPanels(client: ApiClient, sites: Site[]): Promise<LedPanel[]> {
  if (LED_API_MOCK) {
    await delay()
    return buildMockPanels(sites)
  }

  const response = await client.get<DataResponse<LedPanel[]>>(LED_ENDPOINTS.panels)
  return response.data || []
}

// ---------------------------------------------------------------------------
// 프리셋
// ---------------------------------------------------------------------------

export async function fetchPresets(client: ApiClient): Promise<LedPreset[]> {
  if (LED_API_MOCK) {
    await delay()
    return [...mockPresets]
  }

  const response = await client.get<DataResponse<LedPreset[]>>(LED_ENDPOINTS.presets)
  return response.data || []
}

export async function createPreset(
  client: ApiClient,
  request: LedPresetCreateRequest,
): Promise<LedPreset> {
  if (LED_API_MOCK) {
    await delay()
    mockPresetSeq += 1
    const created: LedPreset = {
      id: mockPresetSeq,
      title: request.title,
      content: request.content,
      displayOptions: request.displayOptions,
      createdAt: nowIso(),
      createdBy: '나',
    }
    mockPresets = [created, ...mockPresets]
    return created
  }

  const response = await client.post<DataResponse<LedPreset>>(LED_ENDPOINTS.presets, request)
  // 서버가 201 + Location 만 주면 본문이 없다. 그 경우 목록 재조회로 채운다.
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data
  }
  const list = await fetchPresets(client)
  return list[0]!
}

export async function updatePreset(
  client: ApiClient,
  id: number,
  request: LedPresetUpdateRequest,
): Promise<void> {
  if (LED_API_MOCK) {
    await delay()
    mockPresets = mockPresets.map((preset) =>
      preset.id === id
        ? { ...preset, ...request, updatedAt: nowIso() }
        : preset,
    )
    return
  }

  await client.put(`${LED_ENDPOINTS.presets}/${id}`, request)
}

export async function deletePreset(client: ApiClient, id: number): Promise<void> {
  if (LED_API_MOCK) {
    await delay()
    mockPresets = mockPresets.filter((preset) => preset.id !== id)
    return
  }

  await client.delete(`${LED_ENDPOINTS.presets}/${id}`)
}

// ---------------------------------------------------------------------------
// 송출
// ---------------------------------------------------------------------------

export async function dispatchMessage(
  client: ApiClient,
  request: LedDispatchRequest,
  panels: LedPanel[],
): Promise<LedDispatchResult> {
  if (LED_API_MOCK) {
    await delay(700)
    mockDispatchSeq += 1

    // 오프라인 장비는 실패로 돌려서 부분 실패 UI 를 실제로 확인할 수 있게 한다
    const results = request.panelIds.map((panelId) => {
      const panel = panels.find((p) => p.id === panelId)
      const offline = panel?.status === 'OFFLINE'
      return {
        panelId,
        panelName: panel?.name ?? `#${panelId}`,
        success: !offline,
        ...(offline ? { message: '전광판이 오프라인 상태입니다.' } : {}),
      }
    })

    return {
      dispatchId: mockDispatchSeq,
      dispatchedAt: nowIso(),
      results,
    }
  }

  const response = await client.post<DataResponse<LedDispatchResult>>(
    LED_ENDPOINTS.dispatch,
    request,
  )
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data
  }
  throw new Error('송출 응답을 해석하지 못했습니다.')
}
