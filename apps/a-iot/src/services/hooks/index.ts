// CCTV hooks
export {
  useCctvList,
  useCctv,
  useCreateCctv,
  useUpdateCctv,
  useDeleteCctv,
} from './useCctv'

export {
  useEventActionHistories,
  useCreateActionHistory,
  useUpdateActionHistory,
  useDeleteActionHistory,
} from './useEventsHistory.ts'

export {
  useEvents,
  useUpdateEventStatus,
  useEventsTimeSeries
} from './useEventsManagement.ts'

// Site hooks
export {
  useSites,
  useSite,
  useCreateSite,
  useUpdateSite,
  useDeleteSite,
} from './useSite'

// Permission hooks
export {
  usePermissionResources,
} from './usePermission'

export {
  usePermissionCheckbox,
} from './usePermissionCheckbox'