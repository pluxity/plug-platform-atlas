// ── ivxWPlayer 타입 선언 (런타임에 dynamic import) ──

export interface IvxWsParams {
  stream_mode: 'relay'
  stream_type: 'live' | 'record'
  session: string
  url: string
  auth_key: string
  access_key: string
}

export interface IvxEnvParams {
  canvas: HTMLCanvasElement
  pannel?: HTMLCanvasElement | null
  status?: (stat: string, msg: unknown, id?: string, player?: unknown) => void
  id?: string
  lang?: 'KR' | 'EN'
  async_mode?: boolean
  meta_mode?: 'none' | 'event' | 'all'
  eventzone?: boolean
}

export interface IVXMediaPlayerInstance {
  Play(): void
  Stop(): void
  Pause(): void
  Resume(): void
  Seek(seekTime: string): void
  GetSpeed(direction?: string): number
  SetSpeed(speed: number, direction?: string): void
  GetDirection(): string
  SetDirection(mode: 'forward' | 'backward'): void
  SetResizeWindow(width: number, height: number): void
  SetMetaMode(mode: string): void
  EnableDrawMetaEvtZone(flag: boolean): void
  Release(): void
}

export type IVXMediaPlayerConstructor = new (
  wsParams: IvxWsParams,
  envParams: IvxEnvParams,
) => IVXMediaPlayerInstance

/** ivxWPlayer를 public/ 디렉토리에서 dynamic import */
export async function loadIvxPlayer(): Promise<{
  IVXMediaPlayer: IVXMediaPlayerConstructor
}> {
  const basePath = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/')
  const module = await import(
    /* @vite-ignore */ `${basePath}ivx-wplayer/index.js`
  )
  return module
}
