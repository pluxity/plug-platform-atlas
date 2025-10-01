import useSWR, { type SWRConfiguration } from 'swr'
import useSWRMutation, { type SWRMutationConfiguration } from 'swr/mutation'
import { useApiClient } from '../client/context'
import type { FileResponse } from '@plug-atlas/types'

type DataResponse<T> = { data: T }

/**
 * 파일 상세 조회
 */
export function useFile(
  fileId: number | null,
  options?: SWRConfiguration<FileResponse, Error>
) {
  const client = useApiClient()

  return useSWR(
    fileId ? `/files/${fileId}` : null,
    async () => {
      const response = await client.get<DataResponse<FileResponse>>(`/files/${fileId}`)
      return response.data
    },
    options
  )
}

/**
 * Pre-signed URL 조회
 */
export function useFilePreSignedUrl(options?: SWRConfiguration<string, Error>) {
  const client = useApiClient()

  return useSWR(
    '/files/pre-signed-url',
    async () => {
      const response = await client.get<DataResponse<string>>('/files/pre-signed-url')
      return response.data
    },
    options
  )
}

/**
 * 파일 업로드 (201 Created)
 */
export function useUploadFile(options?: SWRMutationConfiguration<number, Error, string, FormData>) {
  const client = useApiClient()

  return useSWRMutation(
    '/files/upload',
    async (_key: string, { arg }: { arg: FormData }) => {
      const result = await client.post<number>('/files/upload', arg)
      return result as number
    },
    options
  )
}
