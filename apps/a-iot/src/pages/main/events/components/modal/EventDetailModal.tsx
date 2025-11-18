import { useState, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle, Button } from '@plug-atlas/ui';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { getStatusInfo } from '../../utils/statusUtils.ts';
import { getLevelInfo } from '../../utils/levelUtils.ts';
import type { Event } from '../../../../../services/types';
import { useUpdateEventStatus, useEvent } from '../../../../../services/hooks';
import ActionHistorySection from "./ActionHistoryItem.tsx";
import EventLocationMap from './EventLocationMap.tsx';
import ValueRangeIndicator from './ValueRangeIndicator.tsx';

interface EventDetailModalProps {
  event: Event;
}

export default function EventDetailModal({ event }: EventDetailModalProps) {
  getStatusInfo(event.status);
  const [localEvent, setLocalEvent] = useState(event);
  const { trigger: updateStatus, isMutating } = useUpdateEventStatus();
  const { data: fetchedEvent, mutate: mutateEvent } = useEvent(event.eventId);

  useEffect(() => {
    setLocalEvent(event);
  }, [event]);

  useEffect(() => {
    if (fetchedEvent) {
      setLocalEvent(fetchedEvent);
    }
  }, [fetchedEvent]);

  const handleStatusAction = async () => {
    if (localEvent.status === 'ACTIVE') {
      try {
        await updateStatus({
          eventId: localEvent.eventId,
          status: { result: 'IN_PROGRESS' }
        });
        setLocalEvent({ ...localEvent, status: 'IN_PROGRESS' });
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
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {localEvent.profileDescription || localEvent.sensorDescription || '센서'} {getLevelInfo(localEvent.level).text} 발생
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6">
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
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">이벤트 발생 위치</h3>
            <EventLocationMap
                longitude={localEvent.longitude}
                latitude={localEvent.latitude}
                eventName={localEvent.eventName}
            />
          </div>

          <div className="space-y-4 bg-gradient-to-br from-gray-50 to-gray-100/50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-700 uppercase tracking-wide">이벤트 정보</h3>
              <span className={`px-3 py-1 text-xs font-semibold ${getLevelInfo(localEvent.level).color}`}>
                {getLevelInfo(localEvent.level).text}
              </span>
            </div>

            <div className="space-y-5">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">디바이스 ID</label>
                  <p className="flex items-center gap-2 text-sm text-gray-900 leading-relaxed">
                    <span className="text-sm font-semibold text-gray-900">{localEvent.sensorDescription || 'N/A'}</span>
                    <span className="text-sm text-gray-900 font-mono">{localEvent.deviceId || 'N/A'}</span>
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <label className="font-medium text-gray-700 uppercase tracking-wide mb-6 block">센서 측정값 범위</label>

                <div className="mb-8 text-center">
                  <div className="inline-block">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">현재 측정값</div>
                    <div className="relative">
                      <div className="text-5xl font-bold text-red-600 tabular-nums">
                        {localEvent.value !== undefined && localEvent.value !== null
                          ? localEvent.value.toFixed(6).replace(/\.?0+$/, '')
                          : 'N/A'}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">단위: {localEvent.fieldKey?.split('_').pop() || '-'}</div>
                  </div>
                </div>

                {localEvent.minValue !== undefined && localEvent.maxValue !== undefined && localEvent.value !== undefined && (
                  <ValueRangeIndicator
                    value={localEvent.value}
                    minValue={localEvent.minValue}
                    maxValue={localEvent.maxValue}
                    level={localEvent.level}
                  />
                )}

                <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">필드키:</span>
                    <span className="font-mono text-gray-700 font-medium">{localEvent.fieldKey || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">발생시간:</span>
                    <span className="text-gray-700 font-medium">
                      {localEvent.occurredAt ? new Date(localEvent.occurredAt).toLocaleString('ko-KR', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">조치 기록</h3>
            <ActionHistorySection
              eventId={localEvent.eventId}
              onActionUpdate={() => {
                mutateEvent();
              }}
            />
          </div>
        </div>
      </DialogContent>
  );
}