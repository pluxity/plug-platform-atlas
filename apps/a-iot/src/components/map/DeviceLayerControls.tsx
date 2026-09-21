import { useEffect, useRef } from 'react'

export interface DeviceLayers { iot: boolean; CCTV: boolean; MIC: boolean }
export type DeviceMapScope = 'all' | 'iot' | 'ai-edge'

export default function DeviceLayerControls({ layers, counts, onChange, scope, parkAreas }: {
  layers: DeviceLayers
  counts: Record<keyof DeviceLayers, number>
  onChange: (layers: DeviceLayers) => void
  scope: DeviceMapScope
  parkAreas?: { visible: boolean; onChange: (visible: boolean) => void }
}) {
  const parentRef = useRef<HTMLInputElement>(null)
  const allEdge = layers.CCTV && layers.MIC
  const someEdge = layers.CCTV !== layers.MIC
  useEffect(() => {
    if (parentRef.current) parentRef.current.indeterminate = someEdge
  }, [someEdge, scope])

  return <fieldset aria-label="장비 지도 레이어" className="absolute bottom-4 left-4 z-10 space-y-2 rounded-md border bg-background/95 p-3 text-xs">
    <legend className="sr-only">장비 지도 레이어</legend>
    <p className="font-medium">장비 범례</p>
    {scope !== 'ai-edge' && <label className="flex items-center gap-2"><input type="checkbox" checked={layers.iot} onChange={event => onChange({ ...layers, iot: event.target.checked })} />IoT 센서 <span className="text-muted-foreground">{counts.iot}</span></label>}
    {scope !== 'iot' && <div className="space-y-2">
      <label className="flex items-center gap-2"><input ref={parentRef} type="checkbox" checked={allEdge} aria-checked={someEdge ? 'mixed' : allEdge} onChange={event => onChange({ ...layers, CCTV: event.target.checked, MIC: event.target.checked })} />AI EDGE 디바이스</label>
      <div role="group" aria-label="AI EDGE 하위 디바이스" className="ml-1.5 space-y-2 border-l pl-4">
        {(['CCTV', 'MIC'] as const).map(kind => <label key={kind} className="flex items-center gap-2"><input type="checkbox" checked={layers[kind]} onChange={event => onChange({ ...layers, [kind]: event.target.checked })} />{kind} <span className="text-muted-foreground">{counts[kind]}</span></label>)}
      </div>
    </div>}
    <p className="text-[10px] text-muted-foreground">위치가 등록된 장비 수</p>
    {parkAreas && <label className="flex items-center gap-2 border-t pt-2"><input type="checkbox" checked={parkAreas.visible} onChange={event => parkAreas.onChange(event.target.checked)} />공원 영역</label>}
  </fieldset>
}
