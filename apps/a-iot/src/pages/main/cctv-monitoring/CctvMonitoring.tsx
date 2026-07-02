import { useState, useCallback, useMemo } from 'react'
import { Loader2, AlertCircle, Square, Grid2x2, Grid3x3 } from 'lucide-react'
import { useCctvList } from '@/services/hooks'
import CctvCameraList from '@/components/cctv/CctvCameraList'
import CctvPlayerCell from '@/components/cctv/CctvPlayerCell'
import type { CctvResponse } from '@/services/types'

type LayoutMode = '1x1' | '2x2' | '3x3'

const LAYOUT_CELLS: Record<LayoutMode, number> = {
  '1x1': 1,
  '2x2': 4,
  '3x3': 9,
}

export default function CctvMonitoring() {
  const { data: cameras = [], isLoading, error } = useCctvList()

  const [layout, setLayout] = useState<LayoutMode>('2x2')
  const [cells, setCells] = useState<(CctvResponse | null)[]>(Array(9).fill(null))

  const cellCount = LAYOUT_CELLS[layout]
  const visibleCells = cells.slice(0, cellCount)

  const activeCameraIds = useMemo(() => {
    const ids = new Set<number>()
    cells.forEach((c) => {
      if (c) ids.add(c.id)
    })
    return ids
  }, [cells])

  const handleSelectCamera = useCallback(
    (camera: CctvResponse) => {
      setCells((prev) => {
        const next = [...prev]
        const emptyIdx = next.findIndex((c, i) => i < cellCount && c === null)
        if (emptyIdx === -1) {
          next[cellCount - 1] = camera
        } else {
          next[emptyIdx] = camera
        }
        return next
      })
    },
    [cellCount],
  )

  const handleRemoveCamera = useCallback((index: number) => {
    setCells((prev) => {
      const next = [...prev]
      next[index] = null
      return next
    })
  }, [])

  const gridClass =
    layout === '1x1'
      ? 'grid-cols-1 grid-rows-1'
      : layout === '2x2'
        ? 'grid-cols-2 grid-rows-2'
        : 'grid-cols-3 grid-rows-3'

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="text-sm text-gray-500">CCTV 목록 로딩 중...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-10 w-10 text-red-400" />
          <p className="text-sm font-medium text-red-600">CCTV 목록 조회 실패</p>
          <p className="text-xs text-gray-500">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* 사이드바 - 카메라 목록 */}
      <CctvCameraList
        cameras={cameras}
        isLoading={isLoading}
        activeCameraIds={activeCameraIds}
        onSelectCamera={handleSelectCamera}
      />

      {/* 메인 영역 */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* 툴바 */}
        <div className="flex items-center gap-1 border-b bg-white px-4 py-2">
          <span className="mr-2 text-sm font-medium text-gray-600">
            레이아웃
          </span>
          <LayoutButton
            active={layout === '1x1'}
            onClick={() => setLayout('1x1')}
            icon={<Square className="h-4 w-4" />}
            label="1x1"
          />
          <LayoutButton
            active={layout === '2x2'}
            onClick={() => setLayout('2x2')}
            icon={<Grid2x2 className="h-4 w-4" />}
            label="2x2"
          />
          <LayoutButton
            active={layout === '3x3'}
            onClick={() => setLayout('3x3')}
            icon={<Grid3x3 className="h-4 w-4" />}
            label="3x3"
          />
          <div className="ml-auto text-xs text-gray-400">
            {activeCameraIds.size}/{cellCount} 채널 사용중
          </div>
        </div>

        {/* 영상 그리드 */}
        <div className={`grid min-h-0 flex-1 gap-1 bg-gray-900 p-1 ${gridClass}`}>
          {visibleCells.map((camera, idx) => (
            <CctvPlayerCell
              key={`cell-${idx}`}
              camera={camera}
              onRemove={() => handleRemoveCamera(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function LayoutButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 rounded px-2.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
