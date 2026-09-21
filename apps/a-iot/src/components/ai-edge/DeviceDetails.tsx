import { Button, Tabs, TabsList, TabsTrigger, TabsContent } from '@plug-atlas/ui'
import { X } from 'lucide-react'
import { getDeviceStatus, type AiEdgeDevice } from '@/lib/ai-edge-device'
import MicEvents from './MicEvents'

export default function DeviceDetails({ device, onClose, onEdit }: { device: AiEdgeDevice; onClose: () => void; onEdit?: () => void }) {
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
      {device.kind === 'MIC' && <TabsList aria-label="MIC 상세 정보" className="mb-2 w-full"><TabsTrigger value="info">기본 정보</TabsTrigger><TabsTrigger value="events">감지 이벤트</TabsTrigger></TabsList>}
      <TabsContent value="info" className="space-y-3">
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">{fields.map(([label, value]) => (
      <div key={label} className="contents"><dt className="text-muted-foreground">{label}</dt><dd className="break-all">{value || '-'}</dd></div>
    ))}</dl>
      {device.kind === 'MIC' && <p className="text-xs text-muted-foreground">이벤트 발생 여부는 AI EDGE에서 판단합니다. 장비 정보와 위치는 업체 정보를 변경한 뒤 MIC 동기화로 갱신하세요.{!device.position && ' 현재 설치 위치가 미등록 상태입니다.'}</p>}
      {device.kind === 'CCTV' && onEdit && <Button size="sm" variant="outline" onClick={onEdit}>좌표 수정</Button>}
      </TabsContent>
      {device.kind === 'MIC' && <>
        <TabsContent value="events"><MicEvents key={device.externalId} vendorMicId={device.externalId} /></TabsContent>
      </>}
    </Tabs>
  </section>
}
