/**
 * 안내방송 송출 이력 타입
 *
 * `GET /announcements`의 응답 모양이다.
 *
 * ⚠️ 현재 응답에 채널(LED/TTS) 구분이 없다. site + message 만 있어
 * "어디에 무엇을 보냈다"까지만 알 수 있고 "무엇으로 보냈다"는 모른다.
 * 백엔드에 채널 필드가 생기면 여기에 추가한다.
 *
 * ⚠️ 이 엔드포인트는 GET 에 인증이 걸려 있지 않다(POST 는 403).
 * 화면에서 공원 필터를 걸어도 보안 경계가 되지 못한다. 백엔드 수정이 필요하다.
 */
import type { Site } from './site'

export interface Announcement {
  id: number
  /** 송출한 메시지 본문 */
  message: string
  /** 송출자 계정명 */
  userId: string
  site: Site
  createdAt: string
}

/** 서버 페이징 응답 (page 는 1-base) */
export interface AnnouncementPage {
  content: Announcement[]
  pageNumber: number
  pageSize: number
  totalElements: number
  first: boolean
  last: boolean
}

export interface AnnouncementQueryParams {
  /** 1-base */
  page?: number
  size?: number
  /** 공원 필터. 없으면 전체 */
  siteId?: number
}
