import { useMemo } from 'react'
import { Cartesian3 } from 'cesium'
import { useTrackingStore } from '../../stores/useTrackingStore'
import { useCesiumViewer } from '../../stores/useCesiumViewer'
import type { TrackingObject } from '../../types/tracking.types'
import { User, HelpCircle, Pin } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@plug-atlas/ui'

export function ObjectList() {
  const objects = useTrackingStore((state: any) => state.objects)
  const togglePinObject = useTrackingStore((state: any) => state.togglePinObject)
  const isPinned = useTrackingStore((state: any) => state.isPinned)
  const viewer = useCesiumViewer((state: any) => state.viewer)
  const objectArray = useMemo(() => Array.from(objects.values()) as TrackingObject[], [objects])

  const handleObjectClick = (obj: typeof objectArray[0]) => {
    if (!viewer) return

    const destination = Cartesian3.fromDegrees(
      obj.position.longitude,
      obj.position.latitude,
      (obj.position.altitude ?? 0) + 2000 // 객체 위 2000m 높이에서 보기
    )

    viewer.camera.flyTo({
      destination,
      duration: 1.5, // 1.5초 동안 이동
    })
  }

  const handlePinToggle = (e: React.MouseEvent, objectId: string) => {
    e.stopPropagation() // 카드 클릭 이벤트 방지
    togglePinObject(objectId)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'person':
        return <User className="h-4 w-4" />
      case 'wildlife':
        return <span className="text-sm">🦌</span>
      default:
        return <HelpCircle className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'person':
        return '사람'
      case 'wildlife':
        return '야생동물'
      default:
        return '미지정'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'person':
        return 'bg-blue-500'
      case 'wildlife':
        return 'bg-orange-500'
      default:
        return 'bg-yellow-500'
    }
  }

  return (
    <Card className="h-full flex flex-col bg-[#1e293b]/80 backdrop-blur-md border-slate-600/50 rounded-[15px] shadow-lg">
      <CardHeader className="pb-3 border-b border-slate-600/30">
        <CardTitle className="text-sm font-semibold text-white">추적 중인 객체</CardTitle>
        <p className="text-xs text-slate-400 mt-0.5">총 {objectArray.length}개</p>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-2">
        {objectArray.length === 0 ? (
          <div className="text-center text-slate-500 text-xs py-8">
            추적 중인 객체가 없습니다
          </div>
        ) : (
          <div className="space-y-1.5">
            {objectArray.map((obj) => (
              <Card
                key={obj.id}
                className={`cursor-pointer transition-all duration-200 rounded-[12px] border ${
                  isPinned(obj.id)
                    ? 'bg-[#0057FF]/20 border-[#0057FF]/50 shadow-sm'
                    : 'bg-slate-700/40 hover:bg-slate-700/60 border-slate-600/30 hover:border-slate-500/50'
                }`}
                onClick={() => handleObjectClick(obj)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${getTypeColor(obj.type)} text-white shadow-sm`}>
                        {getIcon(obj.type)}
                      </div>
                      <span className="font-semibold text-sm text-white">{obj.metadata?.name || obj.id.slice(0, 8)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handlePinToggle(e, obj.id)}
                        className={`p-1 rounded-lg hover:bg-slate-600/50 transition-colors ${
                          isPinned(obj.id) ? 'text-[#0057FF]' : 'text-slate-400 hover:text-slate-300'
                        }`}
                        title={isPinned(obj.id) ? '고정 해제' : '고정'}
                      >
                        <Pin className={`h-3.5 w-3.5 ${isPinned(obj.id) ? 'fill-current' : ''}`} />
                      </button>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(obj.type)} text-white font-medium shadow-sm`}>
                        {getTypeLabel(obj.type)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-400">위도:</span> <span className="font-mono">{obj.position.latitude.toFixed(6)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">경도:</span> <span className="font-mono">{obj.position.longitude.toFixed(6)}</span>
                    </div>
                    {obj.metadata?.speed !== undefined && obj.metadata.speed !== null && (
                      <div>
                        <span className="text-slate-400">속도:</span> <span className="font-mono">{obj.metadata.speed.toFixed(1)} km/h</span>
                      </div>
                    )}
                    {obj.cameraId && (
                      <div>
                        <span className="text-slate-400">카메라:</span> <span className="font-mono">{obj.cameraId}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
