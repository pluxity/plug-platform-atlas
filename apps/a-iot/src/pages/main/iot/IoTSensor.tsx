import { useMemo, useState } from 'react'
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, toast } from '@plug-atlas/ui'
import { MapPin, RefreshCw } from 'lucide-react'
import { useFeatures, useUpdateFeature, useSites } from '@/services/hooks'
import { useDevicePageSize } from '@/hooks/useDevicePageSize'
import type { FeatureResponse } from '@/services/types'
import { getDevicePosition } from '@/lib/ai-edge-device'
import { getDeviceMutationError } from '@/lib/device-mutation-error'
import CesiumMap from '@/components/map/CesiumMap'
import SensorDetails from './components/SensorDetails'
import SensorTable from './components/SensorTable'
import { SensorEditDialog, SensorSyncDialog } from './components/SensorManagementDialogs'

export default function IoTSensor() {
  const { data, mutate, error, isLoading, isValidating } = useFeatures()
  const { data: parkSites } = useSites()
  const [syncOpen, setSyncOpen] = useState(false)
  const [editing, setEditing] = useState<FeatureResponse | null>(null)
  const { trigger: updateFeature, isMutating: updating } = useUpdateFeature()
  const { listRef, pageSize } = useDevicePageSize()
  const [site, setSite] = useState('all')
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [showMap, setShowMap] = useState(true)
  const [focusRequest, setFocusRequest] = useState(0)
  const mapSites = useMemo(() => site === 'all' ? parkSites : parkSites?.filter(park => park.name === site), [parkSites, site])
  const sites = useMemo(() => [...new Set((data ?? []).flatMap(sensor => sensor.siteResponse?.name ? [sensor.siteResponse.name] : []))].sort(), [data])
  const categories = useMemo(() => [...new Set((data ?? []).flatMap(sensor => sensor.deviceTypeResponse?.description ? [sensor.deviceTypeResponse.description] : []))].sort(), [data])
  const filtered = useMemo(() => (data ?? []).filter(sensor =>
    (site === 'all' || sensor.siteResponse?.name === site) &&
    (category === 'all' || sensor.deviceTypeResponse?.description === category) &&
    [sensor.deviceId, sensor.name, sensor.objectId].some(value => value?.toLowerCase().includes(search.trim().toLowerCase()))
  ).sort((a, b) => {
    const siteOrder = Number(!!b.siteResponse?.name) - Number(!!a.siteResponse?.name)
    return siteOrder || (a.siteResponse?.name ?? '').localeCompare(b.siteResponse?.name ?? '') || a.deviceId.localeCompare(b.deviceId) || a.id - b.id
  }), [data, site, category, search])
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const selected = filtered.find(sensor => sensor.id === selectedId)
  const split = showMap || !!selected
  const clearSelection = () => { setPage(1); setSelectedId(null) }
  const selectSensor = (sensor: FeatureResponse) => setSelectedId(sensor.id)
  const selectFromList = (sensor: FeatureResponse) => { selectSensor(sensor); if (showMap) setFocusRequest(value => value + 1) }
  const toggleActive = async (id: number, active: boolean) => {
    try { await updateFeature({ id, data: { active } }); toast.success('활성화 상태가 변경되었습니다.') }
    catch (error) { toast.error(getDeviceMutationError(error, '활성화 상태 변경에 실패했습니다.')) }
  }
  const saveHeight = async (id: number, height: number) => {
    try { await updateFeature({ id, data: { height } }); toast.success('고도를 저장했습니다.'); return true }
    catch (error) { toast.error(getDeviceMutationError(error, '고도 저장에 실패했습니다.')); return false }
  }

  return <div className="flex flex-col gap-3 lg:h-[calc(100dvh-162px)] lg:min-h-[440px]">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h1 className="text-xl font-bold">IoT 센서</h1><p className="mt-1 text-sm text-muted-foreground">성남시 공원에 설치된 IoT 센서를 조회하고 관리합니다.</p></div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" aria-pressed={showMap} onClick={() => setShowMap(value => !value)}><MapPin className="size-4" />{showMap ? '지도 닫기' : '지도 보기'}</Button>
        <Button variant="outline" disabled={isValidating} onClick={() => void mutate()}><RefreshCw className="size-4" />새로고침</Button>
        <Button onClick={() => setSyncOpen(true)}>연동 동기화</Button>
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      <Input className="w-full sm:w-64" aria-label="센서 이름 또는 디바이스 ID 검색" placeholder="센서 이름 또는 디바이스 ID 검색" value={search} onChange={event => { setSearch(event.target.value); clearSelection() }} />
      <Select value={site} onValueChange={value => { setSite(value); clearSelection() }}><SelectTrigger className="w-48" aria-label="공원"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">전체 공원</SelectItem>{sites.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select>
      <Select value={category} onValueChange={value => { setCategory(value); clearSelection() }}><SelectTrigger className="w-48" aria-label="센서 카테고리"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">전체 디바이스</SelectItem>{categories.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select>
      {(site !== 'all' || category !== 'all' || search) && <Button variant="ghost" onClick={() => { setSite('all'); setCategory('all'); setSearch(''); clearSelection() }}>필터 초기화</Button>}
    </div>
    <p role="status" className="text-sm text-muted-foreground">조회된 IoT 센서 {data?.length ?? 0}대 · 위치 미등록 {(data ?? []).filter(sensor => !getDevicePosition(sensor.longitude, sensor.latitude)).length}대{isLoading && ' · 센서를 불러오는 중…'}</p>
    {error && <p role="alert" className="text-sm text-destructive">센서 목록을 불러오지 못했습니다. <Button variant="link" onClick={() => void mutate()}>다시 시도</Button></p>}
    <div className={`grid min-h-0 min-w-0 flex-1 gap-4 ${split ? 'lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]' : ''}`}>
      <div className="flex min-h-0 min-w-0 flex-col gap-3">
        <div ref={listRef} className="h-[362px] min-h-0 lg:h-auto lg:flex-1"><SensorTable sensors={filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)} selectedId={selected?.id} compact={split} updating={updating}
          onSelect={selectFromList} onSaveHeight={saveHeight} onToggle={(id, active) => void toggleActive(id, active)} /></div>
        <div className="flex items-center justify-between gap-2 text-sm"><span>검색 결과 {filtered.length}대</span><nav aria-label="센서 목록 페이지" className="flex items-center gap-3"><Button size="sm" variant="outline" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>이전</Button><span>{currentPage} / {totalPages}</span><Button size="sm" variant="outline" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>다음</Button></nav></div>
      </div>
      {split && <div className="flex min-h-0 min-w-0 flex-col gap-3">
        {showMap ? <>
          {selected && <div className="flex flex-wrap items-center justify-between gap-2 text-sm"><p className="min-w-0 truncate font-medium">{selected.name || selected.deviceId}</p><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setEditing(selected)}>정보 수정</Button><Button size="sm" variant="outline" onClick={() => setShowMap(false)}>상세 정보</Button></div></div>}
          <CesiumMap deviceScope="iot" sites={mapSites} className="min-h-80 flex-1 lg:min-h-0" sensors={filtered} showSensorsInOverview
            selectedSensorId={selected?.id} focusRequest={focusRequest} onSensorSelect={selectSensor} />
        </> : selected && <SensorDetails sensor={selected} onClose={() => setSelectedId(null)} onEdit={() => setEditing(selected)} />}
      </div>}
    </div>
    {editing && <SensorEditDialog key={editing.id} sensor={editing} onClose={() => setEditing(null)} />}
    {syncOpen && <SensorSyncDialog onClose={() => setSyncOpen(false)} />}
  </div>
}
