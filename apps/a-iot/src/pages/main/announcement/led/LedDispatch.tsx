import { useMemo, useState } from 'react'
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger, toast } from '@plug-atlas/ui'
import { useCreateLedPreset, useDispatchLedMessage, useLedPanels, useLedPresets } from '@/services/hooks/useLed'
import { LED_CONTENT_MAX_LENGTH, LED_TITLE_MAX_LENGTH } from '@/services/types/led'
import { useSiteAccess } from '@/hooks/useSiteAccess'
import { LedPreview } from './components/LedPreview'
import { LedTargetSelector } from './components/LedTargetSelector'
import LedBroadcastHistory from './components/LedBroadcastHistory'

export default function LedDispatch() {
  const panelsQuery = useLedPanels()
  const presetsQuery = useLedPresets()
  const access = useSiteAccess()
  const { trigger: dispatch, isMutating: isDispatching } = useDispatchLedMessage()
  const { trigger: createPreset, isMutating: isSavingPreset } = useCreateLedPreset()
  const [mode, setMode] = useState('preset')
  const [presetId, setPresetId] = useState('')
  const [message, setMessage] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const visiblePanels = useMemo(() => panelsQuery.panels.filter(panel =>
    access.isAdmin || (panel.siteId != null && access.canAccessSite(panel.siteId))),
  [panelsQuery.panels, access])
  const selectedPanels = visiblePanels.filter(panel => selectedIds.includes(panel.id))
  const historySites = Array.from(new Map(visiblePanels.flatMap(panel => panel.siteId == null ? [] : [[panel.siteId, { id: panel.siteId, name: panel.siteName }] as const])).values())
  const preset = presetsQuery.presets.find(item => String(item.id) === presetId)
  const content = mode === 'preset' ? preset?.content ?? '' : message
  const canDispatch = !!content.trim() && content.length <= LED_CONTENT_MAX_LENGTH &&
    selectedPanels.length > 0 && !isDispatching && !panelsQuery.error &&
    (mode !== 'preset' || !presetsQuery.error)

  const send = async () => {
    if (!canDispatch) return
    try {
      await dispatch({ panelIds: selectedPanels.map(panel => panel.id), content: content.trim(), presetId: mode === 'preset' ? preset!.id : null })
      setConfirmOpen(false)
      toast.success('송출 요청을 접수했습니다. 장비별 성공 여부는 송출 이력에서 확인하세요.')
    } catch {
      toast.error('송출 요청에 실패했습니다. 권한과 연결 상태를 확인하세요.')
    }
  }
  const savePreset = async () => {
    if (!message.trim()) return
    try {
      await createPreset({ title: message.trim().slice(0, LED_TITLE_MAX_LENGTH), content: message.trim() })
      toast.success('프리셋을 저장했습니다.')
    } catch {
      toast.error('프리셋을 저장하지 못했습니다.')
    }
  }

  if (!access.hasAnyAccess) return <p role="alert" className="text-sm text-muted-foreground">공원 접근 권한을 확인할 수 없습니다. 관리자에게 문의하세요.</p>

  return <div className="space-y-4">
    <div><h1 className="text-xl font-bold">LED 메시지 송출</h1><p className="mt-1 text-sm text-muted-foreground">등록된 공원 전광판에 안내 메시지를 송출합니다.</p></div>
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="space-y-4 rounded-md border p-4">
        <h2 className="font-semibold">메시지</h2>
        <Tabs value={mode} onValueChange={setMode}>
          <TabsList><TabsTrigger value="preset">프리셋 선택</TabsTrigger><TabsTrigger value="direct">직접 입력</TabsTrigger></TabsList>
          <TabsContent value="preset" className="space-y-2">
            {presetsQuery.error ? <p role="alert" className="text-sm text-destructive">프리셋 조회에 실패했습니다. <Button variant="link" onClick={() => void presetsQuery.mutate()}>다시 시도</Button></p>
              : presetsQuery.isLoading ? <p role="status">프리셋을 불러오는 중…</p>
              : <Select value={presetId} onValueChange={setPresetId}><SelectTrigger aria-label="송출 프리셋"><SelectValue placeholder="프리셋 선택" /></SelectTrigger><SelectContent>{presetsQuery.presets.map(item => <SelectItem key={item.id} value={String(item.id)}>{item.title}</SelectItem>)}</SelectContent></Select>}
            {!presetsQuery.isLoading && !presetsQuery.error && !presetsQuery.presets.length && <p className="text-sm text-muted-foreground">저장된 프리셋이 없습니다. 메시지를 직접 입력할 수 있습니다.</p>}
          </TabsContent>
          <TabsContent value="direct" className="space-y-2">
            <Label htmlFor="led-message">메시지 ({message.length}/{LED_CONTENT_MAX_LENGTH})</Label>
            <textarea id="led-message" className="min-h-32 w-full rounded-md border p-3 text-sm" maxLength={LED_CONTENT_MAX_LENGTH} value={message} onChange={event => setMessage(event.target.value)} />
            <Button variant="outline" disabled={!message.trim() || isSavingPreset} onClick={() => void savePreset()}>프리셋으로 저장</Button>
          </TabsContent>
        </Tabs>
        <LedPreview content={content} />
      </section>
      <section className="space-y-4 rounded-md border p-4">
        <h2 className="font-semibold">송출 대상 · {selectedPanels.length}대 선택</h2>
        {panelsQuery.error ? <p role="alert" className="text-sm text-destructive">전광판 목록 조회에 실패했습니다. <Button variant="link" onClick={() => void panelsQuery.mutate()}>다시 시도</Button></p>
          : panelsQuery.isLoading ? <p role="status">전광판을 불러오는 중…</p>
          : <LedTargetSelector panels={visiblePanels} selectedIds={selectedIds} onChange={setSelectedIds} disabled={isDispatching} />}
        <Button disabled={!canDispatch} onClick={() => setConfirmOpen(true)}>{isDispatching ? '송출 요청 중…' : '송출'}</Button>
      </section>
    </div>
    <LedBroadcastHistory sites={historySites} isAdmin={access.isAdmin} />
    <Dialog open={confirmOpen} onOpenChange={open => { if (!isDispatching) setConfirmOpen(open) }}>
      <DialogContent>
        <DialogHeader><DialogTitle>이 메시지를 송출할까요?</DialogTitle><DialogDescription>선택한 전광판 {selectedPanels.length}대에 실제 송출을 요청합니다.</DialogDescription></DialogHeader>
        <div className="space-y-3 p-4"><LedPreview content={content} /><p className="text-sm">{selectedPanels.map(panel => panel.name).join(', ')}</p></div>
        <DialogFooter><Button variant="outline" disabled={isDispatching} onClick={() => setConfirmOpen(false)}>취소</Button><Button disabled={!canDispatch} onClick={() => void send()}>송출 요청</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
}
