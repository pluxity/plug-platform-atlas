import type { Meta, StoryObj } from '@storybook/react'
import {
  SideMenu,
  SideMenuLogo,
  SideMenuContent,
  SideMenuHeader,
  SideMenuNav,
  SideMenuFooter,
} from './side-menu.component'
import { Home, Settings, Users, FileText, BarChart } from 'lucide-react'

const meta: Meta<typeof SideMenu> = {
  title: 'Organisms/SideMenu',
  component: SideMenu,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '사이드 메뉴 컴포넌트입니다. 로고, 헤더, 네비게이션, 푸터 영역으로 구성됩니다.',
      },
      story: {
        inline: false,
        iframeHeight: 600,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof SideMenu>

export const Default: Story = {
  render: () => (
    <div className="flex h-screen">
      <SideMenu className="w-64 border-r bg-white">
        <SideMenuLogo>
          <div className="text-xl font-bold text-blue-600">Logo</div>
        </SideMenuLogo>

        <SideMenuContent>
          <SideMenuHeader>
            <h2 className="text-sm font-semibold text-gray-600">메뉴</h2>
          </SideMenuHeader>

          <SideMenuNav>
            <nav className="space-y-1">
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
              >
                <Home className="h-5 w-5" />
                <span>홈</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
              >
                <Users className="h-5 w-5" />
                <span>사용자</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
              >
                <FileText className="h-5 w-5" />
                <span>문서</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
              >
                <BarChart className="h-5 w-5" />
                <span>통계</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
              >
                <Settings className="h-5 w-5" />
                <span>설정</span>
              </a>
            </nav>
          </SideMenuNav>

          <SideMenuFooter>
            <div className="text-xs text-gray-500">© 2025 Company</div>
          </SideMenuFooter>
        </SideMenuContent>
      </SideMenu>

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">메인 컨텐츠</h1>
        <p className="mt-4 text-gray-600">
          사이드 메뉴와 함께 사용되는 메인 컨텐츠 영역입니다.
        </p>
      </div>
    </div>
  ),
}

export const WithActiveState: Story = {
  render: () => (
    <div className="flex h-screen">
      <SideMenu className="w-64 border-r bg-white">
        <SideMenuLogo>
          <div className="text-xl font-bold text-blue-600">Logo</div>
        </SideMenuLogo>

        <SideMenuContent>
          <SideMenuHeader>
            <h2 className="text-sm font-semibold text-gray-600">메뉴</h2>
          </SideMenuHeader>

          <SideMenuNav>
            <nav className="space-y-1">
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2 text-blue-600"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">홈</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
              >
                <Users className="h-5 w-5" />
                <span>사용자</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
              >
                <FileText className="h-5 w-5" />
                <span>문서</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
              >
                <BarChart className="h-5 w-5" />
                <span>통계</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
              >
                <Settings className="h-5 w-5" />
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

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">메인 컨텐츠</h1>
        <p className="mt-4 text-gray-600">
          활성 상태가 표시된 사이드 메뉴 예제입니다.
        </p>
      </div>
    </div>
  ),
}

export const Compact: Story = {
  render: () => (
    <div className="flex h-screen">
      <SideMenu className="w-16 border-r bg-white">
        <SideMenuLogo>
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-sm font-bold text-white">L</span>
          </div>
        </SideMenuLogo>

        <SideMenuContent>
          <SideMenuNav className="px-2">
            <nav className="space-y-2">
              <a
                href="#"
                className="flex items-center justify-center rounded-lg bg-blue-50 p-3 text-blue-600"
                title="홈"
              >
                <Home className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center rounded-lg p-3 text-gray-700 hover:bg-gray-100"
                title="사용자"
              >
                <Users className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center rounded-lg p-3 text-gray-700 hover:bg-gray-100"
                title="문서"
              >
                <FileText className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center rounded-lg p-3 text-gray-700 hover:bg-gray-100"
                title="통계"
              >
                <BarChart className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center rounded-lg p-3 text-gray-700 hover:bg-gray-100"
                title="설정"
              >
                <Settings className="h-5 w-5" />
              </a>
            </nav>
          </SideMenuNav>
        </SideMenuContent>
      </SideMenu>

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">메인 컨텐츠</h1>
        <p className="mt-4 text-gray-600">
          컴팩트한 사이드 메뉴 예제입니다. 아이콘만 표시됩니다.
        </p>
      </div>
    </div>
  ),
}

export const DarkMode: Story = {
  render: () => (
    <div className="flex h-screen bg-gray-900">
      <SideMenu className="w-64 border-r border-gray-800 bg-gray-950">
        <SideMenuLogo>
          <div className="text-xl font-bold text-blue-400">Logo</div>
        </SideMenuLogo>

        <SideMenuContent>
          <SideMenuHeader>
            <h2 className="text-sm font-semibold text-gray-400">메뉴</h2>
          </SideMenuHeader>

          <SideMenuNav>
            <nav className="space-y-1">
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg bg-blue-900/50 px-3 py-2 text-blue-300"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">홈</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800"
              >
                <Users className="h-5 w-5" />
                <span>사용자</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800"
              >
                <FileText className="h-5 w-5" />
                <span>문서</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800"
              >
                <BarChart className="h-5 w-5" />
                <span>통계</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800"
              >
                <Settings className="h-5 w-5" />
                <span>설정</span>
              </a>
            </nav>
          </SideMenuNav>

          <SideMenuFooter className="border-gray-800">
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

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-white">메인 컨텐츠</h1>
        <p className="mt-4 text-gray-400">
          다크 모드 사이드 메뉴 예제입니다.
        </p>
      </div>
    </div>
  ),
}
