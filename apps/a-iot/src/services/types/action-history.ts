import { z } from 'zod'

/**
 * Action History Response
 */
export const ActionHistoryResponseSchema = z.object({
  id: z.number(),
  deviceId: z.string(),
  eventName: z.string(),
  eventHistoryId: z.number().optional(),
  actionType: z.string(),
  actionResult: z.string(),
  ignored: z.boolean(),
  actedAt: z.string().optional(),
  actedBy: z.string().optional(),
  content: z.string().optional(),
})

export type ActionHistoryResponse = z.infer<typeof ActionHistoryResponseSchema>

/**
 * Action History Request
 */
export const ActionHistoryRequestSchema = z.object({
  deviceId: z.string().min(1, '디바이스 ID를 입력해주세요'),
  eventName: z.string().min(1, '이벤트명을 입력해주세요'),
  eventHistoryId: z.number().optional(),
  actionType: z.string().min(1, '액션 타입을 입력해주세요'),
  actionResult: z.string().min(1, '액션 결과를 입력해주세요'),
  ignored: z.boolean(),
  actedBy: z.string().optional(),
  content: z.string().optional(),
})

export type ActionHistoryRequest = z.infer<typeof ActionHistoryRequestSchema>
