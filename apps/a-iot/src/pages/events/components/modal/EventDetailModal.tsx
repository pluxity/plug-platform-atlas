import { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, Button } from '@plug-atlas/ui';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { getStatusInfo } from '../../utils/timeUtils.ts';
import type { Event } from '../../../../services/types';
import { useUpdateEventStatus } from '../../../../services/hooks';
import ActionHistorySection from "./ActionHistoryItem.tsx";
import EventLocationMap from './EventLocationMap.tsx';

interface EventDetailModalProps {
  event: Event;
  onStatusUpdate?: () => void;
}

export default function EventDetailModal({ event, onStatusUpdate }: EventDetailModalProps) {
  getStatusInfo(event.status);
  const [localEvent, setLocalEvent] = useState(event);
  const { trigger: updateStatus, isMutating } = useUpdateEventStatus();

  const handleStatusAction = async () => {
    if (localEvent.status === 'ACTIVE') {
      try {
        await updateStatus({
          eventId: localEvent.eventId,
          status: { result: 'IN_PROGRESS' }
        });
        setLocalEvent({ ...localEvent, status: 'IN_PROGRESS' });
        if (onStatusUpdate) {
          onStatusUpdate();
        }
      } catch (error) {
        console.error('상태 업데이트 실패:', error);
      }
    }
  };

  const getStepStatus = (step: string) => {
    const steps = ['ACTIVE', 'IN_PROGRESS', 'RESOLVED'];
    const currentIndex = steps.indexOf(localEvent.status);
    const stepIndex = steps.indexOf(step);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'upcoming';
  };

  return (
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            이벤트 상세 정보 #{localEvent.eventId}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gray-50/50 p-5 rounded-lg border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">처리 상태</h3>
              {localEvent.status === 'ACTIVE' && (
                <Button
                  size="sm"
                  onClick={handleStatusAction}
                  disabled={isMutating}
                  variant="outline"
                >
                  {isMutating ? '처리 중...' : '조치하기'}
                </Button>
              )}
            </div>

            <div className="relative flex items-center justify-between px-8">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" style={{ left: '12%', right: '12%' }} />

              <div
                className="absolute top-4 left-0 h-0.5 bg-blue-400 transition-all duration-300"
                style={{
                  left: '12%',
                  width: localEvent.status === 'ACTIVE' ? '0%' : localEvent.status === 'IN_PROGRESS' ? '38%' : '76%'
                }}
              />

              <div className="flex flex-col items-center flex-1 relative z-10">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 transition-colors ${
                  getStepStatus('ACTIVE') === 'active'
                    ? 'bg-red-100 border-2 border-red-500'
                    : getStepStatus('ACTIVE') === 'completed'
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-white border-2 border-gray-300'
                }`}>
                  {getStepStatus('ACTIVE') === 'completed' ? (
                    <CheckCircle2 className="h-4.5 w-4.5 text-blue-600" />
                  ) : (
                    <AlertCircle className={`h-4.5 w-4.5 ${getStepStatus('ACTIVE') === 'active' ? 'text-red-600' : 'text-gray-400'}`} />
                  )}
                </div>
                <p className={`text-xs font-medium ${
                  getStepStatus('ACTIVE') === 'active'
                    ? 'text-red-600'
                    : getStepStatus('ACTIVE') === 'completed'
                    ? 'text-gray-600'
                    : 'text-gray-400'
                }`}>
                  대기
                </p>
              </div>

              <div className="flex flex-col items-center flex-1 relative z-10">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 transition-colors ${
                  getStepStatus('IN_PROGRESS') === 'active'
                    ? 'bg-yellow-100 border-2 border-yellow-500'
                    : getStepStatus('IN_PROGRESS') === 'completed'
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-white border-2 border-gray-300'
                }`}>
                  {getStepStatus('IN_PROGRESS') === 'completed' ? (
                    <CheckCircle2 className="h-4.5 w-4.5 text-blue-600" />
                  ) : (
                    <Clock className={`h-4.5 w-4.5 ${getStepStatus('IN_PROGRESS') === 'active' ? 'text-yellow-600' : 'text-gray-400'}`} />
                  )}
                </div>
                <p className={`text-xs font-medium ${
                  getStepStatus('IN_PROGRESS') === 'active'
                    ? 'text-yellow-600'
                    : getStepStatus('IN_PROGRESS') === 'completed'
                    ? 'text-gray-600'
                    : 'text-gray-400'
                }`}>
                  진행중
                </p>
              </div>

              <div className="flex flex-col items-center flex-1 relative z-10">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 transition-colors ${
                  getStepStatus('RESOLVED') === 'active'
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'bg-white border-2 border-gray-300'
                }`}>
                  <CheckCircle2 className={`h-4.5 w-4.5 ${getStepStatus('RESOLVED') === 'active' ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <p className={`text-xs font-medium ${
                  getStepStatus('RESOLVED') === 'active' ? 'text-green-600' : 'text-gray-400'
                }`}>
                  완료
                </p>
              </div>
            </div>

            {localEvent.status !== 'ACTIVE' && localEvent.updatedBy && (
              <div className="mt-5 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  <span className="font-medium text-gray-500">담당자:</span>{' '}
                  <span>{localEvent.updatedBy}</span>
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4 bg-gray-50/50 p-5 rounded-lg border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">이벤트 정보</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">이벤트명</label>
                <p className="mt-1.5 text-base text-gray-900">{localEvent.eventName || 'N/A'}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">디바이스 ID</label>
                <p className="mt-1.5 text-base text-gray-900">{localEvent.deviceId || 'N/A'}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">필드키</label>
                <p className="mt-1.5 text-base text-gray-900 font-mono">{localEvent.fieldKey || 'N/A'}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">발생 시간</label>
                <p className="mt-1.5 text-base text-gray-900">
                  {localEvent.occurredAt ? new Date(localEvent.occurredAt).toLocaleString('ko-KR') : 'N/A'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">최소값</label>
                  <p className="mt-1.5 text-base text-gray-900">{localEvent.minValue !== undefined ? localEvent.minValue : 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">최대값</label>
                  <p className="mt-1.5 text-base text-gray-900">{localEvent.maxValue !== undefined ? localEvent.maxValue : 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">가이드 메시지</label>
                <p className="mt-1.5 text-base text-gray-900">{localEvent.guideMessage || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">이벤트 발생 위치</h3>
            <EventLocationMap
              longitude={localEvent.longitude}
              latitude={localEvent.latitude}
              eventName={localEvent.eventName}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">조치 기록</h3>
            <ActionHistorySection eventId={event.eventId} />
          </div>
        </div>
      </DialogContent>
  );
}