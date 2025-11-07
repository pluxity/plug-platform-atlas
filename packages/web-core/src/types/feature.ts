import { z } from 'zod'

/**
 * Profile Response (for Device Type)
 */
export const ProfileResponseSchema = z.object({
  id: z.number(),
  fieldKey: z.string(),
  description: z.string().optional(),
  fieldUnit: z.string().optional(),
  fieldType: z.string().optional(),
})

export type ProfileResponse = z.infer<typeof ProfileResponseSchema>

/**
 * Site Response (for Feature)
 */
export const SiteResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.string().optional(),
  updatedBy: z.string().optional(),
})

export type SiteResponse = z.infer<typeof SiteResponseSchema>

/**
 * Device Type (for Feature)
 */
export const DeviceTypeResponseSchema = z.object({
  id: z.number(),
  objectId: z.string(),
  description: z.string().optional(),
  version: z.string().optional(),
  profiles: z.array(ProfileResponseSchema).optional(), 
})

export type DeviceTypeResponse = z.infer<typeof DeviceTypeResponseSchema>

/**
 * Query Metadata (for time-series)
 */
export const QueryMetaSchema = z.object({
  timeUnit: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  metrics: z.array(z.string()).optional(),
})

export type QueryMeta = z.infer<typeof QueryMetaSchema>

/**
 * Meta Data
 */
export const MetaDataSchema = z.object({
  targetId: z.string().optional(),
  query: QueryMetaSchema.optional(),
})

export type MetaData = z.infer<typeof MetaDataSchema>

/**
 * Metric Data for Latest (단일 값)
 */
export const LatestMetricDataSchema = z.object({
  unit: z.string().optional(),
  value: z.number().optional(),
})

export type LatestMetricData = z.infer<typeof LatestMetricDataSchema>

/**
 * Metric Data for Time-series (배열 값)
 */
export const TimeSeriesMetricDataSchema = z.object({
  unit: z.string().optional(),
  values: z.array(z.number()).optional(),
})

export type TimeSeriesMetricData = z.infer<typeof TimeSeriesMetricDataSchema>

/**
 * Latest Data Response
 */
export const LatestDataResponseSchema = z.object({
  meta: MetaDataSchema.optional(),
  timestamp: z.string().optional(),
  metrics: z.record(z.string(), LatestMetricDataSchema).optional(),
})

export type LatestDataResponse = z.infer<typeof LatestDataResponseSchema>

/**
 * Time-series Data Response
 */
export const TimeSeriesDataResponseSchema = z.object({
  meta: MetaDataSchema.optional(),
  timestamps: z.array(z.string()).optional(),
  metrics: z.record(z.string(), TimeSeriesMetricDataSchema).optional(),
})

export type TimeSeriesDataResponse = z.infer<typeof TimeSeriesDataResponseSchema>

/**
 * Feature Response
 */
export const FeatureResponseSchema = z.object({
  id: z.number(),
  deviceId: z.string(),
  objectId: z.string(),
  name: z.string(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  batteryLevel: z.number().optional(),
  eventStatus: z.string().optional(),
  height: z.number().optional(),      
  siteResponse: SiteResponseSchema.optional(),
  deviceTypeResponse: DeviceTypeResponseSchema.optional(),
  active: z.boolean().optional(),
})

export type FeatureResponse = z.infer<typeof FeatureResponseSchema>

/**
 * Feature Update Request
 */
export const FeatureUpdateRequestSchema = z.object({
  height: z.number().optional(),
  active: z.boolean().optional(),
})

export type FeatureUpdateRequest = z.infer<typeof FeatureUpdateRequestSchema>
