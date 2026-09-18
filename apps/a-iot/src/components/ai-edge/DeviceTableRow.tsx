import { Badge, Button, Input } from '@plug-atlas/ui'
import { Camera, Mic } from 'lucide-react'
import { getCoordinateEditState, getDeviceStatus, type AiEdgeDevice, type CoordinateDraft } from '@/lib/ai-edge-device'

interface Props {
  device: AiEdgeDevice
  value: CoordinateDraft
  selected: boolean
  compact: boolean
  editable: boolean
  updating: boolean
  onSelect: () => void
  onChange: (value: CoordinateDraft) => void
  onSave: () => void
}

export default function DeviceTableRow({ device, value, selected, compact, editable, updating, onSelect, onChange, onSave }: Props) {
  const extraColumn = compact ? 'hidden' : 'hidden xl:table-cell'
  const { changed } = getCoordinateEditState(value, device.position)
  const statusLabel = getDeviceStatus(device.status).label

  const coordinateCell = (axis: keyof CoordinateDraft) => {
    if (!editable) {
      if (!device.position) return '위치 미등록'
      const coordinate = axis === 'lat' ? device.position.latitude : device.position.longitude
      return coordinate.toFixed(6)
    }
    const limit = axis === 'lat' ? 90 : 180
    return (
      <Input
        type="number" step="any" min={-limit} max={limit}
        className="h-8 min-w-0 px-2 text-xs!"
        aria-label={`${device.name} ${axis === 'lat' ? '위도' : '경도'}`}
        value={value[axis]} disabled={updating}
        onChange={event => onChange({ ...value, [axis]: event.target.value })}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            event.preventDefault()
            onSave()
          }
        }}
      />
    )
  }

  return (
    <tr className={`h-16 border-t ${selected ? 'bg-accent' : 'hover:bg-muted/30'}`}>
      <td className="hidden px-2 sm:table-cell">
        <span className="flex flex-col items-start gap-1 text-xs">
          {device.kind === 'CCTV' ? <Camera className="size-4" /> : <Mic className="size-4" />}
          {device.kind}
        </span>
      </td>
      <td className="px-2">
        <button type="button" onClick={onSelect} title={device.name} className="block w-full truncate text-left font-medium text-primary underline-offset-4 hover:underline focus-visible:underline">
          {device.name}
        </button>
        <div className="mt-1 flex min-w-0 items-center gap-2">
          <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground" title={device.externalId}>
            {device.externalId}
          </p>
          <Badge variant="outline" className={`shrink-0 text-[10px] ${compact ? '' : 'xl:hidden'}`}>
            {statusLabel}
          </Badge>
        </div>
      </td>
      <td className={`${extraColumn} px-2`}><Badge variant="outline">{statusLabel}</Badge></td>
      <td className={`${extraColumn} truncate px-2`} title={device.site?.name ?? '공원 미매핑'}>
        {device.site?.name ?? '공원 미매핑'}
      </td>
      {(['lat', 'lon'] as const).map(axis => (
        <td key={axis} className="px-2 text-xs tabular-nums">{coordinateCell(axis)}</td>
      ))}
      <td className="px-1 text-center">
        <Button
          size="sm" variant="outline" onClick={onSave}
          aria-label={`${device.name} 저장`} disabled={!editable || !changed || updating}
          title={device.kind === 'MIC' ? '업체에서 정보를 변경한 후 MIC 동기화로 반영하세요.' : undefined}
        >
          저장
        </Button>
      </td>
    </tr>
  )
}
