import type { Meta, StoryObj } from '@storybook/react'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from './navigation-menu.component'
import { cn } from '../../lib/utils'

const meta: Meta<typeof NavigationMenu> = {
  title: 'Organisms/Navigation Menu',
  component: NavigationMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '계층형 네비게이션 메뉴 컴포넌트입니다. 드롭다운 메뉴와 메가 메뉴를 지원하며 키보드 네비게이션과 접근성을 제공합니다.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof NavigationMenu>

const ListItem = ({
  className,
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<'a'> & { title: string }) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          href={href}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>시작하기</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary-500/50 to-primary-600/50 p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium text-white">
                      @plug-atlas/ui
                    </div>
                    <p className="text-sm leading-tight text-white/90">
                      관제 시스템을 위한 UI 컴포넌트 라이브러리
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="소개">
                라이브러리 소개 및 시작 가이드
              </ListItem>
              <ListItem href="/docs/installation" title="설치">
                프로젝트에 설치하고 설정하는 방법
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="타이포그래피">
                텍스트 스타일과 계층 구조
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>컴포넌트</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem title="Alert" href="/docs/components/alert">
                경고 및 알림 메시지를 표시합니다
              </ListItem>
              <ListItem title="Button" href="/docs/components/button">
                사용자 액션을 트리거하는 버튼
              </ListItem>
              <ListItem title="Card" href="/docs/components/card">
                콘텐츠를 담는 카드 컨테이너
              </ListItem>
              <ListItem title="Dialog" href="/docs/components/dialog">
                모달 형태의 대화상자
              </ListItem>
              <ListItem title="Input" href="/docs/components/input">
                텍스트 입력 필드
              </ListItem>
              <ListItem title="Select" href="/docs/components/select">
                드롭다운 선택 메뉴
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/docs"
            className={navigationMenuTriggerStyle()}
          >
            문서
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}

export const Simple: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/"
            className={navigationMenuTriggerStyle()}
          >
            홈
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/about"
            className={navigationMenuTriggerStyle()}
          >
            소개
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/contact"
            className={navigationMenuTriggerStyle()}
          >
            연락처
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>대시보드</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
              <ListItem title="📊 실시간 모니터링" href="/dashboard/monitoring">
                시스템 상태를 실시간으로 모니터링합니다
              </ListItem>
              <ListItem title="📈 통계" href="/dashboard/statistics">
                데이터 분석 및 통계 정보를 확인합니다
              </ListItem>
              <ListItem title="⚙️ 설정" href="/dashboard/settings">
                시스템 설정을 관리합니다
              </ListItem>
              <ListItem title="👥 사용자 관리" href="/dashboard/users">
                사용자 계정을 관리합니다
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>지도</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              <ListItem title="🗺️ 전체 지도" href="/map/overview">
                전체 지역을 한눈에 확인합니다
              </ListItem>
              <ListItem title="📍 관심 지점" href="/map/poi">
                관심 지점을 관리합니다
              </ListItem>
              <ListItem title="🛣️ 경로 분석" href="/map/routes">
                최적 경로를 분석합니다
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}

export const MultiColumn: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>제품</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[600px] gap-3 p-4 md:grid-cols-3">
              <div className="space-y-3">
                <p className="text-sm font-medium leading-none px-3 py-2">관제</p>
                <ListItem title="실시간 모니터링" href="/products/monitoring">
                  24/7 실시간 관제
                </ListItem>
                <ListItem title="이벤트 관리" href="/products/events">
                  이벤트 추적 및 관리
                </ListItem>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium leading-none px-3 py-2">분석</p>
                <ListItem title="데이터 분석" href="/products/analytics">
                  심층 데이터 분석
                </ListItem>
                <ListItem title="리포트" href="/products/reports">
                  맞춤형 리포트 생성
                </ListItem>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium leading-none px-3 py-2">설정</p>
                <ListItem title="시스템 설정" href="/products/settings">
                  시스템 환경 설정
                </ListItem>
                <ListItem title="권한 관리" href="/products/permissions">
                  사용자 권한 관리
                </ListItem>
              </div>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}