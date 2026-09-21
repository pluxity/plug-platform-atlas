import { useState } from 'react'
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, Switch, toast } from '@plug-atlas/ui'
import { useSyncFeatures, useUpdateFeature } from '@/services/hooks'
import type { FeatureResponse } from '@/services/types'
import { getDeviceMutationError } from '@/lib/device-mutation-error'
import { getHeightEditState } from '@/lib/sensor-edit'

interface Callbacks { onClose: () => void }

export function SensorEditDialog({ sensor, onClose }: Callbacks & { sensor: FeatureResponse }) {
  const [active, setActive] = useState(sensor.active ?? false)
  const [height, setHeight] = useState(String(sensor.height ?? 0))
  const [error, setError] = useState('')
  const { trigger, isMutating } = useUpdateFeature()
  const hasHeight = height.trim() !== ''
  const heightEdit = getHeightEditState(height, sensor.height)
  const activeChanged = active !== (sensor.active ?? false)
  const valid = !hasHeight || heightEdit.valid
  const changed = activeChanged || heightEdit.changed
  const save = async () => {
    if (!valid || !changed || isMutating) return
    setError('')
    try {
      await trigger({ id: sensor.id, data: {
        ...(activeChanged ? { active } : {}),
        ...(heightEdit.changed ? { height: heightEdit.height } : {}),
      } })
      toast.success('센서 정보를 저장했습니다.')
      onClose()
    } catch (error) { setError(getDeviceMutationError(error, '센서 정보를 저장하지 못했습니다. 연결 상태를 확인하세요.')) }
  }
  return <Dialog open onOpenChange={open => { if (!open && !isMutating) onClose() }}><DialogContent className="sm:max-w-lg">
    <DialogHeader><DialogTitle>{sensor.name || sensor.deviceId} 정보 수정</DialogTitle><DialogDescription>고도와 활성화 여부를 수정합니다. 저장한 정보는 목록과 지도에 반영됩니다.</DialogDescription></DialogHeader>
    <div className="space-y-4 px-5 py-4">
    <section aria-label="센서 연동 정보" className="space-y-2 rounded-md bg-muted/50 p-3"><h3 className="text-sm font-medium">연동 정보 · 조회 전용</h3><p className="break-all text-xs text-muted-foreground">{sensor.deviceId}</p><dl className="grid grid-cols-2 gap-3 text-sm"><div><dt className="text-xs text-muted-foreground">위도</dt><dd>{sensor.latitude ?? '미등록'}</dd></div><div><dt className="text-xs text-muted-foreground">경도</dt><dd>{sensor.longitude ?? '미등록'}</dd></div></dl><p className="text-xs text-muted-foreground">위도·경도는 연동 동기화에서 업체 위치를 반영하여 갱신할 수 있습니다.</p></section>
    <div className="space-y-1"><Label htmlFor="sensor-height">고도 (m)</Label><Input id="sensor-height" type="number" step="any" value={height} disabled={isMutating} onChange={event => setHeight(event.target.value)} /><p className="text-xs text-muted-foreground">비워두면 기존 고도를 유지합니다.</p></div>
    <div className="flex items-center justify-between"><Label htmlFor="sensor-active">활성화</Label><Switch id="sensor-active" checked={active} disabled={isMutating} onCheckedChange={setActive} /></div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
    <DialogFooter className="pt-2"><Button variant="outline" disabled={isMutating} onClick={onClose}>취소</Button><Button disabled={!valid || !changed || isMutating} onClick={() => void save()}>{isMutating ? '저장 중…' : '센서 정보 저장'}</Button></DialogFooter>
  </DialogContent></Dialog>
}

export function SensorSyncDialog({ onClose }: Callbacks) {
  const [overwriteLocation, setOverwriteLocation] = useState(false)
  const [error, setError] = useState('')
  const { trigger, isMutating } = useSyncFeatures()
  const sync = async () => {
    if (isMutating) return
    setError('')
    try {
      await trigger({ overwriteLocation })
      toast.success('디바이스 동기화가 완료되었습니다.')
      onClose()
    } catch (error) { setError(getDeviceMutationError(error, '디바이스 동기화에 실패했습니다. 연동 상태를 확인하세요.')) }
  }
  return <Dialog open onOpenChange={open => { if (!open && !isMutating) onClose() }}><DialogContent className="sm:max-w-lg">
    <DialogHeader><DialogTitle>IoT 연동 동기화</DialogTitle><DialogDescription>KETI(Mobius) 연동 정보를 가져옵니다. 현재 공원·검색 조건과 관계없이 전체 센서에 적용됩니다.</DialogDescription></DialogHeader>
    <div className="space-y-4 px-5 py-4">
    <fieldset className="space-y-2" disabled={isMutating}><legend className="mb-2 text-sm font-medium">위치 갱신 방식</legend>
      <label className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 ${!overwriteLocation ? 'border-primary bg-accent/40' : ''}`}><input className="mt-1" type="radio" name="sensor-sync-mode" checked={!overwriteLocation} onChange={() => setOverwriteLocation(false)} /><span><span className="block text-sm font-medium">현재 위치 유지</span><span className="block text-xs text-muted-foreground">좌표와 공원은 유지하고 배터리 정보만 갱신합니다.</span></span></label>
      <label className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 ${overwriteLocation ? 'border-primary bg-accent/40' : ''}`}><input className="mt-1" type="radio" name="sensor-sync-mode" checked={overwriteLocation} onChange={() => setOverwriteLocation(true)} /><span><span className="block text-sm font-medium">연동 위치 반영</span><span className="block text-xs text-muted-foreground">전체 센서의 좌표와 공원을 Mobius 위치 정보로 덮어씁니다.</span></span></label>
    </fieldset>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
    <DialogFooter className="pt-2"><Button variant="outline" disabled={isMutating} onClick={onClose}>취소</Button><Button disabled={isMutating} onClick={() => void sync()}>{isMutating ? '동기화 중…' : '동기화 실행'}</Button></DialogFooter>
  </DialogContent></Dialog>
}
