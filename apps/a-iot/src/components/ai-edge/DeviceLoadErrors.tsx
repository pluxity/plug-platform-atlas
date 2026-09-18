import { Button } from '@plug-atlas/ui'

interface LoadResult { error?: Error; mutate: () => Promise<unknown> }
export default function DeviceLoadErrors({ cctvs, mics }: { cctvs: LoadResult; mics: LoadResult }) {
  return <>{([['CCTV', cctvs], ['MIC', mics]] as const).map(([label, result]) => result.error && (
    <div key={label} role="alert" className="flex flex-wrap items-center gap-2 rounded-md border border-destructive/30 bg-background px-3 py-2 text-sm">
      <span className="text-destructive">{label} 목록을 불러오지 못했습니다. 권한 또는 연결 상태를 확인하세요.</span>
      <Button size="sm" variant="outline" onClick={() => void result.mutate()}>다시 시도</Button>
    </div>
  ))}</>
}
