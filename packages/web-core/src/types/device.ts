import { z } from 'zod'

/**
 * Device Event Response
 */
export const DeviceEventResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
})

export type DeviceEventResponse = z.infer<typeof DeviceEventResponseSchema>

/**
 * Device Event Request
 */
export const DeviceEventRequestSchema = z.object({
  name: z.string().min(1, '이벤트명을 입력해주세요'),
  description: z.string().optional(),
})

export type DeviceEventRequest = z.infer<typeof DeviceEventRequestSchema>

/**
 * Device Profile Type Request
 */
export const DeviceProfileTypeRequestSchema = z.object({
  type: z.string().min(1, '타입을 입력해주세요'),
  description: z.string().optional(),
})

export type DeviceProfileTypeRequest = z.infer<typeof DeviceProfileTypeRequestSchema>

/**
 * Device Type Response
 */
export const DeviceTypeResponseSchema = z.object({
  id: z.number(),
  objectId: z.string(),
  description: z.string().optional(),
  version: z.string().optional(),
  events: z.array(DeviceEventResponseSchema).optional(),
})

export type DeviceTypeResponse = z.infer<typeof DeviceTypeResponseSchema>

/**
 * Device Type Request
 */
export const DeviceTypeRequestSchema = z.object({
  objectId: z.string().min(1, 'Object ID를 입력해주세요'),
  description: z.string().optional(),
  version: z.string().optional(),
  deviceEvents: z.array(DeviceEventRequestSchema).optional(),
  deviceProfileTypes: z.array(DeviceProfileTypeRequestSchema).optional(),
})

export type DeviceTypeRequest = z.infer<typeof DeviceTypeRequestSchema>

/**
 * Device Profile Request
 */
export const DeviceProfileRequestSchema = z.object({
  fieldKey: z.string().min(1, '필드명을 입력해주세요'),
  description: z.string().min(1, '용도를 입력해주세요'),
  fieldUnit: z.string().optional(),
  fieldType: z.enum(['String', 'Integer', 'Float', 'Boolean']).optional(),
})

export type DeviceProfileRequest = z.infer<typeof DeviceProfileRequestSchema>
