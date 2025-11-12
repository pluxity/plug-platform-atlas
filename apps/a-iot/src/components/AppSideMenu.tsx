import React, {useEffect, useRef, useState} from 'react'
import { Building2, LogOut, ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import {
  SideMenu,
  SideMenuTrigger,
  SideMenuContent,
  SideMenuHeader,
  SideMenuNav,
  SideMenuSubMenu,
  SideMenuSubItem,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@plug-atlas/ui'
import { MAIN_MENU_ITEMS, ADMIN_MENU_ITEMS } from '../constants/menu'
import { useAuthStore, useNotificationStore } from '../stores'
import { useStompNotifications, useInitialNotifications } from '../services/hooks'
import NotificationPop from './NotificationPop'

export default function AppSideMenu() {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [notificationOpen, setNotificationOpen] = useState(false)

  useInitialNotifications()

  const { isConnected } = useStompNotifications()

  const notifications = useNotificationStore((state) => state.notifications)
  const unreadCount = useNotificationStore((state) => state.unreadCount)
  const markAsRead = useNotificationStore((state) => state.markAsRead)

  const prevUnreadCount = useRef(0)
  useEffect(() => {
    if (unreadCount > prevUnreadCount.current && unreadCount > 0) {
      setNotificationOpen(true)
    }
    prevUnreadCount.current = unreadCount
  }, [unreadCount])

  const currentUser = user
    ? { ...user, avatar: '' }
    : {
        name: '관리자',
        email: 'admin@example.com',
        role: 'admin' as const,
        avatar: '',
      }

  const isActive = React.useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  )

  const renderMenuItem = React.useCallback((item: typeof MAIN_MENU_ITEMS[0]) => {
    const Icon = item.icon

    if (item.children && item.children.length > 0) {
      return (
        <Collapsible key={item.title} defaultOpen className="group/collapsible">
          <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-2">
              <Icon className="size-4" />
              <span>{item.title}</span>
            </div>
            <ChevronRight className="size-4 text-gray-500 transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SideMenuSubMenu>
              {item.children.map((child) => {
                const ChildIcon = child.icon
                return (
                  <SideMenuSubItem key={child.title}>
                    <Link
                      to={child.path || '#'}
                      className={`flex h-7 min-w-0 items-center gap-2 overflow-hidden rounded-md px-3 text-xs transition-colors ${
                        child.path && isActive(child.path)
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <span className="text-gray-400">
                        <ChildIcon className="size-3" />
                      </span>
                      <span className="truncate">{child.title}</span>
                    </Link>
                  </SideMenuSubItem>
                )
              })}
            </SideMenuSubMenu>
          </CollapsibleContent>
        </Collapsible>
      )
    }

    return (
      <Link
        key={item.title}
        to={item.path || '#'}
        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
          item.path && isActive(item.path)
            ? 'bg-blue-50 text-blue-700 font-medium'
            : 'hover:bg-gray-100'
        }`}
      >
        <Icon className="size-4" />
        <span>{item.title}</span>
      </Link>
    )
  }, [isActive])

  return (
    <div className="fixed top-0 left-0 h-screen z-50 py-4 pl-4">
      <SideMenu defaultOpen={true} collapsible={false} className="flex flex-col gap-3 h-full">
        {({ open }) => (
          <>
            <SideMenuTrigger open={open} showChevron={false} className="h-10 shrink-0">
              <Building2 className="size-5 text-blue-600" />
              <span className="font-semibold text-sm">시민안심공원 서비스</span>
            </SideMenuTrigger>

            <SideMenuContent className="w-72 h-[calc(100vh-5.2rem)] shrink-0">
              <SideMenuHeader className="py-2 shrink-0">
                <div className="flex items-center gap-2">
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback className="rounded-lg bg-blue-50 text-blue-600 text-xs font-medium">
                      {currentUser.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left flex-1 min-w-0">
                    <span className="text-xs text-gray-500">{currentUser.role || '일반 사용자'}</span>
                    <span className="text-sm font-semibold truncate">{currentUser.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-gray-600 hover:text-red-600"
                      onClick={logout}
                    >
                      <LogOut className="size-4" />
                    </Button>
                    <NotificationPop
                      notifications={notifications}
                      unreadCount={unreadCount}
                      isConnected={isConnected}
                      open={notificationOpen}
                      onOpenChange={setNotificationOpen}
                      onMarkAsRead={markAsRead}
                    />
                  </div>
                </div>
              </SideMenuHeader>

              <SideMenuNav className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  <div className="space-y-0.5">
                    <div className="px-3 py-1.5 text-xs font-semibold text-gray-400">
                      메인 메뉴
                    </div>
                    {MAIN_MENU_ITEMS.map(renderMenuItem)}
                  </div>

                  <div className="space-y-0.5">
                    <div className="px-3 py-1.5 text-xs font-semibold text-gray-400">
                      관리 기능
                    </div>
                    {ADMIN_MENU_ITEMS.map(renderMenuItem)}
                  </div>
                </div>
              </SideMenuNav>
            </SideMenuContent>
          </>
        )}
      </SideMenu>
    </div>
  )
}
