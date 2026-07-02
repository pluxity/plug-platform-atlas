import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import {
  DataTable,
  Button,
  Badge,
  toast,
} from '@plug-atlas/ui'
import type { Column } from '@plug-atlas/ui'
import { useCctvList, useSyncCctv, useSearchBar, usePagination } from '../../../../services/hooks'
import type { CctvResponse } from '../../../../services/types'
import { SearchBar } from '../../../../components/elements/SearchBar.tsx'
import { TablePagination } from '../../../../components/elements/Pagination.tsx'

const STATUS_MAP: Record<number, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  0: { label: '비활성', variant: 'secondary' },
  1: { label: '온라인', variant: 'default' },
  2: { label: '오프라인', variant: 'destructive' },
}

export default function CCTV() {
  const { data: cctvs, mutate, isLoading } = useCctvList()
  const { trigger: syncCctv, isMutating: isSyncing } = useSyncCctv()

  const { searchTerm, filteredData: searchFilteredData, handleSearch } = useSearchBar<CctvResponse>(cctvs || [], ['name'])
  const { currentPage, totalPages, currentPageData, goToPage, nextPage, prevPage, resetPage } = usePagination<CctvResponse>(searchFilteredData, 10)

  useEffect(() => {
    resetPage()
  }, [searchFilteredData.length, resetPage])

  const handleSync = async () => {
    try {
      await syncCctv(null)
      await mutate()
      toast.success('EDS 카메라 동기화가 완료되었습니다.')
    } catch (error: any) {
      toast.error(error.message || 'EDS 카메라 동기화에 실패했습니다.')
    }
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
      key: 'edsCameraId',
      header: 'EDS Camera ID',
      cell: (value) => (
        <span className="text-sm text-muted-foreground font-mono">
          {value ? String(value) : '-'}
        </span>
      ),
    },
    {
      key: 'cameraIp',
      header: 'IP',
      cell: (value) => (
        <span className="text-sm font-mono">
          {value ? String(value) : '-'}
        </span>
      ),
    },
    {
      key: 'cameraType',
      header: '타입',
      cell: (value) => value ? String(value).toUpperCase() : '-',
    },
    {
      key: 'cameraStatus',
      header: '상태',
      cell: (value) => {
        const status = STATUS_MAP[value as number] ?? { label: '알 수 없음', variant: 'secondary' as const }
        return <Badge variant={status.variant}>{status.label}</Badge>
      },
    },
    {
      key: 'lon',
      header: '경도',
      cell: (value) => (typeof value === 'number' && value !== 0 ? value.toFixed(6) : '-'),
    },
    {
      key: 'lat',
      header: '위도',
      cell: (value) => (typeof value === 'number' && value !== 0 ? value.toFixed(6) : '-'),
    },
    {
      key: 'site',
      header: '현장',
      cell: (_value, row) => row.site?.name ?? '-',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold mb-1">CCTV 관리</h1>
        <p className="text-sm text-gray-600">EDS 서버와 동기화하여 CCTV를 관리합니다.</p>
      </div>

      <div className="flex items-center justify-between mb-4 gap-2">
        <SearchBar
          value={searchTerm}
          onChange={handleSearch}
          placeholder="CCTV 이름으로 검색"
        />
        <Button
          variant="outline"
          onClick={handleSync}
          disabled={isSyncing}
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? '동기화 중...' : 'EDS 동기화'}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">로딩 중...</div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <DataTable
            data={currentPageData}
            columns={columns}
          />

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            onPrev={prevPage}
            onNext={nextPage}
          />
        </div>
      )}
    </div>
  )
}
