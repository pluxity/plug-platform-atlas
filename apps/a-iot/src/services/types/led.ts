/**
 * LED 전광판 도메인 타입 — 프론트가 먼저 확정한 API 계약
 *
 * ⚠️ 백엔드(aiot-api #24 장치관리 / #25 프리셋 / #26 송출)가 아직 미구현이고,
 * 해당 이슈에 "엔드포인트 경로·스키마는 백엔드 재량"으로 적혀 있다.
 * 여기 정의한 모양이 프론트가 필요로 하는 최소 계약이며, 백엔드 구현 시
 * 이 파일을 기준으로 맞추거나 어긋나는 부분만 조정한다.
 *
 * 하드웨어 업체 API 스펙이 미수령 상태라, 업체 스펙에 종속되는 필드
 * (LedDisplayOptions)는 최소한으로만 두고 잠정 표시했다.
 */

/**
 * 전광판 1대.
 *
 * 스마트폴 1대에 전광판 1대가 달리는 구조라 별도 엔티티로 나누지 않고
 * 하나로 본다. 나중에 폴 1대에 면이 여러 개 붙는 형태로 바뀌면
 * poleId 를 추가해 상위 그룹을 만든다.
 */
export interface LedPanel {
  id: number
  /** 전광판 명칭 (예: "중앙공원 정문") */
  name: string
  /** 소속 공원 */
  siteId: number
  siteName: string
  /** 설치 위치 설명 */
  location: string
  /** 업체 장비 식별자 — 실제 송출 시 업체 API 에 넘어가는 값 */
  deviceCode: string
  status: LedPanelStatus
}

export type LedPanelStatus = 'ONLINE' | 'OFFLINE' | 'UNKNOWN'

/**
 * 표출 옵션.
 *
 * ⚠️ 잠정. 하드웨어 업체 API 스펙 수령 전이라 LED 사이니지에서 사실상
 * 공통인 두 가지만 뒀다. 스펙이 오면 그때 확장한다.
 */
export interface LedDisplayOptions {
  /** 한 번 표출을 유지할 시간(초) */
  durationSeconds: number
  /** 반복 횟수 */
  repeatCount: number
}

export const DEFAULT_DISPLAY_OPTIONS: LedDisplayOptions = {
  durationSeconds: 10,
  repeatCount: 3,
}

/** 메시지 프리셋 */
export interface LedPreset {
  id: number
  title: string
  content: string
  displayOptions: LedDisplayOptions
  createdAt: string
  createdBy: string
  updatedAt?: string
}

export interface LedPresetCreateRequest {
  title: string
  content: string
  displayOptions: LedDisplayOptions
}

export type LedPresetUpdateRequest = LedPresetCreateRequest

/**
 * 송출 요청.
 *
 * 프리셋을 골라 보내는 경우에도 content 를 그대로 실어 보낸다.
 * 서버가 presetId 만 받아 본문을 조회하는 방식이면, 나중에 프리셋을
 * 수정했을 때 과거 송출 이력의 본문까지 바뀌어 버린다.
 * presetId 는 "어디서 온 문구인지" 추적용으로만 쓴다.
 */
export interface LedDispatchRequest {
  panelIds: number[]
  content: string
  /** 프리셋에서 왔으면 그 id, 직접 입력이면 null */
  presetId: number | null
  displayOptions: LedDisplayOptions
}

/** 전광판 1대에 대한 송출 결과 */
export interface LedDispatchPanelResult {
  panelId: number
  panelName: string
  success: boolean
  /** 실패 사유 (성공 시 없음) */
  message?: string
}

export interface LedDispatchResult {
  dispatchId: number
  dispatchedAt: string
  results: LedDispatchPanelResult[]
}

/** 메시지 본문 제한 — 전광판 특성상 짧아야 한다 */
export const LED_CONTENT_MAX_LENGTH = 200
export const LED_TITLE_MAX_LENGTH = 50
