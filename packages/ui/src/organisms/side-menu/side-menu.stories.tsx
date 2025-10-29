import type { Meta, StoryObj } from '@storybook/react'
import {
  SideMenu,
  SideMenuTrigger,
  SideMenuContent,
  SideMenuLogo,
  SideMenuHeader,
  SideMenuNav,
  SideMenuFooter,
} from './side-menu.component'
import { Menu, Home, Settings, Users, FileText, BarChart, LogOut } from 'lucide-react'

const meta: Meta<typeof SideMenu> = {
  title: 'Organisms/SideMenu',
  component: SideMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Figma의 좌측 상단 메뉴처럼 드롭다운 방식으로 동작하는 떠있는(floating) 스타일의 메뉴 컴포넌트입니다. 버튼을 클릭하면 메뉴가 나타나고, 외부 클릭 시 자동으로 닫힙니다.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof SideMenu>

export const Default: Story = {
  render: () => (
    <div className="flex items-start p-8">
      <SideMenu>
        <SideMenuTrigger className="p-2">
          <Menu className="h-6 w-6" />
        </SideMenuTrigger>
        <SideMenuContent>
          <SideMenuLogo>
            <div className="text-lg font-bold text-blue-600">MyApp</div>
          </SideMenuLogo>

          <SideMenuHeader>
            <h2 className="text-sm font-semibold text-gray-700">메뉴</h2>
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
      </SideMenu>
    </div>
  ),
}

export const WithActiveState: Story = {
  render: () => (
    <div className="flex items-start p-8">
      <SideMenu>
        <SideMenuTrigger className="p-2">
          <Menu className="h-6 w-6" />
        </SideMenuTrigger>
        <SideMenuContent>
          <SideMenuLogo>
            <div className="text-lg font-bold text-blue-600">MyApp</div>
          </SideMenuLogo>

          <SideMenuHeader>
            <h2 className="text-sm font-semibold text-gray-700">메뉴</h2>
          </SideMenuHeader>

          <SideMenuNav>
            <nav className="space-y-1">
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600"
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
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">U</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">사용자</div>
                <div className="text-xs text-gray-500">user@example.com</div>
              </div>
            </div>
          </SideMenuFooter>
        </SideMenuContent>
      </SideMenu>
    </div>
  ),
}

export const WithLongContent: Story = {
  render: () => (
    <div className="flex items-start p-8">
      <SideMenu>
        <SideMenuTrigger className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <div className="flex items-center gap-2 px-2">
            <Menu className="h-5 w-5" />
            <span className="text-sm font-medium">메뉴 열기</span>
          </div>
        </SideMenuTrigger>
        <SideMenuContent>
          <SideMenuLogo>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                <span className="text-sm font-bold text-white">M</span>
              </div>
              <span className="text-lg font-bold text-gray-900">MyApp</span>
            </div>
          </SideMenuLogo>

          <SideMenuNav>
            <nav className="space-y-1">
              {[
                { icon: Home, label: '대시보드', active: true },
                { icon: Users, label: '사용자 관리', active: false },
                { icon: FileText, label: '문서 관리', active: false },
                { icon: BarChart, label: '통계 및 분석', active: false },
                { icon: Settings, label: '시스템 설정', active: false },
                { icon: FileText, label: '보고서', active: false },
                { icon: Users, label: '팀 관리', active: false },
                { icon: BarChart, label: '성과 분석', active: false },
                { icon: Settings, label: '계정 설정', active: false },
              ].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                    item.active
                      ? 'bg-blue-50 font-medium text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          </SideMenuNav>

          <SideMenuFooter>
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-2 py-1">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">JD</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">홍길동</div>
                  <div className="text-xs text-gray-500 truncate">hong@example.com</div>
                </div>
              </div>
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                <span>로그아웃</span>
              </button>
            </div>
          </SideMenuFooter>
        </SideMenuContent>
      </SideMenu>
    </div>
  ),
}

export const DarkMode: Story = {
  render: () => (
    <div className="flex items-start p-8 bg-gray-900 min-h-[400px]">
      <SideMenu>
        <SideMenuTrigger className="p-2 text-white">
          <Menu className="h-6 w-6" />
        </SideMenuTrigger>
        <SideMenuContent className="bg-gray-800 border-gray-700">
          <SideMenuLogo className="border-gray-700">
            <div className="text-lg font-bold text-blue-400">MyApp</div>
          </SideMenuLogo>

          <SideMenuHeader className="border-gray-700">
            <h2 className="text-sm font-semibold text-gray-300">메뉴</h2>
          </SideMenuHeader>

          <SideMenuNav>
            <nav className="space-y-1">
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg bg-blue-900/50 px-3 py-2 text-sm font-medium text-blue-300"
              >
                <Home className="h-4 w-4" />
                <span>홈</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                <Users className="h-4 w-4" />
                <span>사용자</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                <FileText className="h-4 w-4" />
                <span>문서</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                <BarChart className="h-4 w-4" />
                <span>통계</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                <Settings className="h-4 w-4" />
                <span>설정</span>
              </a>
            </nav>
          </SideMenuNav>

          <SideMenuFooter className="border-gray-700">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-900 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-300">U</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-200">사용자</div>
                <div className="text-xs text-gray-400">user@example.com</div>
              </div>
            </div>
          </SideMenuFooter>
        </SideMenuContent>
      </SideMenu>
    </div>
  ),
}
