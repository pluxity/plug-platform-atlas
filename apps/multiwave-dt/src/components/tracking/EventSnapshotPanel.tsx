import { Card, CardHeader, CardTitle, CardContent } from '@plug-atlas/ui'
import { useTrackingLogStore } from '../../stores/useTrackingLogStore'

export function EventSnapshotPanel() {
  const selectedSnapshot = useTrackingLogStore((state) => state.selectedSnapshot)

  return (
    <Card className="h-full flex flex-col bg-[#181A1D]/80 backdrop-blur-md border-slate-600/30 rounded-[12px]">
      <CardHeader className="py-2 border-b border-slate-600/20 text-center">
        <CardTitle className="text-sm font-semibold text-white">이벤트 스냅샷</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-2">
        {/* 스냅샷 이미지 */}
        <div className="h-full bg-slate-800/50 rounded-lg overflow-hidden border border-black">
          {selectedSnapshot ? (
            <img
              src={selectedSnapshot}
              alt="이벤트 스냅샷"
              className="w-full h-58 object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
              스냅샷 없음
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
