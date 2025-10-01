import { z } from 'zod'

/**
 * Device Type (for Feature)
 */
export const DeviceTypeSchema = z.object({
  id: z.number(),
  objectId: z.string(),
  description: z.string().optional(),
  version: z.string().optional(),
})

export type DeviceType = z.infer<typeof DeviceTypeSchema>

/**
 * Metric Data
 */
export const MetricDataSchema = z.object({
  value: z.union([z.string(), z.number(), z.boolean()]).optional(),
  timestamp: z.string().optional(),
})

export type MetricData = z.infer<typeof MetricDataSchema>

/**
 * Meta Data
 */
export const MetaDataSchema = z.object({
  deviceId: z.string().optional(),
  timestamp: z.string().optional(),
})

export type MetaData = z.infer<typeof MetaDataSchema>

/**
 * Data Response (Time-series data)
 */
export const DataResponseSchema = z.object({
  meta: MetaDataSchema.optional(),
  timestamp: z.string().optional(),
  metrics: z.record(z.string(), MetricDataSchema).optional(),
})

export type DataResponse = z.infer<typeof DataResponseSchema>

/**
 * Feature Response
 */
export const FeatureResponseSchema = z.object({
  id: z.number(),
  deviceType: DeviceTypeSchema.optional(),
  deviceId: z.string(),
  objectId: z.string(),
  name: z.string(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  batteryLevel: z.number().optional(),
  location: z.string().optional(),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.string().optional(),
  updatedBy: z.string().optional(),
})

export type FeatureResponse = z.infer<typeof FeatureResponseSchema>

/**
 * Feature Update Request
 */
export const FeatureUpdateRequestSchema = z.object({
  name: z.string().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  location: z.string().optional(),
})

export type FeatureUpdateRequest = z.infer<typeof FeatureUpdateRequestSchema>
