import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { Button, DataTable, type Column } from '@plug-atlas/ui'
import type { Event } from '@/services/types'

interface Props {
  events: Event[]
  columns: Column<Event>[]
  hasMore: boolean
  loading: boolean
  error: unknown
  onLoadMore: () => Promise<unknown>
  onRetry: () => Promise<unknown>
  onSelect: (event: Event) => void
}

export default function DashboardEventList({ events, columns, hasMore, loading, error, onLoadMore, onRetry, onSelect }: Props) {
  const { root, requesting, onScroll, onWheel } = useInfiniteScroll({ hasMore, loading, error, onLoadMore })

  return (
    <div ref={root} className="h-full overflow-y-auto" aria-busy={loading || requesting} onScroll={onScroll}
      onWheel={onWheel}>
      {!!events.length && (
        <DataTable className="[&>div]:overflow-visible [&>div]:h-auto" density="compact" stickyHeader
          columns={columns} data={events} getRowId={event => String(event.eventId)} onRowClick={onSelect} />
      )}
      {error ? (
        <div role="alert" className="p-3 text-sm text-red-600">
          이벤트를 불러오지 못했습니다.
          <Button variant="link" size="sm" onClick={() => void onRetry().catch(() => undefined)}>다시 시도</Button>
        </div>
      ) : loading ? (
        <div role="status" className="p-3 text-center text-sm text-gray-500">이벤트 로딩 중...</div>
      ) : !events.length && !hasMore ? (
        <div className="flex h-full items-center justify-center text-gray-500">이벤트가 없습니다.</div>
      ) : null}
    </div>
  )
}
