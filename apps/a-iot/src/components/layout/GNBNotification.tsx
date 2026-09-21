import { useEffect, useMemo, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { Button, Popover, PopoverContent, PopoverTrigger, Dialog } from '@plug-atlas/ui'
import { useNotificationStore, useEventStore } from '../../stores'
import { useStompNotifications, useInitialNotifications } from '../../services/hooks'
import type { Event } from '../../services/types'
import NotificationItem from './NotificationItem'
import EventDetailModal from '../../pages/main/events/components/modal/EventDetailModal'
import { useInfiniteEvents } from '@/services/hooks/useEventsManagement'
import { useRecentEventRange } from '@/services/hooks/useRecentEventRange'
import { mergeNotificationFeed } from '@/lib/notification-feed'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

export default function GNBNotification() {
  const [open, setOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useInitialNotifications()
  const { isConnected: _ } = useStompNotifications()

  const liveNotifications = useNotificationStore((state) => state.notifications)
  const latestEvents = useEventStore(state => state.events)
  const range = useRecentEventRange()
  const query = useInfiniteEvents({ status: 'ACTIVE', ...range }, 20, { persistSize: false, refreshInterval: 30_000 })
  const notifications = useMemo(() => mergeNotificationFeed(query.events, liveNotifications, latestEvents, range),
    [query.events, liveNotifications, latestEvents, range])
  const unreadCount = notifications.filter(item => item.type === 'sensor-alarm').length
  const { root, onScroll, onWheel } = useInfiniteScroll({ hasMore: query.hasMore,
    loading: !open || query.isLoading || query.isValidating, error: query.error, onLoadMore: query.loadMore })
  const markAsRead = useNotificationStore((state) => state.markAsRead)

  // Historical pagination must not trigger a new-alarm popup.
  const previousLiveIds = useRef(new Set<string>())
  useEffect(() => {
    const visibleLive = mergeNotificationFeed([], liveNotifications, latestEvents, range)
    if (visibleLive.some(item => !previousLiveIds.current.has(item.id))) {
      setOpen(true)
    }
    previousLiveIds.current = new Set(visibleLive.map(item => item.id))
  }, [liveNotifications, latestEvents, range])

  const handleItemClick = (event: Event) => {
    setSelectedEvent(event)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedEvent(null)
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8 relative text-gray-600 hover:text-gray-900 hover:bg-gray-100">
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 flex items-center justify-center text-[10px] bg-red-600 text-white rounded-full">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="end"
          className="w-96 p-3.5 bg-gray-100 rounded-2xl border-0 shadow-[-4px_8px_15px_0px_rgba(0,0,0,0.15)]"
        >
          <div className="flex flex-col">
            <p className="mb-2 text-xs text-gray-500">오늘 포함 최근 7일 · 미처리 알림</p>
            <div className="relative">
              <div ref={root} onScroll={onScroll} onWheel={onWheel}
                className="max-h-[540px] overflow-y-auto space-y-2.5 scrollbar-thin">
                {notifications.length === 0 && !query.isLoading && !query.error ? (
                  <div className="min-h-48 bg-white rounded-2xl flex flex-col items-center justify-center text-gray-400">
                    <Bell className="size-10 mb-2" />
                    <p className="text-sm">알림이 없습니다</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onItemClick={handleItemClick}
                    />
                  ))
                )}
                {query.isLoading || query.isValidating ? <p role="status" className="p-2 text-center text-sm text-gray-500">알림 로딩 중...</p> : null}
                {query.error && <div role="alert" className="p-2 text-sm text-red-600">
                  알림을 불러오지 못했습니다.
                  <Button variant="link" size="sm" onClick={() => void query.mutate()}>다시 시도</Button>
                </div>}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        {selectedEvent && <EventDetailModal event={selectedEvent} />}
      </Dialog>
    </>
  )
}
