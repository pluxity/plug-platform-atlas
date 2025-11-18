import { z } from 'zod'

/**
 * Event Condition Response
 */
export const EventConditionResponseSchema = z.object({
  id: z.number(),
  deviceEventId: z.number(),
  value: z.string().optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  operator: z.enum(['EQUALS', 'BETWEEN', 'GREATER_THAN', 'LESS_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN_OR_EQUAL']).optional(),
})

export type EventConditionResponse = z.infer<typeof EventConditionResponseSchema>

/**
 * Event Condition Request
 */
export const EventConditionRequestSchema = z.object({
  deviceEventId: z.number(),
  value: z.string().optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  operator: z.enum(['EQUALS', 'BETWEEN', 'GREATER_THAN', 'LESS_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN_OR_EQUAL']).optional(),
})

export type EventConditionRequest = z.infer<typeof EventConditionRequestSchema>

/**
 * Event Setting Response
 */
export const EventSettingResponseSchema = z.object({
  id: z.number(),
  deviceProfileTypeId: z.number(),
  eventEnabled: z.boolean(),
  conditions: z.array(EventConditionResponseSchema),
  months: z.array(z.number()),
  days: z.array(z.number()),
  weekdays: z.array(z.number()),
  hours: z.array(z.number()),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.string().optional(),
  updatedBy: z.string().optional(),
})

export type EventSettingResponse = z.infer<typeof EventSettingResponseSchema>

/**
 * Event Setting Request
 */
export const EventSettingRequestSchema = z.object({
  id: z.number().optional(),
  deviceProfileTypeId: z.number(),
  eventEnabled: z.boolean(),
  conditions: z.array(EventConditionRequestSchema),
  months: z.array(z.number()),
  days: z.array(z.number()),
  weekdays: z.array(z.number()),
  hours: z.array(z.number()),
})

export type EventSettingRequest = z.infer<typeof EventSettingRequestSchema>
