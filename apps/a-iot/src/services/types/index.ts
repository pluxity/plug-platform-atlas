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
  ActionHistory,
  ActionHistoryRequest,
} from './eventHistory'

export type {
    Event,
    EventStatusRequest,
    EventsQueryParams,
    TimeSeriesData,
    TimeSeriesQueryParams,
    EventStatus,
    EventCollectInterval
} from './eventManagement'

// Site types
export type {
  Site,
  SiteCreateRequest,
  SiteUpdateRequest,
} from './site'

// Permission types
export type {
  PermissionResourceItem,
  PermissionResourcesData,
} from './permission'

export type {
  PermissionCheckboxItem,
} from './permissionCheckbox'