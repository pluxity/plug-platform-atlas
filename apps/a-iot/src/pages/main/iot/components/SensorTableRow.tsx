import { Badge, Button, Input, Progress, Switch } from '@plug-atlas/ui'
import type { FeatureResponse } from '@/services/types'
import { getDevicePosition } from '@/lib/ai-edge-device'
import { getHeightEditState } from '@/lib/sensor-edit'

interface Props {
  sensor: FeatureResponse
  height: string
  selected: boolean
  compact: boolean
  updating: boolean
  onSelect: () => void
  onHeightChange: (value: string) => void
  onToggle: (active: boolean) => void
  onSave: () => void
}

export default function SensorTableRow({ sensor, height, selected, compact, updating, onSelect, onHeightChange, onToggle, onSave }: Props) {
  const name = sensor.name || sensor.deviceId
  const extra = compact ? 'hidden' : 'hidden xl:table-cell'
  const { changed } = getHeightEditState(height, sensor.height)
  const hasPosition = !!getDevicePosition(sensor.longitude, sensor.latitude)

  return (
    <tr className={`h-16 border-t ${selected ? 'bg-accent' : 'hover:bg-muted/30'}`}>
      <td className={`${extra} px-2`}>{sensor.id}</td>
      <td className="px-2">
        <button className="block w-full truncate text-left font-medium text-primary hover:underline focus-visible:underline" title={name} onClick={onSelect}>
          {name}
        </button>
        <div className="mt-1 flex min-w-0 items-center gap-2">
          <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground" title={`${sensor.deviceId} (${sensor.objectId})`}>
            {sensor.deviceId} ({sensor.objectId})
          </p>
          <Badge variant="outline" className={`shrink-0 text-[10px] ${compact ? '' : 'xl:hidden'}`}>
            {sensor.eventStatus ?? '-'}
          </Badge>
        </div>
      </td>
      <td className={`${extra} truncate px-2`} title={sensor.siteResponse?.name}>
        {sensor.siteResponse?.name ?? '공원 미매핑'}
      </td>
      <td className="px-2 text-xs tabular-nums">
        {hasPosition ? <>
          <div>위도 {sensor.latitude?.toFixed(6)}</div>
          <div>경도 {sensor.longitude?.toFixed(6)}</div>
        </> : '위치 미등록'}
      </td>
      <td className={`${extra} px-2`}>
        <Badge variant="outline" className="max-w-full truncate text-[10px]" title={sensor.eventStatus}>
          {sensor.eventStatus ?? '-'}
        </Badge>
      </td>
      <td className={`${extra} px-2`}>
        {sensor.batteryLevel == null ? '-' : (
          <div className="space-y-1">
            <span className="text-xs">{sensor.batteryLevel}%</span>
            <Progress value={sensor.batteryLevel} className={sensor.batteryLevel <= 20 ? 'h-1.5 [&>div]:bg-destructive' : 'h-1.5'} />
          </div>
        )}
      </td>
      <td className="px-2">
        <Input
          type="number" step="any" className="h-8 px-2 text-right tabular-nums"
          aria-label={`${name} 고도 (m)`} value={height} disabled={updating}
          onChange={event => onHeightChange(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault()
              onSave()
            }
          }}
        />
      </td>
      <td className="px-2">
        <Switch aria-label={`${name} 활성화`} checked={sensor.active ?? false} disabled={updating} onCheckedChange={onToggle} />
      </td>
      <td className="px-1 text-center">
        <Button size="sm" variant="outline" aria-label={`${name} 고도 저장`} disabled={!changed || updating} onClick={onSave}>
          저장
        </Button>
      </td>
    </tr>
  )
}
