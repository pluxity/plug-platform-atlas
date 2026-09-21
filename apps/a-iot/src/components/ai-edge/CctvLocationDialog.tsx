import { useState } from 'react'
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, toast } from '@plug-atlas/ui'
import LocationPicker from '@/components/map/LocationPicker'
import { getCoordinateEditState, type AiEdgeDevice } from '@/lib/ai-edge-device'
import { useUpdateCctvCoordinates } from '@/services/hooks/useCctv'
import { getDeviceMutationError } from '@/lib/device-mutation-error'

export default function CctvLocationDialog({ device, onClose }: { device: AiEdgeDevice; onClose: () => void }) {
  const [longitude, setLongitude] = useState(device.position ? String(device.position.longitude) : '')
  const [latitude, setLatitude] = useState(device.position ? String(device.position.latitude) : '')
  const [error, setError] = useState('')
  const { trigger, isMutating } = useUpdateCctvCoordinates()
  const { position, changed } = getCoordinateEditState({ lon: longitude, lat: latitude }, device.position)

  const save = async () => {
    if (!position || !changed || isMutating || device.kind !== 'CCTV') return
    setError('')
    try {
      await trigger({ id: device.id, data: { lon: position.longitude, lat: position.latitude } })
      toast.success('위치를 저장했습니다. 공원 매핑 결과를 목록에서 확인하세요.')
      onClose()
    } catch (error) {
      setError(getDeviceMutationError(error, '위치를 저장하지 못했습니다. 연결 상태를 확인하고 다시 시도하세요.'))
    }
  }
  return <Dialog open onOpenChange={open => { if (!open && !isMutating) onClose() }}>
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader><DialogTitle>{device.name} 좌표 수정</DialogTitle><DialogDescription>위도·경도를 직접 입력하거나 지도에서 마우스 오른쪽 버튼으로 위치를 선택하세요. 공원은 저장한 좌표에 따라 자동으로 연결됩니다.</DialogDescription></DialogHeader>
      <div className="space-y-4 px-5 py-4">
      <div inert={isMutating}>
      <LocationPicker lon={position?.longitude ?? null} lat={position?.latitude ?? null} containerHeight={280}
        onLocationChange={(lon, lat) => { setLongitude(String(lon)); setLatitude(String(lat)) }} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label htmlFor="cctv-longitude">경도</Label><Input id="cctv-longitude" type="number" min={-180} max={180} step="any" value={longitude} disabled={isMutating} onChange={e => setLongitude(e.target.value)} /></div>
        <div className="space-y-1"><Label htmlFor="cctv-latitude">위도</Label><Input id="cctv-latitude" type="number" min={-90} max={90} step="any" value={latitude} disabled={isMutating} onChange={e => setLatitude(e.target.value)} /></div>
      </div>
      {!position && <p className="text-sm text-muted-foreground">경도 -180~180, 위도 -90~90 범위의 좌표를 지정하세요.</p>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </div>
      <DialogFooter className="pt-2"><Button variant="outline" disabled={isMutating} onClick={onClose}>취소</Button><Button disabled={!position || !changed || isMutating} onClick={() => void save()}>{isMutating ? '저장 중…' : '좌표 저장'}</Button></DialogFooter>
    </DialogContent>
  </Dialog>
}
