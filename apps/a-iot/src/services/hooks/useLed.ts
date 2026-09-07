/**
 * LED 전광판 SWR 훅
 *
 * 실제 통신은 services/led/ledApi.ts 어댑터가 맡는다.
 * 백엔드가 나오면 어댑터의 LED_API_MOCK 만 끄면 되고 이 파일은 그대로 쓴다.
 */
import useSWR, { type SWRConfiguration } from 'swr'
import useSWRMutation from 'swr/mutation'
import { useApiClient } from '@plug-atlas/api-hooks'
import {
  createPreset,
  deletePreset,
  dispatchMessage,
  fetchPanels,
  fetchPresets,
  updatePreset,
} from '../led/ledApi'
import type {
  LedDispatchRequest,
  LedDispatchResult,
  LedPanel,
  LedPreset,
  LedPresetCreateRequest,
  LedPresetUpdateRequest,
} from '../types/led'
import { useSites } from './useSite'

const PANELS_KEY = 'led-panels'
const PRESETS_KEY = 'led-presets'

/**
 * 전광판 목록.
 *
 * 목업 단계에서는 실제 공원 목록 위에 전광판을 얹기 때문에 sites 를 먼저 받는다.
 * 실 API 로 전환하면 sites 의존은 무시되고 서버 응답을 그대로 쓴다.
 */
export function useLedPanels(options?: SWRConfiguration<LedPanel[], Error>) {
  const client = useApiClient()
  const { data: sites, isLoading: isSitesLoading, error: sitesError } = useSites()

  // 공원 조회가 끝나기를 기다리되, 실패해도 계속 진행한다.
  // 목업은 공원이 없으면 대체 공원으로 채우므로 백엔드 없이도 화면이 뜬다.
  const sitesSettled = sites !== undefined || !!sitesError

  const swr = useSWR<LedPanel[]>(
    sitesSettled ? PANELS_KEY : null,
    () => fetchPanels(client, sites ?? []),
    options,
  )

  return {
    ...swr,
    panels: swr.data ?? [],
    isLoading: swr.isLoading || (isSitesLoading && !sitesSettled),
  }
}

/** 메시지 프리셋 목록 */
export function useLedPresets(options?: SWRConfiguration<LedPreset[], Error>) {
  const client = useApiClient()

  const swr = useSWR<LedPreset[]>(PRESETS_KEY, () => fetchPresets(client), options)

  return {
    ...swr,
    presets: swr.data ?? [],
  }
}

export function useCreateLedPreset() {
  const client = useApiClient()

  return useSWRMutation(
    PRESETS_KEY,
    (_key: string, { arg }: { arg: LedPresetCreateRequest }) => createPreset(client, arg),
  )
}

export function useUpdateLedPreset() {
  const client = useApiClient()

  return useSWRMutation(
    PRESETS_KEY,
    (_key: string, { arg }: { arg: { id: number; data: LedPresetUpdateRequest } }) =>
      updatePreset(client, arg.id, arg.data),
  )
}

export function useDeleteLedPreset() {
  const client = useApiClient()

  return useSWRMutation(
    PRESETS_KEY,
    (_key: string, { arg }: { arg: number }) => deletePreset(client, arg),
  )
}

/**
 * 메시지 송출.
 *
 * 목업이 오프라인 장비를 실패로 돌려주므로 부분 실패 경로도 그대로 확인된다.
 */
export function useDispatchLedMessage() {
  const client = useApiClient()

  return useSWRMutation<
    LedDispatchResult,
    Error,
    string,
    { request: LedDispatchRequest; panels: LedPanel[] }
  >(
    'led-dispatch',
    (_key, { arg }) => dispatchMessage(client, arg.request, arg.panels),
  )
}
