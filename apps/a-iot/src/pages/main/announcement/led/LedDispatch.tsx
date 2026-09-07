import { useMemo, useState } from 'react'
import { Loader2, Save, Send } from 'lucide-react'
import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
} from '@plug-atlas/ui'
import {
  useCreateLedPreset,
  useDispatchLedMessage,
  useLedPanels,
  useLedPresets,
} from '../../../../services/hooks/useLed'
import {
  DEFAULT_DISPLAY_OPTIONS,
  LED_CONTENT_MAX_LENGTH,
  LED_TITLE_MAX_LENGTH,
  type LedDispatchResult,
  type LedDisplayOptions,
} from '../../../../services/types/led'
import { useSiteAccess } from '../../../../hooks/useSiteAccess'
import { USE_MOCK } from '../../../../services/led'
import { LedPreview } from './components/LedPreview'
import { LedDisplayOptionsFields } from './components/LedDisplayOptionsFields'
import { LedTargetSelector } from './components/LedTargetSelector'

type ComposeMode = 'preset' | 'direct'

function summarizeResult(result: LedDispatchResult): string {
  const total = result.results.length
  const failed = result.results.filter((item) => !item.success).length
  return failed === 0
    ? `전광판 ${total}대 모두 송출에 성공했습니다.`
    : `전광판 ${total}대 중 ${failed}대가 실패했습니다.`
}

