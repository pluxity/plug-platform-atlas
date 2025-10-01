import { z } from 'zod'

/**
 * Abbreviation Response
 */
export const AbbreviationResponseSchema = z.object({
  id: z.number(),
  type: z.string(),
  abbreviationKey: z.string(),
  fullName: z.string(),
  description: z.string().optional(),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.string().optional(),
  updatedBy: z.string().optional(),
})

export type AbbreviationResponse = z.infer<typeof AbbreviationResponseSchema>

/**
 * Abbreviation Request
 */
export const AbbreviationRequestSchema = z.object({
  type: z.string().min(1, '분류를 입력해주세요'),
  abbreviationKey: z.string().min(1, '약어를 입력해주세요'),
  fullName: z.string().min(1, '정식명칭을 입력해주세요'),
  description: z.string().optional(),
})

export type AbbreviationRequest = z.infer<typeof AbbreviationRequestSchema>
