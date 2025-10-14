import {
  Building2,
  Camera,
  ClipboardList,
  Home,
  KeyRound,
  MapPin,
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

export const MENU_ITEMS: MenuItem[] = [
  {
    title: '대시보드',
    icon: Home,
    path: '/',
  },
  {
    title: '사이트 관리',
    icon: Building2,
    children: [
      {
        title: '공원 관리',
        icon: TreePine,
        path: '/sites/parks',
      },
      {
        title: '가상 순찰 관리',
        icon: MapPin,
        path: '/sites/virtual-patrol',
      },
    ],
  },
  {
    title: '장치 관리',
    icon: Radio,
    children: [
      {
        title: 'IoT 센서 관리',
        icon: Radio,
        path: '/devices/sensors',
      },
      {
        title: 'CCTV 관리',
        icon: Video,
        path: '/devices/cctv',
      },
    ],
  },
  {
    title: '이력 관리',
    icon: ClipboardList,
    children: [
      {
        title: '이벤트 조치 이력',
        icon: Camera,
        path: '/history/events',
      },
    ],
  },
  {
    title: '사용자 관리',
    icon: Users,
    children: [
      {
        title: '사용자',
        icon: Users,
        path: '/users',
      },
      {
        title: '역할',
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
        title: '플랫폼 연동 관리',
        icon: Settings,
        path: '/system/platform',
      },
    ],
  },
]
