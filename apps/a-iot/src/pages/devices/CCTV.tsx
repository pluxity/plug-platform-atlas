import { useState } from 'react'
import { useCctvList, useCreateCctv, useUpdateCctv, useDeleteCctv } from '../../services/cctv'
import type { CctvResponse, CctvCreateRequest } from '../../types/cctv'
import { DataTable, type Column } from '@plug-atlas/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@plug-atlas/ui'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@plug-atlas/ui'
import { Button } from '@plug-atlas/ui'
import { Input } from '@plug-atlas/ui'
import { Label } from '@plug-atlas/ui'
import { Switch } from '@plug-atlas/ui'
import { AspectRatio } from '@plug-atlas/ui'
import { Plus, Map, Copy } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cctvCreateRequestSchema } from '../../types/cctv'
import LocationPicker from '../../components/LocationPicker'
import { toast } from '@plug-atlas/ui'

export default function CCTV() {
  const { data: cctvs, mutate, isLoading } = useCctvList()
  const { trigger: createCctv, isMutating: isCreating } = useCreateCctv()
  const { trigger: updateCctv, isMutating: isUpdating } = useUpdateCctv()
  const { trigger: deleteCctv, isMutating: isDeleting } = useDeleteCctv()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingCctv, setEditingCctv] = useState<CctvResponse | null>(null)
  const [deletingCctv, setDeletingCctv] = useState<CctvResponse | null>(null)
  const [showMap, setShowMap] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CctvCreateRequest>({
    resolver: zodResolver(cctvCreateRequestSchema),
    defaultValues: {
      name: '',
      lon: 0,
      lat: 0,
      url: '',
      height: 3,
    },
  })

  const currentLon = watch('lon')
  const currentLat = watch('lat')
  const currentHeight = watch('height')

  const handleOpenDialog = (cctv?: CctvResponse) => {
    if (cctv) {
      setEditingCctv(cctv)
      reset({
        name: cctv.name,
        lon: cctv.lon,
        lat: cctv.lat,
        url: cctv.url || '',
        height: cctv.height,
      })
    } else {
      setEditingCctv(null)
      reset({
        name: '',
        lon: 0,
        lat: 0,
        url: '',
        height: 3,
      })
    }
    setShowMap(false)
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: CctvCreateRequest) => {
    try {
      if (editingCctv) {
        await updateCctv({ id: editingCctv.id, data })
        toast.success('CCTV가 성공적으로 수정되었습니다.')
      } else {
        await createCctv(data)
        toast.success('CCTV가 성공적으로 등록되었습니다.')
      }
      mutate()
      setIsDialogOpen(false)
      reset()
    } catch (error: any) {
      toast.error(error.message || 'CCTV 저장에 실패했습니다.')
    }
  }

  const handleOpenDeleteDialog = (cctv: CctvResponse) => {
    setDeletingCctv(cctv)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingCctv) return

    try {
      await deleteCctv(deletingCctv.id)
      toast.success('CCTV가 성공적으로 삭제되었습니다.')
      mutate()
      setIsDeleteDialogOpen(false)
      setDeletingCctv(null)
    } catch (error: any) {
      toast.error(error.message || 'CCTV 삭제에 실패했습니다.')
    }
  }

  const handleLocationChange = (lon: number, lat: number) => {
    setValue('lon', parseFloat(lon.toFixed(6)))
    setValue('lat', parseFloat(lat.toFixed(6)))
  }

  const columns: Column<CctvResponse>[] = [
    {
      key: 'id',
      header: 'ID',
    },
    {
      key: 'name',
      header: 'CCTV 이름',
    },
    {
      key: 'lon',
      header: '경도',
      cell: (value) => (typeof value === 'number' ? value.toFixed(6) : '-'),
    },
    {
      key: 'lat',
      header: '위도',
      cell: (value) => (typeof value === 'number' ? value.toFixed(6) : '-'),
    },
    {
      key: 'height',
      header: '높이 (m)',
      cell: (value) => (typeof value === 'number' ? `${value.toFixed(1)}m` : '-'),
    },
    {
      key: 'url',
      header: 'Origin URL',
      cell: (value) => (
        <span className="text-sm text-muted-foreground truncate max-w-xs block">
          {value ? String(value) : '-'}
        </span>
      ),
    },
    {
      key: 'viewUrl',
      header: 'View URL',
      cell: (value) => (
        <span className="text-sm text-muted-foreground truncate max-w-xs block">
          {value ? String(value) : '-'}
        </span>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CCTV 관리</h1>
          <p className="text-muted-foreground mt-1">
            CCTV를 등록하고 모니터링합니다.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} size="default">
          <Plus className="w-4 h-4 mr-2" />
          CCTV 등록
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">로딩 중...</div>
        </div>
      ) : cctvs && cctvs.length > 0 ? (
        <DataTable
          data={cctvs}
          columns={columns}
          onRowEdit={(row) => handleOpenDialog(row)}
          onRowDelete={(row) => handleOpenDeleteDialog(row)}
        />
      ) : (
        <div className="flex items-center justify-center h-64 border border-dashed rounded-lg">
          <div className="text-center">
            <p className="text-muted-foreground">등록된 CCTV가 없습니다.</p>
            <Button
              onClick={() => handleOpenDialog()}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              첫 CCTV 등록하기
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCctv ? 'CCTV 수정' : 'CCTV 등록'}</DialogTitle>
            <DialogDescription className="sr-only">
              {editingCctv ? 'CCTV 정보를 수정합니다.' : 'CCTV를 등록합니다.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">CCTV 이름 *</Label>
              <Input
                id="name"
                placeholder="예: 정문 CCTV"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {editingCctv && editingCctv.viewUrl && (
              <div className="space-y-2">
                <Label htmlFor="viewUrl">View URL (읽기 전용)</Label>
                <div className="flex gap-2">
                  <Input
                    id="viewUrl"
                    value={editingCctv.viewUrl}
                    disabled
                    readOnly
                    className="bg-muted"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(editingCctv.viewUrl || '')
                      toast.success('View URL이 클립보드에 복사되었습니다.')
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  View URL은 서버에서 자동 생성되며 수정할 수 없습니다.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="url">Origin URL *</Label>
              <Input
                id="url"
                placeholder="rtsp://example.com/stream 또는 http://example.com/stream"
                {...register('url')}
              />
              {errors.url && (
                <p className="text-sm text-destructive">{errors.url.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                CCTV의 원본 스트림 주소를 입력하세요.
              </p>
            </div>

            <div className="space-y-2">
              <Label>위치 정보</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="lon" className="text-sm text-muted-foreground">
                    경도 (Longitude) *
                  </Label>
                  <Input
                    id="lon"
                    type="number"
                    step="0.000001"
                    placeholder="예: 127.111400"
                    {...register('lon', { valueAsNumber: true })}
                  />
                  {errors.lon && (
                    <p className="text-sm text-destructive">{errors.lon.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lat" className="text-sm text-muted-foreground">
                    위도 (Latitude) *
                  </Label>
                  <Input
                    id="lat"
                    type="number"
                    step="0.000001"
                    placeholder="예: 37.394800"
                    {...register('lat', { valueAsNumber: true })}
                  />
                  {errors.lat && (
                    <p className="text-sm text-destructive">{errors.lat.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="height" className="text-sm text-muted-foreground">
                    높이 (Height, m) *
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    placeholder="예: 3.0"
                    {...register('height', { valueAsNumber: true })}
                  />
                  {errors.height && (
                    <p className="text-sm text-destructive">{errors.height.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Map className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="show-map" className="cursor-pointer">
                  지도에서 위치 선택
                </Label>
              </div>
              <Switch
                id="show-map"
                checked={showMap}
                onCheckedChange={setShowMap}
              />
            </div>

            {showMap && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  지도에서 <strong>우클릭</strong>하여 <br /> "여기에 CCTV 위치 지정"을 선택하여 위치를 조정할 수 있습니다.
                </p>
                <div className="px-8 bg-black">
                  <AspectRatio ratio={4 / 3}>
                    <LocationPicker
                      lon={currentLon}
                      lat={currentLat}
                      onLocationChange={handleLocationChange}
                      cctvHeight={currentHeight}
                    />
                  </AspectRatio>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isCreating || isUpdating}
              >
                취소
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? '저장 중...' : editingCctv ? '수정' : '등록'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>CCTV 삭제</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              정말로 <strong className="text-foreground">{deletingCctv?.name}</strong>을(를) 삭제하시겠습니까?
              <br />이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
