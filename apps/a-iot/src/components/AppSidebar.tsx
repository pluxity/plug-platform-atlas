import { Building2, ChevronRight, User, LogOut, Settings as SettingsIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@plug-atlas/ui'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@plug-atlas/ui'
import { MAIN_MENU_ITEMS, REALTIME_ALARM_MENU, ADMIN_MENU_ITEMS } from '../constants/menu'
import { useAuthStore } from '../stores'

// 실시간 알람 개수 (나중에 실제 API로 대체)
const realtimeAlarmCount = 5

export default function AppSidebar() {
  const location = useLocation()

  // Zustand stores
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  // 더미 사용자 데이터 (인증되지 않은 경우 기본값)
  const currentUser = user
    ? { ...user, avatar: '' }
    : {
        name: '관리자',
        email: 'admin@example.com',
        role: 'admin' as const,
        avatar: '',
      }

  const isActive = (path: string) => location.pathname === path

  // 실시간 알람 클릭 핸들러 (나중에 Sheet, Dialog, Popover 등으로 구현 가능)
  const handleRealtimeAlarmClick = () => {
    // TODO: 실시간 알람 UI 구현 (Sheet, Dialog, Popover 등)
    console.log('실시간 알람 클릭')
  }

  const renderMenuItems = (items: typeof MAIN_MENU_ITEMS) => {
    return items.map((item) => {
      const Icon = item.icon

      if (item.children && item.children.length > 0) {
        return (
          <Collapsible key={item.title} defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <Icon />
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.children.map((child) => {
                    const ChildIcon = child.icon
                    return (
                      <SidebarMenuSubItem key={child.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={child.path ? isActive(child.path) : false}
                        >
                          <Link to={child.path || '#'}>
                            <ChildIcon className="size-4" />
                            <span>{child.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        )
      }

      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item.path ? isActive(item.path) : false}>
            <Link to={item.path || '#'}>
              <Icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    })
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-gray-200">
        <div className="flex items-center gap-2 px-2 py-4">
          <Building2 className="size-6 text-blue-600" />
          <span className="font-bold text-base">시민안심공원 서비스</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* 메인 메뉴 */}
        <SidebarGroup>
          <SidebarGroupLabel>메인 메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenuItems(MAIN_MENU_ITEMS)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 관리자 메뉴 */}
        <SidebarGroup>
          <SidebarGroupLabel>관리 기능</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ADMIN_MENU_ITEMS.map((item) => {
                const Icon = item.icon

                if (item.children && item.children.length > 0) {
                  return (
                    <Collapsible key={item.title} defaultOpen className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton>
                            <Icon />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.children.map((child) => {
                              const ChildIcon = child.icon
                              return (
                                <SidebarMenuSubItem key={child.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={child.path ? isActive(child.path) : false}
                                  >
                                    <Link to={child.path || '#'}>
                                      <ChildIcon className="size-4" />
                                      <span>{child.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              )
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.path ? isActive(item.path) : false}>
                      <Link to={item.path || '#'}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 실시간 알람 메뉴 */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleRealtimeAlarmClick}>
                  <REALTIME_ALARM_MENU.icon />
                  <span>{REALTIME_ALARM_MENU.title}</span>
                  {realtimeAlarmCount > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {realtimeAlarmCount}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent">
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback className="rounded-lg bg-blue-600 text-white">
                      {currentUser.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left text-sm leading-tight">
                    <span className="font-semibold">{currentUser.name}</span>
                    <span className="text-xs text-gray-500">{currentUser.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="end"
                className="w-56"
              >
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
