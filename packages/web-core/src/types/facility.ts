import { z } from 'zod'

/**
 * Facility Response
 */
export const FacilityResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.string().optional(),
  updatedBy: z.string().optional(),
})

export type FacilityResponse = z.infer<typeof FacilityResponseSchema>

/**
 * Facility Request
 */
export const FacilityRequestSchema = z.object({
  name: z.string().min(1, '시설 이름을 입력해주세요').max(50),
  location: z.string().min(1, 'WKT 형식의 위치 정보를 입력해주세요'),
  description: z.string().optional(),
})

export type FacilityRequest = z.infer<typeof FacilityRequestSchema>
