import { useState } from 'react'
import { Button, Tabs, TabsList, TabsTrigger, TabsContent } from '@plug-atlas/ui'
import { X } from 'lucide-react'
import { getDeviceStatus, type AiEdgeDevice } from '@/lib/ai-edge-device'
import MicEvents from './MicEvents'

export default function DeviceDetails({ device, onClose, onEdit }: { device: AiEdgeDevice; onClose: () => void; onEdit?: () => void }) {
  const [thresholdPage, setThresholdPage] = useState(1)
  const thresholds = device.kind === 'MIC' ? Object.entries(device.source.thresholds ?? {}) : []
  const thresholdPages = Math.max(1, Math.ceil(thresholds.length / 6))
  const fields = [
    ['종류', device.kind], ['업체 장비 ID', device.externalId],
    ['상태', getDeviceStatus(device.status).label], ['공원', device.site?.name ?? '공원 미매핑'],
    ['위도', device.position?.latitude.toFixed(6) ?? '위치 미등록'], ['경도', device.position?.longitude.toFixed(6) ?? '위치 미등록'],
    ...(device.kind === 'CCTV'
      ? [['카메라 타입', device.source.cameraType], ['IP', device.source.cameraIp]]
      : [['호스트', device.source.host], ['엣지 ID', device.source.edgeId]]),
  ]
  return <section aria-label="장비 상세" className="min-w-0 space-y-3 rounded-md border bg-background p-4">
    <div className="flex items-start justify-between gap-2"><h2 className="min-w-0 truncate font-semibold" title={device.name}>{device.name}</h2><Button variant="ghost" size="icon" className="size-8 shrink-0" aria-label="장비 상세 닫기" onClick={onClose}><X className="size-4" /></Button></div>
    <Tabs defaultValue="info">
      {device.kind === 'MIC' && <TabsList aria-label="MIC 상세 정보" className="mb-2 w-full"><TabsTrigger value="info">기본 정보</TabsTrigger><TabsTrigger value="thresholds">감지 기준값</TabsTrigger><TabsTrigger value="events">감지 이벤트</TabsTrigger></TabsList>}
      <TabsContent value="info" className="space-y-3">
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">{fields.map(([label, value]) => (
      <div key={label} className="contents"><dt className="text-muted-foreground">{label}</dt><dd className="break-all">{value || '-'}</dd></div>
    ))}</dl>
      {device.kind === 'MIC' && <p className="text-xs text-muted-foreground">장비 정보와 위치·감지 기준값은 업체에서 관리합니다. 업체 정보를 변경한 뒤 MIC 동기화로 갱신하세요.{!device.position && ' 현재 설치 위치가 미등록 상태입니다.'}</p>}
      {device.kind === 'CCTV' && onEdit && <Button size="sm" variant="outline" onClick={onEdit}>좌표 수정</Button>}
      </TabsContent>
      {device.kind === 'MIC' && <>
        <TabsContent value="thresholds" className="space-y-3">
          {thresholds.length ? <ul className="divide-y text-xs">{thresholds.slice((thresholdPage - 1) * 6, thresholdPage * 6).map(([name, threshold]) => (
            <li key={name} className="flex flex-wrap justify-between gap-x-2 py-2"><span className="break-all">{name}</span><span className="text-muted-foreground">신뢰도 {threshold.confidence ?? '-'} · 소음 {threshold.sound_level_ge ?? '-'} dB 이상</span></li>
          ))}</ul> : <p className="text-sm text-muted-foreground">등록된 감지 기준값이 없습니다.</p>}
          <nav aria-label="감지 기준값 페이지" className="flex items-center gap-3"><Button size="sm" variant="outline" disabled={thresholdPage <= 1} onClick={() => setThresholdPage(value => value - 1)}>이전</Button><span className="text-xs">{thresholdPage} / {thresholdPages}</span><Button size="sm" variant="outline" disabled={thresholdPage >= thresholdPages} onClick={() => setThresholdPage(value => value + 1)}>다음</Button></nav>
        </TabsContent>
        <TabsContent value="events"><MicEvents key={device.externalId} vendorMicId={device.externalId} /></TabsContent>
      </>}
    </Tabs>
  </section>
}
