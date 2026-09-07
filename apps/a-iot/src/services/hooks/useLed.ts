/**
 * LED 전광판 SWR 훅
 *
 * 통신은 services/led 의 ledApi 가 맡는다. 이 파일은 목업인지 실 API 인지 모른다.
 */
import useSWR, { type SWRConfiguration } from 'swr'
import useSWRMutation from 'swr/mutation'
import { useApiClient } from '@plug-atlas/api-hooks'
import { ledApi } from '../led'
import type {
  LedActiveDisplay,
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
const ACTIVE_KEY = 'led-active-displays'

/**
 * 전광판 목록.
 *
 * 공원 조회가 끝나기를 기다리되 실패해도 진행한다.
 * (목업이 공원 없이도 대체 공원으로 화면을 띄울 수 있게 하기 위함)
 */
export function useLedPanels(options?: SWRConfiguration<LedPanel[], Error>) {
  const client = useApiClient()
  const { data: sites, isLoading: isSitesLoading, error: sitesError } = useSites()

  const sitesSettled = sites !== undefined || !!sitesError

  const swr = useSWR<LedPanel[]>(
    sitesSettled ? PANELS_KEY : null,
    () => ledApi.fetchPanels(client, sites ?? []),
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

  const swr = useSWR<LedPreset[]>(PRESETS_KEY, () => ledApi.fetchPresets(client), options)

  return { ...swr, presets: swr.data ?? [] }
}

export function useCreateLedPreset() {
  const client = useApiClient()

  return useSWRMutation(
    PRESETS_KEY,
    (_key: string, { arg }: { arg: LedPresetCreateRequest }) => ledApi.createPreset(client, arg),
  )
}

export function useUpdateLedPreset() {
  const client = useApiClient()

  return useSWRMutation(
    PRESETS_KEY,
    (_key: string, { arg }: { arg: { id: number; data: LedPresetUpdateRequest } }) =>
      ledApi.updatePreset(client, arg.id, arg.data),
  )
}

export function useDeleteLedPreset() {
  const client = useApiClient()

  return useSWRMutation(
    PRESETS_KEY,
    (_key: string, { arg }: { arg: number }) => ledApi.deletePreset(client, arg),
  )
}

/** 메시지 송출 */
export function useDispatchLedMessage() {
  const client = useApiClient()

  return useSWRMutation<LedDispatchResult, Error, string, LedDispatchRequest>(
    'led-dispatch',
    (_key, { arg }) => ledApi.dispatch(client, arg),
  )
}

/**
 * 현재 표출 중인 내용.
 *
 * 자동 송출(이벤트 조건 → LED)이 붙으면 사람이 누르지 않은 메시지가 올라가므로,
 * 지금 무엇이 표출 중인지 보고 내릴 수 있어야 한다.
 */
export function useLedActiveDisplays(options?: SWRConfiguration<LedActiveDisplay[], Error>) {
  const client = useApiClient()

  const swr = useSWR<LedActiveDisplay[]>(
    ACTIVE_KEY,
    () => ledApi.fetchActiveDisplays(client),
    options,
  )

  return { ...swr, displays: swr.data ?? [] }
}

/** 표출 해제 */
export function useClearLedDisplays() {
  const client = useApiClient()

  return useSWRMutation<LedDispatchResult, Error, string, number[]>(
    ACTIVE_KEY,
    (_key, { arg }) => ledApi.clearDisplays(client, arg),
  )
}
