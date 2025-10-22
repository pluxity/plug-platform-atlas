import { z } from 'zod'

// Site Response (CCTV에 포함됨)
export interface SiteResponse {
  id: number
  name: string
}

// CCTV Response
export const cctvResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string().optional(), // Origin URL (API 키: url)
  viewUrl: z.string().optional(),
  lon: z.number(),
  lat: z.number(),
  height: z.number(),
  site: z.custom<SiteResponse>().optional(),
})

export type CctvResponse = z.infer<typeof cctvResponseSchema>

// CCTV Create Request
export const cctvCreateRequestSchema = z.object({
  name: z.string().min(1, 'CCTV 이름을 입력해주세요').max(50, 'CCTV 이름은 최대 50자까지 입력 가능합니다'),
  url: z.string().min(1, 'CCTV URL을 입력해주세요').refine(
    (url) => {
      try {
        new URL(url)
        return url.startsWith('rtsp://') || url.startsWith('http://') || url.startsWith('https://')
      } catch {
        return false
      }
    },
    { message: 'rtsp://, http://, https:// 프로토콜을 사용한 올바른 URL을 입력해주세요' }
  ),
  lon: z.number()
    .refine((val) => val !== 0, { message: '지도에서 CCTV 위치를 선택해주세요' })
    .refine((val) => val >= -180 && val <= 180, { message: '경도는 -180 ~ 180 범위여야 합니다' }),
  lat: z.number()
    .refine((val) => val !== 0, { message: '지도에서 CCTV 위치를 선택해주세요' })
    .refine((val) => val >= -90 && val <= 90, { message: '위도는 -90 ~ 90 범위여야 합니다' }),
  height: z.number()
    .min(0.1, 'CCTV 높이는 0.1m 이상이어야 합니다')
    .max(100, 'CCTV 높이는 100m 이하여야 합니다'),
})

export type CctvCreateRequest = z.infer<typeof cctvCreateRequestSchema>

// CCTV Update Request (name만 필수)
export const cctvUpdateRequestSchema = z.object({
  name: z.string().min(1, 'CCTV 이름을 입력해주세요').max(50, 'CCTV 이름은 최대 50자까지 입력 가능합니다'),
  url: z.string().min(1, 'CCTV URL을 입력해주세요').refine(
    (url) => {
      try {
        new URL(url)
        return url.startsWith('rtsp://') || url.startsWith('http://') || url.startsWith('https://')
      } catch {
        return false
      }
    },
    { message: 'rtsp://, http://, https:// 프로토콜을 사용한 올바른 URL을 입력해주세요' }
  ).optional(),
  lon: z.number().optional(),
  lat: z.number().optional(),
  height: z.number()
    .min(0.1, 'CCTV 높이는 0.1m 이상이어야 합니다')
    .max(100, 'CCTV 높이는 100m 이하여야 합니다')
    .optional(),
})

export type CctvUpdateRequest = z.infer<typeof cctvUpdateRequestSchema>

// CCTV List Query Params
export interface CctvListParams {
  siteId?: number
}
