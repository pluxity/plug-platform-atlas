import * as Cesium from 'cesium'
import { useTrackingLogStore } from '../../stores/useTrackingLogStore'
import { useTrackingStore } from '../../stores/useTrackingStore'
import { useObjectModalStore } from '../../stores/useObjectModalStore'
import { useCesiumViewer } from '../../stores/useCesiumViewer'
import { User, PawPrint, Car, Info } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@plug-atlas/ui'

// 타입별 스타일 설정
const eventTypeStyles = {
  person: {
    bgColor: 'bg-[#D4C5B0]', // 베이지색
    iconBg: 'bg-[#E8A500]', // 노란색
    icon: User,
  },
  wildlife: {
    bgColor: 'bg-[#B8D4E8]', // 파란색
    iconBg: 'bg-[#4A90B8]', // 진한 파란색
    icon: PawPrint,
  },
  vehicle: {
    bgColor: 'bg-[#E8B8C8]', // 분홍색
    iconBg: 'bg-[#C83C3C]', // 빨간색
    icon: Car,
  },
  car: {
    bgColor: 'bg-[#E8B8C8]', // 분홍색
    iconBg: 'bg-[#C83C3C]', // 빨간색
    icon: Car,
  },
} as const

export function EventLog() {
  const { logs, setSelectedSnapshot } = useTrackingLogStore()
  const objects = useTrackingStore((state) => state.objects)
  const openModal = useObjectModalStore((state) => state.openModal)
  const viewer = useCesiumViewer((state: any) => state.viewer)

  const handleLogClick = (log: any) => {
    // 스냅샷이 있으면 EventSnapshotPanel에 표시
    if (log.data?.snapshot) {
      setSelectedSnapshot(log.data.snapshot)
    }

    // 로그에서 객체 ID를 가져와서 해당 객체의 모달을 열기
    if (log.data?.objectId) {
      const obj = objects.get(log.data.objectId)
      if (obj) {
        // 스냅샷 이미지를 함께 전달하여 TrackingObjectModal 열기
        openModal(obj, log.data?.snapshot)

        // 카메라를 해당 객체를 바라보는 위치로 이동
        if (viewer && !viewer.isDestroyed()) {
          const targetLat = obj.position?.latitude ?? (obj as any).latitude
          const targetLon = obj.position?.longitude ?? (obj as any).longitude
          const targetAlt = obj.position?.altitude ?? 0

          // 객체 바로 위에서 수직으로 내려다보기
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
              targetLon,
              targetLat,
              targetAlt + 1500 // 1500m 높이에서 수직으로
            ),
            duration: 1.5,
            orientation: {
              heading: Cesium.Math.toRadians(0), // 북쪽 방향
              pitch: Cesium.Math.toRadians(-90), // 수직으로 내려다보기
              roll: 0,
            },
          })
        }
        return
      }
    }

    // 객체가 없지만 좌표 정보가 있으면 카메라만 이동
    if (log.data?.latitude && log.data?.longitude) {
      if (viewer && !viewer.isDestroyed()) {
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            log.data.longitude,
            log.data.latitude,
            1500 // 1500m 높이에서 수직으로
          ),
          duration: 1.5,
          orientation: {
            heading: Cesium.Math.toRadians(0), // 북쪽 방향
            pitch: Cesium.Math.toRadians(-90), // 수직으로 내려다보기
            roll: 0,
          },
        })
      }
    }
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <Card className="h-full flex flex-col bg-[#181A1D]/80 backdrop-blur-md border-slate-600/30 rounded-[12px]">
      <CardHeader className="py-2 border-b border-slate-600/20 text-center">
        <CardTitle className="text-sm font-semibold text-white">이벤트 로그</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 overflow-y-auto p-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-800/50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-500/70 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400/80">
        {logs.length === 0 ? (
          <div className="text-center text-slate-500 text-xs py-8">이벤트가 없습니다</div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => {
              // 시스템 메시지인지 확인 (연결, 에러, 정보 등)
              const isSystemMessage = !log.data?.objectType || log.type === 'connection' || log.type === 'error' || log.type === 'info'

              if (isSystemMessage) {
                // 시스템 메시지 - 간단한 스타일
                return (
                  <div
                    key={log.id}
                    className="bg-slate-700/50 rounded-lg px-3 py-2 border border-slate-600/30"
                  >
                    <div className="flex items-center gap-2">
                      <Info className="h-3 w-3 text-slate-400 flex-shrink-0" />
                      <div className="text-[10px] text-slate-400">
                        {formatTime(log.timestamp)}
                      </div>
                      <div className="text-[10px] text-slate-300 flex-1">
                        {log.message}
                      </div>
                    </div>
                  </div>
                )
              }

              // 객체 이벤트 메시지 - 타입별 색상
              const objectType = log.data?.objectType || 'person'

              // 추적 종료 이벤트인지 확인 (메시지 기반)
              const isTrackingEnd = log.message?.includes('종료') || log.message?.includes('사라짐')

              // 타입 정규화 (소문자, 공백 제거)
              const normalizedType = objectType.toLowerCase().trim()
              const typeKey = normalizedType === 'car' ? 'vehicle' : normalizedType

              const style = eventTypeStyles[typeKey as keyof typeof eventTypeStyles] || eventTypeStyles.person
              const Icon = style.icon

              // 추적 종료인 경우 회색으로 변경
              const bgColor = isTrackingEnd ? 'bg-slate-500/50' : style.bgColor
              const iconBg = isTrackingEnd ? 'bg-slate-600' : style.iconBg

              return (
                <div
                  key={log.id}
                  className="cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => handleLogClick(log)}
                >
                  {/* 알림 카드 - 타입별 색상 (종료 시 회색) */}
                  <div className={`${bgColor} rounded-lg p-2.5 shadow-sm`}>
                    <div className="flex items-start gap-2.5">
                      {/* 아이콘 */}
                      <div className={`${iconBg} rounded-full p-2 flex-shrink-0`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      {/* 내용 */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-slate-700 mb-0.5">
                          오전 {formatTime(log.timestamp)}
                        </div>
                        <div className="text-xs font-semibold text-slate-900 leading-relaxed">
                          {log.message}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
