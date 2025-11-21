import { z } from 'zod'

/**
 * Mobius Response
 */
export const MobiusResponseSchema = z.object({
  url: z.string(),
})

export type MobiusResponse = z.infer<typeof MobiusResponseSchema>

/**
 * Mobius Request
 */
export const MobiusRequestSchema = z.object({
  url: z.string().min(1, 'URL을 입력해주세요').url('올바른 URL 형식이 아닙니다'),
})

export type MobiusRequest = z.infer<typeof MobiusRequestSchema>
