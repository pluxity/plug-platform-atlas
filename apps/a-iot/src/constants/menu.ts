import {
  AlertCircle,
  BellRing,
  Building2,
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
]

export const REALTIME_ALARM_MENU: MenuItem = {
  title: '실시간 알람',
  icon: BellRing,
}

export const ADMIN_MENU_ITEMS: MenuItem[] = [
  {
    title: '시설 관리',
    icon: Building2,
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
