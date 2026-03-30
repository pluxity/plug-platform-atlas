import { useCallback } from 'react'
import { useEdsStore } from '@/stores/edsStore'
import { edsRealtimeStreamUrl } from '@/lib/eds/eds-client'
import { EDS_CONFIG } from '@/constants/eds'
import type { EdsStreamResult } from '@/lib/eds/eds-types'

/**
 * EDS 실시간 영상 스트림 URL을 요청하는 명령형 훅.
 * URL은 일회성이며 발급 후 10초 이내 재생해야 합니다.
 */
export function useEdsStream() {
  const apiKey = useEdsStore((s) => s.apiKey)

  const getStreamUrl = useCallback(
    async (cameraId: string): Promise<EdsStreamResult> => {
      if (!apiKey) throw new Error('EDS 인증 필요')

      return edsRealtimeStreamUrl(apiKey, {
        camera_id: cameraId,
        external_flag: EDS_CONFIG.externalFlag,
        meta_include_flag: 0,
        protocol_type: 'ws',
      })
    },
    [apiKey],
  )

  return { getStreamUrl }
}
