// CCTV types
export type {
  SiteResponse,
  CctvResponse,
  CctvCreateRequest,
  CctvUpdateRequest,
  CctvListParams,
} from './cctv'

export {
  cctvResponseSchema,
  cctvCreateRequestSchema,
  cctvUpdateRequestSchema,
} from './cctv'

export type {
  DeviceType,
  DeviceProfile,
} from './deviceType'

export type {
  EventCondition,
  EventConditionRequest,
} from './eventCondition'

// Site types
export type {
  Site,
  SiteCreateRequest,
  SiteUpdateRequest,
} from './site'