export default function LedDispatch() {
  const { panels, isLoading: isPanelsLoading } = useLedPanels()
  const { presets } = useLedPresets()
  const access = useSiteAccess()

  const { trigger: dispatchMessage, isMutating: isDispatching } = useDispatchLedMessage()
  const { trigger: createPreset, isMutating: isSavingPreset } = useCreateLedPreset()

  const [mode, setMode] = useState<ComposeMode>('preset')
  const [selectedPresetId, setSelectedPresetId] = useState<string>('')
  const [directContent, setDirectContent] = useState('')
  const [displayOptions, setDisplayOptions] = useState<LedDisplayOptions>(DEFAULT_DISPLAY_OPTIONS)
  const [selectedPanelIds, setSelectedPanelIds] = useState<number[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [result, setResult] = useState<LedDispatchResult | null>(null)

  /** 접근 권한이 있는 공원의 전광판만 노출한다 */
  const visiblePanels = useMemo(
    () => panels.filter((panel) => access.canAccessSite(panel.siteId)),
    [panels, access],
  )

  const selectedPreset = presets.find((preset) => String(preset.id) === selectedPresetId)

  /** 실제 송출될 본문. 프리셋을 골랐어도 본문을 그대로 실어 보낸다. */
  const content = mode === 'preset' ? (selectedPreset?.content ?? '') : directContent

  const selectedPanels = useMemo(
    () => visiblePanels.filter((panel) => selectedPanelIds.includes(panel.id)),
    [visiblePanels, selectedPanelIds],
  )

  const canDispatch =
    content.trim().length > 0 && selectedPanels.length > 0 && !isDispatching

  const handlePresetSelect = (value: string) => {
    setSelectedPresetId(value)
    const preset = presets.find((p) => String(p.id) === value)
    // 프리셋에 저장된 표출 옵션을 함께 불러온다
    if (preset) setDisplayOptions(preset.displayOptions)
  }

  const handleDispatch = async () => {
    setConfirmOpen(false)
    try {
      const dispatchResult = await dispatchMessage({
        panelIds: selectedPanels.map((panel) => panel.id),
        content: content.trim(),
        presetId: mode === 'preset' && selectedPreset ? selectedPreset.id : null,
        displayOptions,
      })

      setResult(dispatchResult)

      const failed = dispatchResult.results.filter((r) => !r.success)
      if (failed.length === 0) {
        toast.success(`${dispatchResult.results.length}개 전광판에 송출했습니다.`)
      } else {
        toast.error(`${failed.length}개 전광판 송출에 실패했습니다. 결과를 확인하세요.`)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '송출에 실패했습니다.')
    }
  }

  /** 직접 입력한 문구를 프리셋으로 저장 */
  const handleSaveAsPreset = async () => {
    const body = directContent.trim()
    if (!body) return

    const title = body.slice(0, LED_TITLE_MAX_LENGTH)
    try {
      await createPreset({ title, content: body, displayOptions })
      toast.success('프리셋으로 저장했습니다.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '프리셋 저장에 실패했습니다.')
    }
  }

  // 접근 가능한 공원이 하나도 없는 경우
  if (!access.hasAnyAccess) {
    return (
      <Alert>
        <AlertDescription>
          {access.isUnresolved
            ? '공원 접근 권한 정보를 확인할 수 없습니다. 관리자에게 권한 설정을 문의하세요.'
            : '접근 권한이 있는 공원이 없습니다. 관리자에게 문의하세요.'}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">LED 메시지 송출</h1>
          <p className="text-sm text-muted-foreground">
            공원 전광판에 안내 메시지를 표출합니다.
            {!access.isAdmin && ' 접근 권한이 있는 공원만 표시됩니다.'}
          </p>
        </div>
        {USE_MOCK && (
          <Badge variant="secondary" className="shrink-0">
            목업 데이터 · 실제 송출되지 않음
          </Badge>
        )}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 좌: 메시지 작성 */}
        <section className="flex min-h-0 flex-col gap-3 rounded-md border p-4">
          <h2 className="font-semibold">메시지</h2>

          <Tabs value={mode} onValueChange={(value) => setMode(value as ComposeMode)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preset">프리셋 선택</TabsTrigger>
              <TabsTrigger value="direct">직접 입력</TabsTrigger>
            </TabsList>

            <TabsContent value="preset" className="pt-3">
              {presets.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  저장된 프리셋이 없습니다. 직접 입력 탭을 사용하세요.
                </p>
              ) : (
                <div className="space-y-1.5">
                  <Label htmlFor="preset-select" className="text-xs text-muted-foreground">
                    프리셋
                  </Label>
                  <Select value={selectedPresetId} onValueChange={handlePresetSelect}>
                    <SelectTrigger id="preset-select">
                      <SelectValue placeholder="프리셋을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {presets.map((preset) => (
                        <SelectItem key={preset.id} value={String(preset.id)}>
                          {preset.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </TabsContent>

            <TabsContent value="direct" className="space-y-1.5 pt-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="direct-content" className="text-xs text-muted-foreground">
                  메시지 본문
                </Label>
                <span
                  className={
                    directContent.length > LED_CONTENT_MAX_LENGTH
                      ? 'text-xs font-medium text-destructive'
                      : 'text-xs text-muted-foreground'
                  }
                >
                  {directContent.length}/{LED_CONTENT_MAX_LENGTH}
                </span>
              </div>
              <textarea
                id="direct-content"
                value={directContent}
                onChange={(e) => setDirectContent(e.target.value)}
                maxLength={LED_CONTENT_MAX_LENGTH}
                placeholder="전광판에 표출할 메시지를 입력하세요"
                className="min-h-[100px] w-full resize-none rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                variant="outline"
                size="sm"
                disabled={!directContent.trim() || isSavingPreset}
                onClick={handleSaveAsPreset}
              >
                {isSavingPreset ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-1 h-4 w-4" />
                )}
                프리셋으로 저장
              </Button>
            </TabsContent>
          </Tabs>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">미리보기</Label>
            <LedPreview content={content} />
          </div>

          <LedDisplayOptionsFields value={displayOptions} onChange={setDisplayOptions} />
        </section>

        {/* 우: 송출 대상 */}
        <section className="flex min-h-0 flex-col gap-3 rounded-md border p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">송출 대상</h2>
            <span className="text-sm text-muted-foreground">
              {selectedPanels.length}대 선택됨
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {isPanelsLoading ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                전광판 목록을 불러오는 중…
              </p>
            ) : (
              <LedTargetSelector
                panels={visiblePanels}
                selectedIds={selectedPanelIds}
                onChange={setSelectedPanelIds}
                disabled={isDispatching}
              />
            )}
          </div>

          <Button className="w-full" disabled={!canDispatch} onClick={() => setConfirmOpen(true)}>
            {isDispatching ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            송출
          </Button>
        </section>
      </div>

      {/*
        송출 결과.
        페이지 하단에 붙이면 뷰포트 밖으로 밀려 스크롤해야 보인다 —
        송출 직후 즉시 확인해야 하는 정보라 확인 다이얼로그와 같은 자리에 띄운다.
      */}
      <Dialog open={!!result} onOpenChange={(open) => !open && setResult(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>송출 결과</DialogTitle>
            <DialogDescription>
              {result && summarizeResult(result)}
            </DialogDescription>
          </DialogHeader>

          <ul className="max-h-64 space-y-1.5 overflow-y-auto">
            {result?.results.map((item) => (
              <li key={item.panelId} className="flex items-center gap-2 text-sm">
                <Badge variant={item.success ? 'default' : 'destructive'} className="shrink-0">
                  {item.success ? '성공' : '실패'}
                </Badge>
                <span>{item.panelName}</span>
                {item.message && (
                  <span className="text-muted-foreground">— {item.message}</span>
                )}
              </li>
            ))}
          </ul>

          <DialogFooter>
            <Button onClick={() => setResult(null)}>확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 송출 전 확인 */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>이 내용으로 송출할까요?</DialogTitle>
            <DialogDescription>
              전광판 {selectedPanels.length}대에 즉시 표출됩니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <LedPreview content={content} />

            <div className="text-sm">
              <p className="mb-1 font-medium">대상</p>
              <p className="text-muted-foreground">
                {selectedPanels.map((panel) => panel.name).join(', ')}
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              체류 {displayOptions.durationSeconds}초 · {displayOptions.repeatCount}회 반복
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              취소
            </Button>
            <Button onClick={handleDispatch}>송출</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
