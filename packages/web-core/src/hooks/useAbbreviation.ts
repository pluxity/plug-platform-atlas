import useSWR, { type SWRConfiguration } from 'swr'
import useSWRMutation, { type SWRMutationConfiguration } from 'swr/mutation'
import { useApiClient } from '@plug-atlas/api-hooks'
import type { AbbreviationResponse, AbbreviationRequest } from '../types/abbreviation'

type DataResponse<T> = { data: T }

/**
 * 약어 목록 조회
 */
export function useAbbreviations(options?: SWRConfiguration<AbbreviationResponse[], Error>) {
  const client = useApiClient()

  return useSWR(
    '/abbreviations',
    async () => {
      const response = await client.get<DataResponse<AbbreviationResponse[]>>('/abbreviations')
      return response.data
    },
    options
  )
}

/**
 * 약어 상세 조회
 */
export function useAbbreviation(
  abbreviationId: number | null,
  options?: SWRConfiguration<AbbreviationResponse, Error>
) {
  const client = useApiClient()

  return useSWR(
    abbreviationId ? `/abbreviations/${abbreviationId}` : null,
    async () => {
      const response = await client.get<DataResponse<AbbreviationResponse>>(`/abbreviations/${abbreviationId}`)
      return response.data
    },
    options
  )
}

/**
 * 약어 생성 (201 Created)
 */
export function useCreateAbbreviation(options?: SWRMutationConfiguration<number, Error, string, AbbreviationRequest>) {
  const client = useApiClient()

  return useSWRMutation(
    '/abbreviations',
    async (_key: string, { arg }: { arg: AbbreviationRequest }) => {
      const result = await client.post<number>('/abbreviations', arg)
      return result as number
    },
    options
  )
}

/**
 * 약어 수정 (204 No Content)
 */
export function useUpdateAbbreviation(options?: SWRMutationConfiguration<void, Error, string, { id: number; data: AbbreviationRequest }>) {
  const client = useApiClient()

  return useSWRMutation(
    '/abbreviations',
    async (_key: string, { arg }: { arg: { id: number; data: AbbreviationRequest } }) => {
      await client.patch(`/abbreviations/${arg.id}`, arg.data)
    },
    options
  )
}

/**
 * 약어 삭제 (204 No Content)
 */
export function useDeleteAbbreviation(options?: SWRMutationConfiguration<void, Error, string, number>) {
  const client = useApiClient()

  return useSWRMutation(
    '/abbreviations',
    async (_key: string, { arg }: { arg: number }) => {
      await client.delete(`/abbreviations/${arg}`)
    },
    options
  )
}
