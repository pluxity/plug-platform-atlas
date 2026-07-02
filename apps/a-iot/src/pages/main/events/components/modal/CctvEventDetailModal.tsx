import { Camera, Play, Pause, CheckCircle2 } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  Badge,
} from '@plug-atlas/ui'
import type { CctvEventResponse } from '@/services/types'
import { getCctvEventTypeLabel, getCctvEventStatusInfo } from '../../utils/cctvEventUtils'
import EventLocationMap from './EventLocationMap'

interface CctvEventDetailModalProps {
  event: CctvEventResponse | null
  cameraName: string
  cameraLon?: number
  cameraLat?: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

function getDuration(start: string, end: string): string {
  if (!start || !end) return '-'
  const diff = new Date(end).getTime() - new Date(start).getTime()
  if (diff <= 0) return '-'
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return `${seconds}초`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}분 ${seconds % 60}초`
  const hours = Math.floor(minutes / 60)
  return `${hours}시간 ${minutes % 60}분`
}

export default function CctvEventDetailModal({
  event,
  cameraName,
  cameraLon,
  cameraLat,
  open,
  onOpenChange,
}: CctvEventDetailModalProps) {
  if (!event) return null

  const typeLabel = getCctvEventTypeLabel(event.eventType)
  const statusInfo = getCctvEventStatusInfo(event.eventStatus)

  // 이벤트 좌표 우선, 없으면 카메라 좌표 사용
  const eventHasCoords = event.latitude != null && event.longitude != null && event.latitude !== 0 && event.longitude !== 0
  const mapLon = eventHasCoords ? event.longitude : (cameraLon ?? 0)
  const mapLat = eventHasCoords ? event.latitude : (cameraLat ?? 0)
  const hasCoordinates = mapLon !== 0 && mapLat !== 0

  const getStepStatus = (step: string) => {
    const steps = ['STARTED', 'IN_PROGRESS', 'ENDED']
    const currentIndex = steps.indexOf(event.eventStatus)
    const stepIndex = steps.indexOf(step)
    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'active'
    return 'upcoming'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{typeLabel} 이벤트 발생</DialogTitle>
          <DialogDescription className="sr-only">AI EDGE 이벤트 상세 정보</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {/* 상태 스텝퍼 */}
          <div className="bg-gray-50/50 p-5 rounded-lg border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-5">이벤트 상태</h3>

            <div className="relative flex items-center justify-between px-8">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" style={{ left: '12%', right: '12%' }} />
              <div
                className="absolute top-4 left-0 h-0.5 bg-blue-400 transition-all duration-300"
                style={{
                  left: '12%',
                  width: event.eventStatus === 'STARTED' ? '0%' : event.eventStatus === 'IN_PROGRESS' ? '38%' : '76%',
                }}
              />

              {[
                { key: 'STARTED', label: '발생', icon: Play, activeColor: 'red' },
                { key: 'IN_PROGRESS', label: '진행중', icon: Pause, activeColor: 'yellow' },
                { key: 'ENDED', label: '종료', icon: CheckCircle2, activeColor: 'green' },
              ].map(({ key, label, icon: Icon, activeColor }) => {
                const status = getStepStatus(key)
                return (
                  <div key={key} className="flex flex-col items-center flex-1 relative z-10">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      status === 'active'
                        ? `bg-${activeColor}-100 border-2 border-${activeColor}-500`
                        : status === 'completed'
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-white border-2 border-gray-300'
                    }`}>
                      {status === 'completed' ? (
                        <CheckCircle2 className="h-4.5 w-4.5 text-blue-600" />
                      ) : (
                        <Icon className={`h-4.5 w-4.5 ${
                          status === 'active' ? `text-${activeColor}-600` : 'text-gray-400'
                        }`} />
                      )}
                    </div>
                    <p className={`text-xs font-medium ${
                      status === 'active' ? `text-${activeColor}-600`
                        : status === 'completed' ? 'text-gray-600'
                          : 'text-gray-400'
                    }`}>{label}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 썸네일 + 위치 지도 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              {event.thumbnail?.url ? '이벤트 캡처 / 발생 위치' : '이벤트 발생 위치'}
            </h3>

            {event.thumbnail?.url && (
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={event.thumbnail.url}
                  alt={typeLabel}
                  className="w-full object-cover max-h-[300px]"
                />
              </div>
            )}

            <EventLocationMap
              longitude={mapLon}
              latitude={mapLat}
              eventName={typeLabel}
            />
          </div>

          {/* 이벤트 정보 */}
          <div className="space-y-4 bg-gradient-to-br from-gray-50 to-gray-100/50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-700 uppercase tracking-wide">이벤트 정보</h3>
              <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
            </div>

            <div className="space-y-5">
              {/* 카메라 정보 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">카메라</label>
                <p className="flex items-center gap-2 text-sm">
                  <Camera className="size-4 text-gray-400" />
                  <span className="font-semibold text-gray-900">{cameraName}</span>
                  {cameraName !== event.cameraId && (
                    <span className="text-gray-400 font-mono text-xs">{event.cameraId}</span>
                  )}
                </p>
              </div>

              {/* 상세 정보 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <label className="font-medium text-gray-700 uppercase tracking-wide mb-4 block">상세 정보</label>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">이벤트 타입</div>
                    <div className="text-sm font-semibold text-gray-900">{typeLabel}</div>
                  </div>
                  {event.eventZoneName && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">이벤트 구역</div>
                      <div className="text-sm font-medium text-gray-900">{event.eventZoneName}</div>
                    </div>
                  )}
                  {event.profileName && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">프로파일</div>
                      <div className="text-sm font-medium text-gray-900">{event.profileName}</div>
                    </div>
                  )}
                  {event.detectedVehicleNumber && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">차량번호</div>
                      <div className="text-sm font-bold text-blue-700">{event.detectedVehicleNumber}</div>
                    </div>
                  )}
                  {hasCoordinates && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">좌표 {!eventHasCoords && '(카메라 위치)'}</div>
                      <div className="text-sm font-mono text-gray-700">
                        {mapLat.toFixed(6)}, {mapLon.toFixed(6)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">이벤트 시작</div>
                    <div className="text-xs font-medium text-gray-700">{formatDateTime(event.eventStart)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">이벤트 종료</div>
                    <div className="text-xs font-medium text-gray-700">{formatDateTime(event.eventEnd)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">지속 시간</div>
                    <div className="text-xs font-semibold text-gray-900">{getDuration(event.eventStart, event.eventEnd)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
