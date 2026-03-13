import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { Button, Popover, PopoverContent, PopoverTrigger, Dialog } from '@plug-atlas/ui'
import { useNotificationStore } from '../../stores'
import { useStompNotifications, useInitialNotifications } from '../../services/hooks'
import type { Event } from '../../services/types'
import NotificationItem from './NotificationItem'
import EventDetailModal from '../../pages/main/events/components/modal/EventDetailModal'

export default function GNBNotification() {
  const [open, setOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useInitialNotifications()
  const { isConnected: _ } = useStompNotifications()

  const notifications = useNotificationStore((state) => state.notifications)
  const unreadCount = useNotificationStore((state) => state.unreadCount)
  const markAsRead = useNotificationStore((state) => state.markAsRead)

  // Auto-popup on new notification
  const prevUnreadCount = useRef(0)
  const isInitialLoad = useRef(true)

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false
      prevUnreadCount.current = unreadCount
      return
    }

    if (unreadCount > prevUnreadCount.current && unreadCount > 0) {
      setOpen(true)
    }
    prevUnreadCount.current = unreadCount
  }, [unreadCount])

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
              <span className="absolute -top-0.5 -right-0.5 size-4 flex items-center justify-center text-[10px] bg-red-600 text-white rounded-full">
                {unreadCount > 9 ? '9+' : unreadCount}
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
            <div className="relative">
              <div className="max-h-[540px] overflow-y-auto space-y-2.5 scrollbar-thin">
                {notifications.length === 0 ? (
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
