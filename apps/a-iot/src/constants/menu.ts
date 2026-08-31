import {
  AlertCircle,
  BellRing,
  Building2,
  Cctv,
  Home,
  KeyRound,
  PlugZap,
  Radio,
  Settings,
  Shield,
  TreePine,
  Users,
  Video,
} from 'lucide-react'

export interface MenuItem {
  title: string
  icon: React.ComponentType<{ className?: string }>
  path?: string
  children?: MenuItem[]
  /** true 이면 ADMIN 역할 보유자에게만 노출 */
  adminOnly?: boolean
  /** true 이면 권한과 무관하게 메뉴에서 숨김 (라우트도 함께 비활성화할 것) */
  hidden?: boolean
}

export const MAIN_MENU_ITEMS: MenuItem[] = [
  {
    title: '대시보드',
    icon: Home,
    path: '/',
  },
  {
    title: '이벤트',
    icon: AlertCircle,
    path: '/events',
  },
  {
    title: 'IoT 센서',
    icon: Radio,
    path: '/iot-sensors',
  },
  {
    // 2026-08-31 임시 숨김 — 라우트도 App.tsx 에서 비활성화됨
    title: 'CCTV 모니터링',
    icon: Cctv,
    path: '/cctv-monitoring',
    hidden: true,
  },
]

export const REALTIME_ALARM_MENU: MenuItem = {
  title: '실시간 알람',
  icon: BellRing,
}

export const ADMIN_MENU_ITEMS: MenuItem[] = [
  {
    title: '시설 관리',
    icon: Building2,
    adminOnly: true,
    children: [
      {
        title: '공원 관리',
        icon: TreePine,
        path: '/sites/parks',
      },
      {
        title: 'IoT 센서 관리',
        icon: Radio,
        path: '/devices/sensor-categories',
      },
      {
        title: 'CCTV 관리',
        icon: Video,
        path: '/devices/cctv',
      },
    ],
  },
  {
    title: '사용자 관리',
    icon: Users,
    adminOnly: true,
    children: [
      {
        title: '사용자 관리',
        icon: Users,
        path: '/users',
      },
      {
        title: '역할 관리',
        icon: Shield,
        path: '/users/roles',
      },
      {
        title: '권한 관리',
        icon: KeyRound,
        path: '/users/permissions',
      },
    ],
  },
  {
    title: '시스템 관리',
    icon: Settings,
    adminOnly: true,
    children: [
      {
        title: 'Mobius 연동 관리',
        icon: PlugZap,
        path: '/system/mobius',
      },
    ],
  },
]

export const MENU_ITEMS: MenuItem[] = [
  ...MAIN_MENU_ITEMS,
  REALTIME_ALARM_MENU,
  ...ADMIN_MENU_ITEMS,
]

/** GNB용 통합 메뉴 (상단 네비게이션 바) */
export const GNB_MENU_ITEMS: MenuItem[] = [...MAIN_MENU_ITEMS, ...ADMIN_MENU_ITEMS]
