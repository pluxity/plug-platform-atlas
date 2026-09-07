import {
  AlertCircle,
  BellRing,
  Building2,
  Cctv,
  History,
  Home,
  KeyRound,
  PlugZap,
  MonitorSpeaker,
  Radio,
  ScrollText,
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
  {
    /*
     * 안내방송 — 운영 행위라 MAIN 레벨에 둔다(대시보드·이벤트·IoT 센서와 같은 레벨).
     *
     * 시설 관리 아래가 아닌 이유:
     * 시설 관리는 전부 adminOnly 인데, 송출은 "공원 접근 권한이 있는 사람"이
     * 하는 일이라 ADMIN 이 아닌 공원 담당자도 써야 한다. 아래에 두면 못 쓴다.
     * 전광판 "장치 등록"은 반대로 ADMIN 전용이라 시설 관리에 있다.
     * CCTV 가 이미 같은 선으로 갈려 있다 — CCTV 관리(시설관리) vs CCTV 모니터링(MAIN).
     *
     * 송출·프리셋은 아직 목업이다(백엔드 aiot-api #24~#26 미구현).
     * 송출 이력은 실제 API 를 쓴다(GET /announcements, #16 완료).
     * TTS 화면(#105~#107)도 여기로 들어온다.
     */
    title: '안내방송',
    icon: MonitorSpeaker,
    children: [
      {
        title: 'LED 메시지 송출',
        icon: MonitorSpeaker,
        path: '/announcement/led/dispatch',
      },
      {
        title: 'LED 메시지 프리셋',
        icon: ScrollText,
        path: '/announcement/led/presets',
      },
      {
        title: '송출 이력',
        icon: History,
        path: '/announcement/history',
      },
    ],
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
      {
        // 전광판 장치 등록·수정·삭제 (a-iot #101). 화면 미구현 — 자리만 잡아 둔다.
        // 메시지 송출과 달리 장치 관리는 ADMIN 전용이라 여기가 맞다.
        title: 'LED 전광판 관리',
        icon: MonitorSpeaker,
        path: '/devices/led-panels',
        hidden: true,
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
