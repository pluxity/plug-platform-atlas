import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@plug-atlas/ui'
import { DEVICE_STATUSES, type DeviceFilters as Filters } from '@/lib/ai-edge-device'

interface Props {
  value: Filters
  sites: { id: number; name: string }[]
  onChange: (next: Filters) => void
}

export default function DeviceFilters({ value, sites, onChange }: Props) {
  const selects = [
    { key: 'kind' as const, label: '디바이스 종류', options: [['all', '전체 종류'], ['CCTV', 'CCTV'], ['MIC', 'MIC']] },
    { key: 'site' as const, label: '공원', options: [['all', '전체 공원'], ['unmapped', '공원 미매핑'], ...sites.map(site => [String(site.id), site.name])] },
    { key: 'status' as const, label: '상태', options: [['all', '전체 상태'], ...Object.entries(DEVICE_STATUSES).map(([key, status]) => [key, status.label])] },
    { key: 'location' as const, label: '위치', options: [['all', '전체 위치'], ['registered', '위치 등록'], ['missing', '위치 미등록']] },
  ]
  return (
    <div className="flex flex-wrap gap-2">
      <Input aria-label="장비 이름 또는 업체 ID 검색" placeholder="장비 이름 또는 업체 ID 검색" value={value.search}
        onChange={event => onChange({ ...value, search: event.target.value })} className="w-full sm:w-64" />
      {selects.map(select => (
        <Select key={select.key} value={value[select.key]} onValueChange={next => onChange({ ...value, [select.key]: next })}>
          <SelectTrigger aria-label={select.label} className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>{select.options.map(([key, label]) => (
            <SelectItem key={key!} value={key!}>{label}</SelectItem>
          ))}</SelectContent>
        </Select>
      ))}
    </div>
  )
}
