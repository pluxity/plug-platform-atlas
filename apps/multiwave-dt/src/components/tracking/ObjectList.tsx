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
    <Card className="h-full flex flex-col bg-slate-800/95 backdrop-blur-sm border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-white">추적 중인 객체</CardTitle>
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
                className={`cursor-pointer transition-all ${
                  isPinned(obj.id)
                    ? 'bg-blue-600/30 border-blue-500'
                    : 'bg-slate-700/50 hover:bg-slate-700 border-transparent'
                }`}
                onClick={() => handleObjectClick(obj)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${getTypeColor(obj.type)} text-white`}>
                        {getIcon(obj.type)}
                      </div>
                      <span className="font-medium text-sm text-white">{obj.metadata?.name || obj.id.slice(0, 8)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handlePinToggle(e, obj.id)}
                        className={`p-1 rounded hover:bg-slate-600 transition-colors ${
                          isPinned(obj.id) ? 'text-blue-400' : 'text-slate-400'
                        }`}
                        title={isPinned(obj.id) ? '고정 해제' : '고정'}
                      >
                        <Pin className={`h-3.5 w-3.5 ${isPinned(obj.id) ? 'fill-current' : ''}`} />
                      </button>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(obj.type)} text-white`}>
                        {getTypeLabel(obj.type)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <div>
                      <span className="text-slate-500">위도:</span> {obj.position.latitude.toFixed(6)}
                    </div>
                    <div>
                      <span className="text-slate-500">경도:</span> {obj.position.longitude.toFixed(6)}
                    </div>
                    {obj.metadata?.speed !== undefined && obj.metadata.speed !== null && (
                      <div>
                        <span className="text-slate-500">속도:</span> {obj.metadata.speed.toFixed(1)} km/h
                      </div>
                    )}
                    {obj.cameraId && (
                      <div>
                        <span className="text-slate-500">카메라:</span> {obj.cameraId}
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
