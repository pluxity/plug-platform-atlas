import { useEffect, useMemo, useState } from 'react'
import { Loader2, Plus } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  DataTable,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  toast,
} from '@plug-atlas/ui'
import type { Column } from '@plug-atlas/ui'
import {
  useCreateLedPreset,
  useDeleteLedPreset,
  useLedPresets,
  useUpdateLedPreset,
} from '../../../../services/hooks/useLed'
import { usePagination, useSearchBar } from '../../../../services/hooks'
import {
  DEFAULT_DISPLAY_OPTIONS,
  LED_CONTENT_MAX_LENGTH,
  LED_TITLE_MAX_LENGTH,
  type LedDisplayOptions,
  type LedPreset,
} from '../../../../services/types/led'
import { LED_API_MOCK } from '../../../../services/led/ledApi'
import { SearchBar } from '../../../../components/elements/SearchBar'
import { TablePagination } from '../../../../components/elements/Pagination'
import { LedPreview } from './components/LedPreview'
import { LedDisplayOptionsFields } from './components/LedDisplayOptionsFields'

interface PresetFormState {
  title: string
  content: string
  displayOptions: LedDisplayOptions
}

const EMPTY_FORM: PresetFormState = {
  title: '',
  content: '',
  displayOptions: DEFAULT_DISPLAY_OPTIONS,
}

export default function LedPresets() {
  const { presets, isLoading, mutate } = useLedPresets()
  const { trigger: createPreset, isMutating: isCreating } = useCreateLedPreset()
  const { trigger: updatePreset, isMutating: isUpdating } = useUpdateLedPreset()
  const { trigger: deletePreset } = useDeleteLedPreset()

  const [editing, setEditing] = useState<LedPreset | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<PresetFormState>(EMPTY_FORM)
  const [deleteTarget, setDeleteTarget] = useState<LedPreset | null>(null)
  /**
   * 아직 손대지 않은 칸에는 오류를 띄우지 않는다.
   * 빈 폼을 열자마자 빨간 문구가 뜨면 사용자가 뭔가 잘못한 것처럼 보인다.
   */
  const [touched, setTouched] = useState<{ title: boolean; content: boolean }>({
    title: false,
    content: false,
  })

  const { searchTerm, filteredData, handleSearch } = useSearchBar<LedPreset>(presets, [
    'title',
    'content',
  ])
  const { currentPage, totalPages, currentPageData, goToPage, nextPage, prevPage, resetPage } =
    usePagination<LedPreset>(filteredData, 10)

  useEffect(() => {
    resetPage()
  }, [filteredData.length, resetPage])

  const isSaving = isCreating || isUpdating

  const titleError = useMemo(() => {
    if (!form.title.trim()) return '제목을 입력해주세요'
    if (form.title.length > LED_TITLE_MAX_LENGTH) return `제목은 ${LED_TITLE_MAX_LENGTH}자 이내입니다`
    return null
  }, [form.title])

  const contentError = useMemo(() => {
    if (!form.content.trim()) return '메시지를 입력해주세요'
    return null
  }, [form.content])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setTouched({ title: false, content: false })
    setFormOpen(true)
  }

  const openEdit = (preset: LedPreset) => {
    setEditing(preset)
    setForm({
      title: preset.title,
      content: preset.content,
      displayOptions: preset.displayOptions,
    })
    setTouched({ title: false, content: false })
    setFormOpen(true)
  }

  const handleSave = async () => {
    setTouched({ title: true, content: true })
    if (titleError || contentError) return

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      displayOptions: form.displayOptions,
    }

    try {
      if (editing) {
        await updatePreset({ id: editing.id, data: payload })
        toast.success('프리셋을 수정했습니다.')
      } else {
        await createPreset(payload)
        toast.success('프리셋을 등록했습니다.')
      }
      await mutate()
      setFormOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '저장에 실패했습니다.')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deletePreset(deleteTarget.id)
      await mutate()
      toast.success('프리셋을 삭제했습니다.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '삭제에 실패했습니다.')
    } finally {
      setDeleteTarget(null)
    }
  }

  const columns: Column<LedPreset>[] = [
    { key: 'title', header: '제목' },
    {
      key: 'content',
      header: '메시지',
      cell: (value) => (
        <span className="line-clamp-2 text-sm text-muted-foreground">{String(value)}</span>
      ),
    },
    {
      key: 'displayOptions',
      header: '표출 옵션',
      cell: (value) => {
        const options = value as LedDisplayOptions
        return (
          <span className="text-xs text-muted-foreground">
            {options.durationSeconds}초 · {options.repeatCount}회
          </span>
        )
      },
    },
    {
      key: 'createdAt',
      header: '등록일',
      cell: (value) => (
        <span className="text-xs text-muted-foreground">
          {String(value).replace('T', ' ').slice(0, 16)}
        </span>
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">LED 메시지 프리셋</h1>
          <p className="text-sm text-muted-foreground">
            자주 쓰는 문구를 저장해 두고 송출 화면에서 선택합니다.
          </p>
        </div>
        {LED_API_MOCK && (
          <Badge variant="secondary" className="shrink-0">
            목업 데이터 · 새로고침 시 초기화
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <SearchBar
          value={searchTerm}
          onChange={handleSearch}
          placeholder="제목 또는 메시지 검색"
        />
        <Button onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" />
          프리셋 등록
        </Button>
      </div>

      <div className="min-h-0 flex-1">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">불러오는 중…</p>
        ) : (
          <DataTable
            data={currentPageData}
            columns={columns}
            onRowEdit={(row) => openEdit(row)}
            onRowDelete={(row) => setDeleteTarget(row)}
          />
        )}
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        onPrev={prevPage}
        onNext={nextPage}
      />

      {/* 등록 / 수정 */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? '프리셋 수정' : '프리셋 등록'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="preset-title">제목</Label>
              <Input
                id="preset-title"
                value={form.title}
                maxLength={LED_TITLE_MAX_LENGTH}
                placeholder="예: 폭염 주의"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
              />
              {touched.title && titleError && (
                <p className="text-xs text-destructive">{titleError}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="preset-content">메시지</Label>
                <span className="text-xs text-muted-foreground">
                  {form.content.length}/{LED_CONTENT_MAX_LENGTH}
                </span>
              </div>
              <textarea
                id="preset-content"
                value={form.content}
                maxLength={LED_CONTENT_MAX_LENGTH}
                placeholder="전광판에 표출할 메시지"
                className="min-h-[90px] w-full resize-none rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                onBlur={() => setTouched((prev) => ({ ...prev, content: true }))}
              />
              {touched.content && contentError && (
                <p className="text-xs text-destructive">{contentError}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">미리보기</Label>
              <LedPreview content={form.content} />
            </div>

            <LedDisplayOptionsFields
              value={form.displayOptions}
              onChange={(displayOptions) => setForm({ ...form, displayOptions })}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSave} disabled={!!titleError || !!contentError || isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? '수정' : '등록'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>프리셋을 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.title}" 프리셋이 삭제됩니다. 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
