import { useState } from 'react'
import { useTrackingLogStore } from '../../stores/useTrackingLogStore'
import { Trash2, X, Camera } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@plug-atlas/ui'

export function EventLog() {
  const { logs, clearLogs } = useTrackingLogStore()
  const [selectedLog, setSelectedLog] = useState<string | null>(null)

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const selectedLogData = selectedLog ? logs.find(l => l.id === selectedLog) : null

  return (
    <Card className="h-full flex flex-col bg-slate-800/95 backdrop-blur-sm border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-white">이벤트 로그</CardTitle>
          <button
            onClick={clearLogs}
            className="p-1.5 hover:bg-slate-700 rounded transition-colors"
            title="로그 지우기"
          >
            <Trash2 className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-2">
        {logs.length === 0 ? (
          <div className="text-center text-slate-500 text-xs py-8">이벤트가 없습니다</div>
        ) : (
          <div className="space-y-1.5">
            {logs.map((log) => (
              <Card
                key={log.id}
                className={`cursor-pointer transition-all ${
                  selectedLog === log.id
                    ? 'bg-blue-600/30 border-blue-500'
                    : 'bg-slate-700/50 hover:bg-slate-700 border-transparent'
                }`}
                onClick={() => setSelectedLog(log.id)}
              >
                <CardContent className="p-3">
                  {/* 스냅샷 이미지 (있는 경우) */}
                  {log.data?.snapshot && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-slate-600">
                      <img
                        src={log.data.snapshot}
                        alt="이벤트 스냅샷"
                        className="w-full aspect-video object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    {/* 타입 표시 (작은 원) */}
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      log.type === 'tracking_update' ? 'bg-blue-500' :
                      log.type === 'error' ? 'bg-red-500' :
                      log.type === 'connection' ? 'bg-green-500' : 'bg-slate-500'
                    }`} />

                    {/* 내용 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs text-slate-200 line-clamp-2 leading-relaxed">{log.message}</span>
                        <span className="text-xs text-slate-500 flex-shrink-0">{formatTime(log.timestamp)}</span>
                      </div>

                      {/* 카메라 ID */}
                      {log.data?.camera && (
                        <div className="mt-1 text-xs text-slate-400">
                          <Camera className="h-3 w-3 inline mr-1" />
                          {log.data.camera}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      {/* 선택된 이벤트 스냅샷 모달 */}
      {selectedLogData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-slate-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border-slate-700 max-w-3xl w-full max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-white">이벤트 상세</CardTitle>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-1 hover:bg-slate-700 rounded transition-colors"
                >
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* 스냅샷 이미지 */}
              <div className="aspect-video bg-slate-900/50 rounded-lg overflow-hidden border border-slate-700">
                {selectedLogData.data?.snapshot ? (
                  <img
                    src={selectedLogData.data.snapshot}
                    alt="이벤트 스냅샷"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <div className="text-center">
                      <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">스냅샷이 없습니다</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 이벤트 정보 */}
              <div className="bg-slate-700/50 rounded-lg p-3 space-y-2">
                <div className="text-sm">
                  <div className="text-slate-400 mb-1">메시지</div>
                  <div className="text-white">{selectedLogData.message}</div>
                </div>

                <div className="text-sm">
                  <div className="text-slate-400 mb-1">시간</div>
                  <div className="text-white">{formatDateTime(selectedLogData.timestamp)}</div>
                </div>

                {/* 추가 정보 */}
                {selectedLogData.data && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-600">
                    {selectedLogData.data.objectId && (
                      <div className="text-sm">
                        <div className="text-slate-400">객체 ID</div>
                        <div className="text-white font-mono text-xs">{selectedLogData.data.objectId}</div>
                      </div>
                    )}
                    {selectedLogData.data.name && (
                      <div className="text-sm">
                        <div className="text-slate-400">이름</div>
                        <div className="text-white">{selectedLogData.data.name}</div>
                      </div>
                    )}
                    {selectedLogData.data.objectType && (
                      <div className="text-sm">
                        <div className="text-slate-400">타입</div>
                        <div className="text-white">{selectedLogData.data.objectType === 'person' ? '사람' : '야생동물'}</div>
                      </div>
                    )}
                    {selectedLogData.data.camera && (
                      <div className="text-sm">
                        <div className="text-slate-400">카메라</div>
                        <div className="text-white">{selectedLogData.data.camera}</div>
                      </div>
                    )}
                    {selectedLogData.data.eventDescription && (
                      <div className="text-sm col-span-2">
                        <div className="text-slate-400">이벤트</div>
                        <div className="text-white">{selectedLogData.data.eventDescription}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  )
}
