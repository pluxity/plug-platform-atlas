import { useState, useMemo } from 'react'
import { Input } from '@plug-atlas/ui'
import { Search, Video, VideoOff } from 'lucide-react'
import type { EdsCamera } from '@/lib/eds/eds-types'

interface CctvCameraListProps {
  cameras: EdsCamera[]
  isLoading: boolean
  activeCameraIds: Set<string>
  onSelectCamera: (camera: EdsCamera) => void
}

export default function CctvCameraList({
  cameras,
  isLoading,
  activeCameraIds,
  onSelectCamera,
}: CctvCameraListProps) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return cameras
    const q = search.toLowerCase()
    return cameras.filter(
      (c) =>
        c.camera_name.toLowerCase().includes(q) ||
        c.camera_id.toLowerCase().includes(q),
    )
  }, [cameras, search])

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="border-b p-3">
        <h3 className="mb-2 text-sm font-semibold text-gray-700">카메라 목록</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="카메라 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-sm text-gray-400">
            카메라 목록 로딩 중...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-400">
            {search ? '검색 결과 없음' : '카메라 없음'}
          </div>
        ) : (
          <ul className="divide-y">
            {filtered.map((camera) => {
              const isActive = activeCameraIds.has(camera.camera_id)
              const isOnline = camera.camera_status === 1

              return (
                <li key={camera.camera_id}>
                  <button
                    onClick={() => onSelectCamera(camera)}
                    disabled={isActive}
                    className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors ${
                      isActive
                        ? 'cursor-default bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {isOnline ? (
                      <Video className="h-4 w-4 shrink-0 text-green-500" />
                    ) : (
                      <VideoOff className="h-4 w-4 shrink-0 text-gray-300" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">
                        {camera.camera_name}
                      </div>
                      <div className="truncate text-xs text-gray-400">
                        {camera.camera_id}
                      </div>
                    </div>
                    {isActive && (
                      <span className="shrink-0 text-xs text-blue-500">
                        재생중
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="border-t px-3 py-2 text-xs text-gray-400">
        총 {cameras.length}대
        {search && filtered.length !== cameras.length && ` / ${filtered.length}건`}
      </div>
    </div>
  )
}
