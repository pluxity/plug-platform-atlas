import { Building2, User, LogOut, Settings as SettingsIcon } from 'lucide-react'
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
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@plug-atlas/ui'
import { MAIN_MENU_ITEMS, REALTIME_ALARM_MENU, ADMIN_MENU_ITEMS } from '../constants/menu'
import { useAuthStore } from '../stores'
import { ChevronRight } from 'lucide-react'

const realtimeAlarmCount = 5

export default function AppSideMenu() {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const currentUser = user
    ? { ...user, avatar: '' }
    : {
        name: '관리자',
        email: 'admin@example.com',
        role: 'admin' as const,
        avatar: '',
      }

  const isActive = (path: string) => location.pathname === path

  const handleRealtimeAlarmClick = () => {
  }

  const renderMenuItem = (item: typeof MAIN_MENU_ITEMS[0]) => {
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
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      <SideMenu defaultOpen={false} collapsible>
        {({ open }) => (
          <>
            <SideMenuTrigger open={open}>
              <Building2 className="size-5 text-blue-600" />
              <span className="font-semibold text-sm">시민안심공원 서비스</span>
            </SideMenuTrigger>
            <SideMenuContent>
              <SideMenuHeader>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 w-full hover:bg-gray-50 rounded-md p-2 transition-colors">
                        <Avatar className="size-8 rounded-lg">
                          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                          <AvatarFallback className="rounded-lg bg-blue-600 text-white text-xs">
                            {currentUser.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start text-left">
                          <span className="text-sm font-semibold">{currentUser.name}</span>
                          <span className="text-xs text-gray-500">{currentUser.email}</span>
                        </div>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <div className="flex items-center gap-2 p-2">
                        <Avatar className="size-10 rounded-lg">
                          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                          <AvatarFallback className="rounded-lg bg-blue-600 text-white">
                            {currentUser.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{currentUser.name}</span>
                          <span className="text-xs text-gray-500">{currentUser.email}</span>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <User className="mr-2 size-4" />
                        <span>프로필</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <SettingsIcon className="mr-2 size-4" />
                        <span>설정</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={logout}>
                        <LogOut className="mr-2 size-4" />
                        <span>로그아웃</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </SideMenuHeader>

              <SideMenuNav>
                <div className="space-y-1">
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
                    메인 메뉴
                  </div>
                  {MAIN_MENU_ITEMS.map(renderMenuItem)}
                </div>

                <div className="space-y-1 mt-4">
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
                    관리 기능
                  </div>
                  {ADMIN_MENU_ITEMS.map(renderMenuItem)}
                </div>

                <div className="space-y-1 mt-4">
                  <button
                    onClick={handleRealtimeAlarmClick}
                    className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <REALTIME_ALARM_MENU.icon className="size-4" />
                      <span>{REALTIME_ALARM_MENU.title}</span>
                    </div>
                    {realtimeAlarmCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {realtimeAlarmCount}
                      </Badge>
                    )}
                  </button>
                </div>
              </SideMenuNav>
            </SideMenuContent>
          </>
        )}
      </SideMenu>
    </div>
  )
}
