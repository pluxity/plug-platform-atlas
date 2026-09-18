import { useState } from 'react'
import { getCoordinateEditState, type AiEdgeDevice, type CoordinateDraft } from '@/lib/ai-edge-device'
import DeviceTableRow from './DeviceTableRow'

interface Props {
  devices: AiEdgeDevice[]
  selectedKey: string | null
  onSelect: (device: AiEdgeDevice) => void
  onSaveCoordinates?: (device: AiEdgeDevice, lon: number, lat: number) => Promise<boolean>
  updating: boolean
  compact?: boolean
}

export default function DeviceTable({ devices, selectedKey, onSelect, onSaveCoordinates, updating, compact = false }: Props) {
  const [coordinateDrafts, setCoordinateDrafts] = useState<Record<string, CoordinateDraft>>({})
  const extraColumn = compact ? 'hidden' : 'hidden xl:table-cell'
  const saveCoordinates = async (device: AiEdgeDevice, value: CoordinateDraft) => {
    const { position, changed } = getCoordinateEditState(value, device.position)
    if (!position || !changed || !onSaveCoordinates || updating || device.kind !== 'CCTV') return
    if (await onSaveCoordinates(device, position.longitude, position.latitude)) {
      setCoordinateDrafts(current => {
        if (current[device.key]?.lon !== value.lon || current[device.key]?.lat !== value.lat) return current
        const next = { ...current }
        delete next[device.key]
        return next
      })
    }
  }
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full min-w-[520px] table-fixed text-sm">
        <caption className="sr-only">AI EDGE 디바이스 목록</caption>
        <thead className="bg-muted/50 text-muted-foreground">
          <tr>
            <th scope="col" className="hidden w-16 px-2 py-3 text-left font-medium sm:table-cell">종류</th>
            <th scope="col" className="px-2 py-3 text-left font-medium">장비 / 업체 ID</th>
            <th scope="col" className={`${extraColumn} w-24 px-2 py-3 text-left font-medium`}>상태</th>
            <th scope="col" className={`${extraColumn} w-[16%] px-2 py-3 text-left font-medium`}>공원</th>
            <th scope="col" className="w-32 px-2 py-3 text-left font-medium">위도</th>
            <th scope="col" className="w-32 px-2 py-3 text-left font-medium">경도</th>
            <th scope="col" className="w-18 px-2 py-3 text-center font-medium">작업</th>
          </tr>
        </thead>
        <tbody>{devices.map(device => {
          const value = coordinateDrafts[device.key] ?? {
            lon: device.position ? String(device.position.longitude) : '',
            lat: device.position ? String(device.position.latitude) : '',
          }
          return (
            <DeviceTableRow
              key={device.key} device={device} value={value}
              selected={selectedKey === device.key} compact={compact} updating={updating}
              editable={!!onSaveCoordinates && device.kind === 'CCTV'}
              onSelect={() => onSelect(device)}
              onChange={draft => setCoordinateDrafts(current => ({ ...current, [device.key]: draft }))}
              onSave={() => void saveCoordinates(device, value)}
            />
          )
        })}</tbody>
      </table>
      {devices.length === 0 && <p role="status" className="p-8 text-center text-sm text-muted-foreground">조건에 맞는 디바이스가 없습니다.</p>}
    </div>
  )
}
