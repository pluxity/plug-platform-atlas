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

export type {
  ActionHistory,
  ActionHistoryRequest,
} from './eventHistory'

export type {
    Event,
    EventStatusRequest,
    EventsQueryParams,
    PaginatedEventsResponse,
    TimeSeriesData,
    TimeSeriesQueryParams,
    EventStatus,
    EventLevel,
    SensorType,
    EventCollectInterval
} from './eventManagement'

export type {
    ConnectionErrorPayload,
    NotificationType,
    Notification,
    NotificationStore
} from './notification'

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