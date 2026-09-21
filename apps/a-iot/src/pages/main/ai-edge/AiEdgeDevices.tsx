import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, toast } from '@plug-atlas/ui'
import { MapPin, RefreshCw } from 'lucide-react'
import { useAiEdgeDevices } from '@/services/hooks/useAiEdgeDevices'
import { useSites } from '@/services/hooks/useSite'
import { useUpdateCctvCoordinates } from '@/services/hooks/useCctv'
import { getDeviceMutationError } from '@/lib/device-mutation-error'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import { useDevicePageSize } from '@/hooks/useDevicePageSize'
import { filterDevices, type AiEdgeDevice, type DeviceFilters as Filters } from '@/lib/ai-edge-device'
import DeviceFilters from '@/components/ai-edge/DeviceFilters'
import DeviceTable from '@/components/ai-edge/DeviceTable'
import DeviceDetails from '@/components/ai-edge/DeviceDetails'
import DeviceLoadErrors from '@/components/ai-edge/DeviceLoadErrors'
import CctvLocationDialog from '@/components/ai-edge/CctvLocationDialog'
import DeviceSyncDialog from '@/components/ai-edge/DeviceSyncDialog'
import CesiumMap from '@/components/map/CesiumMap'

export default function AiEdgeDevices() {
  const [params, setParams] = useSearchParams()
  const { devices, cctvs, mics } = useAiEdgeDevices()
  const { data: parkSites } = useSites()
  const canManage = useIsAdmin()
  const { trigger: updateCoordinates, isMutating: updating } = useUpdateCctvCoordinates()
  const [syncKind, setSyncKind] = useState<'CCTV' | 'MIC' | null>(null)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [editing, setEditing] = useState<AiEdgeDevice | null>(null)
  const [showMap, setShowMap] = useState(true)
  const [focusRequest, setFocusRequest] = useState(0)
  const { listRef, pageSize } = useDevicePageSize()
  const filters: Filters = {
    kind: params.get('kind') || 'all', site: params.get('site') || 'all',
    status: params.get('status') || 'all', location: params.get('location') || 'all', search: params.get('search') || '',
  }
  const page = Math.max(1, Math.floor(Number(params.get('page'))) || 1)
  const filtered = filterDevices(devices, filters)
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const selected = filtered.find(device => device.key === selectedKey)
  const sites = useMemo(() => Array.from(new Map(devices.flatMap(device => device.site ? [[device.site.id, device.site] as const] : [])).values()), [devices])
  const mapSites = useMemo(() => filters.site === 'all' ? parkSites : parkSites?.filter(park => String(park.id) === filters.site), [parkSites, filters.site])

  const updateFilters = (next: Filters) => {
    const nextParams = new URLSearchParams()
    Object.entries(next).forEach(([key, value]) => { if (value && value !== 'all') nextParams.set(key, value) })
    setParams(nextParams, { replace: true })
    setSelectedKey(null)
  }
  const setPage = (next: number) => {
    const nextParams = new URLSearchParams(params)
    nextParams.set('page', String(next))
    setParams(nextParams, { replace: true })
  }
  const selectFromList = (device: AiEdgeDevice) => {
    setSelectedKey(device.key)
    if (showMap) setFocusRequest(value => value + 1)
  }
  const saveCoordinates = async (device: AiEdgeDevice, lon: number, lat: number) => {
    if (!canManage || device.kind !== 'CCTV' || updating) return false
    try { await updateCoordinates({ id: device.id, data: { lon, lat } }); toast.success('좌표를 저장했습니다.'); return true }
    catch (error) { toast.error(getDeviceMutationError(error, '좌표 저장에 실패했습니다.')); return false }
  }

  return <div className="flex flex-col gap-3 lg:h-[calc(100dvh-162px)] lg:min-h-[440px]">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h1 className="text-xl font-bold">AI EDGE 디바이스</h1><p className="mt-1 text-sm text-muted-foreground">외부 업체와 연동된 CCTV와 AI 마이크의 상태와 설치 위치를 확인합니다.</p></div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" aria-pressed={showMap} onClick={() => setShowMap(value => !value)}><MapPin className="size-4" />{showMap ? '지도 닫기' : '지도 보기'}</Button>
        <Button variant="outline" disabled={cctvs.isValidating || mics.isValidating} onClick={() => void Promise.allSettled([cctvs.mutate(), mics.mutate()])}><RefreshCw className="size-4" />새로고침</Button>
        {canManage && <>
          <Button variant="outline" onClick={() => setSyncKind('CCTV')}>CCTV 동기화</Button>
          <Button variant="outline" onClick={() => setSyncKind('MIC')}>MIC 동기화</Button>
        </>}
      </div>
    </div>
    <DeviceLoadErrors cctvs={cctvs} mics={mics} />
    <DeviceFilters value={filters} sites={sites} onChange={updateFilters} />
    <p className="text-sm text-muted-foreground" role="status">
      조회된 CCTV {devices.filter(device => device.kind === 'CCTV').length}대 · MIC {devices.filter(device => device.kind === 'MIC').length}대
      {' · '}위치 미등록 {devices.filter(device => !device.position).length}대
      {(cctvs.isLoading || mics.isLoading) && ' · 장비를 불러오는 중…'}
    </p>
    <div className={`grid min-h-0 min-w-0 flex-1 gap-4 ${showMap || selected ? 'lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]' : ''}`}>
      <div className="flex min-h-0 min-w-0 flex-col gap-3">
        <div ref={listRef} className="h-[362px] min-h-0 lg:h-auto lg:flex-1">
          <DeviceTable devices={filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)} selectedKey={selected?.key ?? null} compact={showMap || !!selected}
            onSelect={selectFromList} updating={updating} onSaveCoordinates={canManage ? saveCoordinates : undefined} />
        </div>
        <div className="flex items-center justify-between gap-2 text-sm">
          <span>검색 결과 {filtered.length}대</span>
          <div className="flex items-center gap-3"><Button size="sm" variant="outline" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>이전</Button><span>{currentPage} / {totalPages}</span><Button size="sm" variant="outline" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>다음</Button></div>
        </div>
      </div>
      {(showMap || selected) && <div className="flex min-h-0 min-w-0 flex-col gap-3">
        {showMap ? <>
          {selected && <div className="flex flex-wrap items-center justify-between gap-2 text-sm"><p className="min-w-0 truncate font-medium">{selected.name}</p><div className="flex gap-2">{canManage && selected.kind === 'CCTV' && <Button size="sm" variant="outline" onClick={() => setEditing(selected)}>좌표 수정</Button>}<Button size="sm" variant="outline" onClick={() => setShowMap(false)}>상세 정보</Button></div></div>}
          <CesiumMap deviceScope="ai-edge" sites={mapSites} className="min-h-80 flex-1 lg:min-h-0" aiEdgeDevices={filtered} showAiEdgeInOverview
            selectedDeviceKey={selected?.key} focusRequest={focusRequest} onDeviceSelect={device => setSelectedKey(device.key)} />
        </> : selected && <DeviceDetails key={selected.key} device={selected} onClose={() => setSelectedKey(null)} onEdit={canManage ? () => setEditing(selected) : undefined} />}
      </div>}
    </div>
    {editing && canManage && <CctvLocationDialog key={editing.key} device={editing} onClose={() => setEditing(null)} />}
    {syncKind && canManage && <DeviceSyncDialog kind={syncKind} onClose={() => setSyncKind(null)} />}
  </div>
}
