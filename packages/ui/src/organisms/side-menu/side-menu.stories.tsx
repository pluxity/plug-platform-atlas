import type { Meta, StoryObj } from '@storybook/react'
import {
  SideMenu,
  SideMenuTrigger,
  SideMenuContent,
  SideMenuLogo,
  SideMenuHeader,
  SideMenuNav,
  SideMenuFooter,
  SideMenuSubMenu,
  SideMenuSubItem,
  SideMenuSubButton,
} from './side-menu.component'
import { Home, Settings, Users, FileText, BarChart, LogOut, Wifi, MapPin } from 'lucide-react'

const meta: Meta<typeof SideMenu> = {
  title: 'Organisms/SideMenu',
  component: SideMenu,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '좌측 상단의 DIV 버튼을 클릭하면 바로 아래로 펼쳐지거나 접히는 메뉴 컴포넌트입니다. 기본은 열려있는 상태이며, collapsible prop으로 열고 접기 기능을 제어할 수 있습니다.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof SideMenu>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <SideMenu defaultOpen={true} collapsible={true}>
          {({ open }) => (
            <>
              <SideMenuTrigger showChevron={true} open={open}>
                <span className="text-sm font-medium">양산시 시민안전관리 서비스</span>
              </SideMenuTrigger>
              <SideMenuContent>
                <SideMenuHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">김</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">김영광</div>
                      <div className="text-xs text-gray-500">관리자</div>
                    </div>
                  </div>
                </SideMenuHeader>

                <SideMenuNav>
                  <nav className="space-y-1">
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Home className="h-4 w-4" />
                      <span>대시보드</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Users className="h-4 w-4" />
                      <span>이벤트</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FileText className="h-4 w-4" />
                      <span>IoT 센서</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <BarChart className="h-4 w-4" />
                      <span>통계</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4" />
                      <span>설정</span>
                    </a>
                  </nav>
                </SideMenuNav>

                <SideMenuFooter>
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <LogOut className="h-4 w-4" />
                    <span>로그아웃</span>
                  </button>
                </SideMenuFooter>
              </SideMenuContent>
            </>
          )}
        </SideMenu>
      </div>
    </div>
  ),
}

export const AlwaysOpen: Story = {
  render: () => (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <SideMenu collapsible={false}>
          {({ open }) => (
            <>
              <SideMenuTrigger showChevron={false} open={open}>
                <span className="text-sm font-medium">플러시티 관리 시스템</span>
              </SideMenuTrigger>
              <SideMenuContent>
                <SideMenuHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">홍</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">홍길동</div>
                      <div className="text-xs text-gray-500">hong@pluxity.com</div>
                    </div>
                  </div>
                </SideMenuHeader>

                <SideMenuNav>
                  <nav className="space-y-1">
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600"
                    >
                      <Home className="h-4 w-4" />
                      <span>대시보드</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Users className="h-4 w-4" />
                      <span>사용자 관리</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FileText className="h-4 w-4" />
                      <span>문서 관리</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <BarChart className="h-4 w-4" />
                      <span>통계 및 분석</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4" />
                      <span>시스템 설정</span>
                    </a>
                  </nav>
                </SideMenuNav>

                <SideMenuFooter>
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    <span>로그아웃</span>
                  </button>
                </SideMenuFooter>
              </SideMenuContent>
            </>
          )}
        </SideMenu>
      </div>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <SideMenu defaultOpen={true} collapsible={true}>
          {({ open }) => (
            <>
              <SideMenuTrigger showChevron={true} open={open}>
                <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-white">P</span>
                </div>
                <span className="text-sm font-medium">Pluxity Admin</span>
              </SideMenuTrigger>
              <SideMenuContent>
                <SideMenuLogo>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">P</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">Pluxity</div>
                      <div className="text-xs text-gray-500">Admin Portal</div>
                    </div>
                  </div>
                </SideMenuLogo>

                <SideMenuHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">U</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">사용자</div>
                      <div className="text-xs text-gray-500">user@example.com</div>
                    </div>
                  </div>
                </SideMenuHeader>

                <SideMenuNav>
                  <nav className="space-y-1">
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Home className="h-4 w-4" />
                      <span>홈</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Users className="h-4 w-4" />
                      <span>사용자</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FileText className="h-4 w-4" />
                      <span>문서</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <BarChart className="h-4 w-4" />
                      <span>통계</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4" />
                      <span>설정</span>
                    </a>
                  </nav>
                </SideMenuNav>

                <SideMenuFooter>
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <LogOut className="h-4 w-4" />
                    <span>로그아웃</span>
                  </button>
                </SideMenuFooter>
              </SideMenuContent>
            </>
          )}
        </SideMenu>
      </div>
    </div>
  ),
}

export const WithSubMenu: Story = {
  render: () => (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <SideMenu defaultOpen={true} collapsible={true}>
          {({ open }) => (
            <>
              <SideMenuTrigger showChevron={true} open={open}>
                <span className="text-sm font-medium">양산시 시민안전관리 서비스</span>
              </SideMenuTrigger>
              <SideMenuContent>
                <SideMenuHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">김</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">김영광</div>
                      <div className="text-xs text-gray-500">관리자</div>
                    </div>
                  </div>
                </SideMenuHeader>

                <SideMenuNav>
                  <nav className="space-y-1">
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600"
                    >
                      <Home className="h-4 w-4" />
                      <span>대시보드</span>
                    </a>

                    <div>
                      <a
                        href="#"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FileText className="h-4 w-4" />
                        <span>이벤트 관리</span>
                      </a>
                      <SideMenuSubMenu>
                        <SideMenuSubItem>
                          <SideMenuSubButton href="#">양잠 이벤트</SideMenuSubButton>
                        </SideMenuSubItem>
                        <SideMenuSubItem>
                          <SideMenuSubButton href="#">조지 이벤트</SideMenuSubButton>
                        </SideMenuSubItem>
                      </SideMenuSubMenu>
                    </div>

                    <div>
                      <a
                        href="#"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Wifi className="h-4 w-4" />
                        <span>IoT 센서</span>
                      </a>
                      <SideMenuSubMenu>
                        <SideMenuSubItem>
                          <SideMenuSubButton href="#">센서 내역</SideMenuSubButton>
                        </SideMenuSubItem>
                      </SideMenuSubMenu>
                    </div>

                    <div>
                      <a
                        href="#"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4" />
                        <span>관리 설정</span>
                      </a>
                      <SideMenuSubMenu>
                        <SideMenuSubItem>
                          <SideMenuSubButton href="#">서울라디</SideMenuSubButton>
                        </SideMenuSubItem>
                        <SideMenuSubItem>
                          <SideMenuSubButton href="#">IoT 센서 관리</SideMenuSubButton>
                        </SideMenuSubItem>
                        <SideMenuSubItem>
                          <SideMenuSubButton href="#">사용자 관리</SideMenuSubButton>
                        </SideMenuSubItem>
                        <SideMenuSubItem>
                          <SideMenuSubButton href="#">시스템 설정</SideMenuSubButton>
                        </SideMenuSubItem>
                      </SideMenuSubMenu>
                    </div>

                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <MapPin className="h-4 w-4" />
                      <span>지도</span>
                    </a>
                  </nav>
                </SideMenuNav>

                <SideMenuFooter>
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <LogOut className="h-4 w-4" />
                    <span>로그아웃</span>
                  </button>
                </SideMenuFooter>
              </SideMenuContent>
            </>
          )}
        </SideMenu>
      </div>
    </div>
  ),
}
