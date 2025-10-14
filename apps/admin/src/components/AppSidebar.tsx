import { Building2, ChevronRight, Home, Users, Shield, KeyRound } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
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
  SidebarTrigger,
} from '@plug-atlas/ui'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@plug-atlas/ui'

export default function AppSidebar() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex items-center gap-2">
            <Building2 className="size-6 text-blue-600" />
            <span className="font-bold text-lg">Admin</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메인 메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/')}>
                  <Link to="/">
                    <Home />
                    <span>대시보드</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/facilities')}>
                  <Link to="/facilities">
                    <Building2 />
                    <span>시설물 관리</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Users />
                      <span>사용자</span>
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive('/users')}>
                          <Link to="/users">
                            <Users className="size-4" />
                            <span>사용자</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive('/users/roles')}>
                          <Link to="/users/roles">
                            <Shield className="size-4" />
                            <span>역할</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive('/users/permissions')}>
                          <Link to="/users/permissions">
                            <KeyRound className="size-4" />
                            <span>권한 관리</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
