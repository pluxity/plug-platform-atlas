import {
  AlertCircle,
  BellRing,
  Building2,
  CheckCircle,
  History,
  Home,
  KeyRound,
  PlugZap,
  Radio,
  Settings,
  Shield,
  TreePine,
  Users,
  Volume2,
  Video,
} from 'lucide-react'

export interface MenuItem {
  title: string
  icon: React.ComponentType<{ className?: string }>
  path?: string
  children?: MenuItem[]
}

// 모든 사용자가 접근 가능한 메인 메뉴
export const MAIN_MENU_ITEMS: MenuItem[] = [
  {
    title: '대시보드',
    icon: Home,
    path: '/',
  },
  {
    title: '이벤트',
    icon: AlertCircle,
    children: [
      {
        title: '알람 이력',
        icon: History,
        path: '/events/alarm-history',
      },
      {
        title: '조치 이력',
        icon: CheckCircle,
        path: '/events/action-history',
      },
    ],
  },
  {
    title: 'IoT 센서',
    icon: Radio,
    path: '/devices/iot-sensors',
  },
  {
    title: '안내방송',
    icon: Volume2,
    path: '/broadcast',
  },
]

// 실시간 알람 메뉴 (단일 메뉴, 뱃지 표시, Sheet로 표시)
export const REALTIME_ALARM_MENU: MenuItem = {
  title: '실시간 알람',
  icon: BellRing,
}

// 관리자만 접근 가능한 관리 메뉴
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

// 하위 호환성을 위한 기존 export (deprecated)
export const MENU_ITEMS: MenuItem[] = [
  ...MAIN_MENU_ITEMS,
  REALTIME_ALARM_MENU,
  ...ADMIN_MENU_ITEMS,
]
