import { z } from 'zod'

/**
 * 공통 응답 타입
 */
export const DataResponseBodySchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
  })

export const ErrorResponseBodySchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  path: z.string().optional(),
  timestamp: z.string().optional(),
})

export type ErrorResponseBody = z.infer<typeof ErrorResponseBodySchema>

/**
 * 페이지네이션
 */
export const PageableSchema = z.object({
  page: z.number().int().min(0),
  size: z.number().int().min(1),
  sort: z.array(z.string()).optional(),
})

export type Pageable = z.infer<typeof PageableSchema>

export const PageResponseSchema = <T extends z.ZodTypeAny>(contentSchema: T) =>
  z.object({
    content: z.array(contentSchema),
    pageable: PageableSchema.optional(),
    totalElements: z.number().optional(),
    totalPages: z.number().optional(),
    last: z.boolean().optional(),
    first: z.boolean().optional(),
    number: z.number().optional(),
    size: z.number().optional(),
    numberOfElements: z.number().optional(),
    empty: z.boolean().optional(),
  })