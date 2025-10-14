import { Building2, ChevronRight } from 'lucide-react'
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
} from '@plug-atlas/ui'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@plug-atlas/ui'
import { MENU_ITEMS } from '../constants/menu'

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
              {MENU_ITEMS.map((item) => {
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
      </SidebarContent>
    </Sidebar>
  )
}
