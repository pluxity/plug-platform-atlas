import { useMemo } from 'react'
import { useCctvList } from './useCctv'
import { useMics } from './useMic'
import { cctvToDevice, micToDevice } from '../../lib/ai-edge-device'

export function useAiEdgeDevices() {
  const cctvs = useCctvList()
  const mics = useMics()
  const devices = useMemo(() => [
    ...(cctvs.error ? [] : cctvs.data ?? []).map(cctvToDevice),
    ...(mics.error ? [] : mics.data ?? []).map(micToDevice),
  ], [cctvs.data, cctvs.error, mics.data, mics.error])
  return { devices, cctvs, mics }
}
