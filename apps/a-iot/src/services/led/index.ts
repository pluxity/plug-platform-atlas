/**
 * LED 전광판 API 진입점 — 목업/실 구현 스위치가 있는 유일한 곳
 *
 * ┌─ 백엔드 연동 시 할 일 ────────────────────────────────────┐
 * │ 1. USE_MOCK 을 false 로 바꾼다                            │
 * │ 2. 아래 mock import 한 줄과 ledApi.mock.ts 파일을 지운다  │
 * │ 3. 삼항연산자를 realLedApi 로 바꾼다                      │
 * │                                                           │
 * │ 화면·훅은 여기서 내보내는 ledApi 만 보므로 손댈 곳이 없다.│
 * └───────────────────────────────────────────────────────────┘
 */
import { realLedApi } from './ledApi.real'
// ⚠️ 목업 — 백엔드 연동 시 이 줄과 ledApi.mock.ts 를 삭제한다
import { mockLedApi } from './ledApi.mock'
import type { LedApi } from './ledApi.types'

/** 백엔드(aiot-api #24·#25·#26)가 준비되면 false */
export const USE_MOCK = true

export const ledApi: LedApi = USE_MOCK ? mockLedApi : realLedApi

export type { LedApi } from './ledApi.types'
export { LED_ENDPOINTS } from './ledApi.types'
