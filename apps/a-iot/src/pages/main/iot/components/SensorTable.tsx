import { useState } from 'react'
import type { FeatureResponse } from '@/services/types'
import { getHeightEditState } from '@/lib/sensor-edit'
import SensorTableRow from './SensorTableRow'

interface Props {
  sensors: FeatureResponse[]
  selectedId?: number
  compact: boolean
  updating: boolean
  onSelect: (sensor: FeatureResponse) => void
  onToggle: (id: number, active: boolean) => void
  onSaveHeight: (id: number, height: number) => Promise<boolean>
}

export default function SensorTable({ sensors, selectedId, compact, updating, onSelect, onToggle, onSaveHeight }: Props) {
  const [heightDrafts, setHeightDrafts] = useState<Record<number, string>>({})
  const extra = compact ? 'hidden' : 'hidden xl:table-cell'
  const saveHeight = async (sensor: FeatureResponse, value: string) => {
    const { height, changed } = getHeightEditState(value, sensor.height)
    if (updating || !changed) return
    if (await onSaveHeight(sensor.id, height)) {
      setHeightDrafts(current => {
        if (current[sensor.id] !== value) return current
        const next = { ...current }
        delete next[sensor.id]
        return next
      })
    }
  }
  return <div className="overflow-x-auto rounded-md border">
    <table className="w-full min-w-[520px] table-fixed text-sm">
      <caption className="sr-only">IoT 센서 목록</caption>
      <thead className="bg-muted/50 text-muted-foreground"><tr>
        <th scope="col" className={`${extra} w-16 px-2 py-3 text-left font-medium`}>번호</th>
        <th scope="col" className="px-2 py-3 text-left font-medium">센서 / 디바이스 ID</th>
        <th scope="col" className={`${extra} w-[14%] px-2 py-3 text-left font-medium`}>공원</th>
        <th scope="col" className="w-32 px-2 py-3 text-left font-medium">위도 / 경도</th>
        <th scope="col" className={`${extra} w-24 px-2 py-3 text-left font-medium`}>이벤트 상태</th>
        <th scope="col" className={`${extra} w-28 px-2 py-3 text-left font-medium`}>배터리 잔량</th>
        <th scope="col" className="w-24 whitespace-nowrap px-2 py-3 text-right font-medium">고도 (m)</th>
        <th scope="col" className="w-16 px-2 py-3 text-left font-medium">활성화</th>
        <th scope="col" className="w-18 px-2 py-3 text-center font-medium">작업</th>
      </tr></thead>
      <tbody>{sensors.map(sensor => {
        const height = heightDrafts[sensor.id] ?? String(sensor.height ?? 0)
        return (
          <SensorTableRow
            key={sensor.id} sensor={sensor} height={height}
            selected={selectedId === sensor.id} compact={compact} updating={updating}
            onSelect={() => onSelect(sensor)}
            onHeightChange={value => setHeightDrafts(current => ({ ...current, [sensor.id]: value }))}
            onToggle={active => onToggle(sensor.id, active)}
            onSave={() => void saveHeight(sensor, height)}
          />
        )
      })}</tbody>
    </table>
    {!sensors.length && <p role="status" className="p-8 text-center text-sm text-muted-foreground">조건에 맞는 센서가 없습니다.</p>}
  </div>
}
