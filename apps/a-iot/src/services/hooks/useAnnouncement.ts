/**
 * 안내방송 송출 이력 훅
 *
 * GET /announcements API를 사용한다.
 * 서버가 page/size/siteId 를 지원하므로 페이징·필터를 서버에 맡긴다.
 */
import useSWR, { type SWRConfiguration } from 'swr'
import { useApiClient } from '@plug-atlas/api-hooks'
import type { AnnouncementPage, AnnouncementQueryParams } from '../types/announcement'

type DataResponse<T> = { data: T }

const EMPTY_PAGE: AnnouncementPage = {
  content: [],
  pageNumber: 1,
  pageSize: 10,
  totalElements: 0,
  first: true,
  last: true,
}

interface UseAnnouncementsOptions extends SWRConfiguration<AnnouncementPage, Error> {
  /**
   * false 면 조회하지 않는다.
   *
   * SWR 의 isPaused 를 쓰지 않는 이유: 일시정지 상태로 마운트되면 조건이
   * 풀려도 재검증이 다시 예약되지 않아 요청이 영영 안 나간다.
   * 조건부 키(null)가 SWR 관용구고, 키가 생기는 순간 정상적으로 조회한다.
   */
  enabled?: boolean
}

export function useAnnouncements(
  params: AnnouncementQueryParams = {},
  options: UseAnnouncementsOptions = {},
) {
  const client = useApiClient()

  const { enabled = true, ...swrOptions } = options
  const { page = 1, size = 10, siteId } = params

  const query = new URLSearchParams({ page: String(page), size: String(size) })
  if (siteId != null) query.set('siteId', String(siteId))

  const path = `announcements?${query.toString()}`

  const swr = useSWR<AnnouncementPage>(
    enabled ? path : null,
    async () => {
      const response = await client.get<DataResponse<AnnouncementPage>>(path)
      return response.data ?? EMPTY_PAGE
    },
    swrOptions,
  )

  const data = swr.data ?? EMPTY_PAGE

  return {
    ...swr,
    announcements: data.content,
    totalElements: data.totalElements,
    /** 서버가 내려준 전체 페이지 수 */
    totalPages: Math.max(1, Math.ceil(data.totalElements / (data.pageSize || size))),
  }
}
