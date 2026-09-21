import { Button } from '@plug-atlas/ui'
import { X } from 'lucide-react'
import type { FeatureResponse } from '@/services/types'
import { getDevicePosition } from '@/lib/ai-edge-device'

export default function SensorDetails({ sensor, onClose, onEdit }: { sensor: FeatureResponse; onClose: () => void; onEdit?: () => void }) {
  const position = getDevicePosition(sensor.longitude, sensor.latitude)
  const fields = [
    ['디바이스 ID', sensor.deviceId], ['카테고리', sensor.deviceTypeResponse?.description ?? sensor.objectId],
    ['공원', sensor.siteResponse?.name ?? '공원 미매핑'], ['이벤트 상태', sensor.eventStatus ?? '-'],
    ['배터리', sensor.batteryLevel == null ? '-' : `${sensor.batteryLevel}%`], ['활성화', sensor.active ? '활성' : '비활성'],
    ['위도', position?.latitude.toFixed(6) ?? '-'], ['경도', position?.longitude.toFixed(6) ?? '-'],
    ['고도', `${sensor.height ?? 0} m`],
  ]
  return <section aria-label="센서 상세" className="min-w-0 space-y-3 rounded-md border bg-background p-4">
    <div className="flex items-start justify-between gap-2"><h2 className="min-w-0 truncate font-semibold" title={sensor.name}>{sensor.name || sensor.deviceId}</h2><Button size="icon" variant="ghost" className="size-8 shrink-0" aria-label="센서 상세 닫기" onClick={onClose}><X className="size-4" /></Button></div>
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">{fields.map(([label, value]) => <div key={label} className="contents"><dt className="text-muted-foreground">{label}</dt><dd className="break-all">{value}</dd></div>)}</dl>
    {!position && <p className="text-xs text-muted-foreground">위치가 등록되지 않아 지도에 표시되지 않습니다.</p>}
    {onEdit && <Button size="sm" variant="outline" onClick={onEdit}>센서 정보 수정</Button>}
  </section>
}
