import useSWR from 'swr'
import { useEdsStore } from '@/stores/edsStore'
import { edsCameraList } from '@/lib/eds/eds-client'
import type { EdsCamera } from '@/lib/eds/eds-types'

/**
 * EDS 카메라 목록 조회 훅 (SWR 기반)
 */
export function useEdsCameras() {
  const apiKey = useEdsStore((s) => s.apiKey)

  return useSWR<EdsCamera[]>(
    apiKey ? ['eds-cameras', apiKey] : null,
    async () => {
      const res = await edsCameraList(apiKey!)
      return res.result ?? []
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 30_000,
    },
  )
}
