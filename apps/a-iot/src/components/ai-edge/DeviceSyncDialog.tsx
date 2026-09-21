import { useState } from 'react'
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, toast } from '@plug-atlas/ui'
import { useSyncCctv } from '@/services/hooks/useCctv'
import { useSyncMics } from '@/services/hooks/useMic'
import { getDeviceMutationError } from '@/lib/device-mutation-error'

export default function DeviceSyncDialog({ kind, onClose }: { kind: 'CCTV' | 'MIC'; onClose: () => void }) {
  const cctv = useSyncCctv()
  const mic = useSyncMics()
  const pending = cctv.isMutating || mic.isMutating
  const [error, setError] = useState('')
  const sync = async () => {
    if (pending) return
    setError('')
    try {
      if (kind === 'CCTV') await cctv.trigger(null)
      else await mic.trigger()
      toast.success(`${kind} 업체 정보를 동기화했습니다.`)
      onClose()
    } catch (error) { setError(getDeviceMutationError(error, '동기화에 실패했습니다. 연결 상태를 확인하고 다시 시도하세요.')) }
  }
  return <Dialog open onOpenChange={open => { if (!open && !pending) onClose() }}><DialogContent className="sm:max-w-lg">
    <DialogHeader><DialogTitle>{kind} 업체 동기화</DialogTitle><DialogDescription>{kind === 'CCTV' ? 'EDS 서버의 CCTV 목록을 가져와 장비 정보를 갱신합니다.' : '연동 업체의 MIC 목록을 가져와 장비 정보를 갱신합니다.'}</DialogDescription></DialogHeader>
    <div className="space-y-4 px-5 py-4">
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-md bg-muted/50 p-4 text-sm"><dt className="text-muted-foreground">대상</dt><dd>연동된 전체 {kind}</dd><dt className="text-muted-foreground">목록 필터</dt><dd>현재 공원·검색 조건과 관계없이 적용</dd></dl>
    <p className="text-sm text-muted-foreground">동기화가 완료되면 목록과 지도 정보를 다시 불러옵니다.</p>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
    <DialogFooter className="pt-2"><Button variant="outline" disabled={pending} onClick={onClose}>취소</Button><Button disabled={pending} onClick={() => void sync()}>{pending ? '동기화 중…' : '동기화 실행'}</Button></DialogFooter>
  </DialogContent></Dialog>
}
