import { DialogContent, DialogHeader, DialogTitle } from '@plug-atlas/ui';
import { Badge } from '@plug-atlas/ui';
import { getStatusInfo } from '../../utils/timeUtils';
import type { Event } from '../../../../services/types';
import ActionHistorySection from "./ActionHistoryItem.tsx";

interface EventDetailModalProps {
  event: Event;
}

export default function EventDetailModal({ event }: EventDetailModalProps) {
  const statusInfo = getStatusInfo(event.status);

  return (
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <statusInfo.icon className={`h-5 w-5 ${statusInfo.color}`} />
            이벤트 상세 정보 #{event.eventId}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-gray-400" />
              이벤트 정보
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-lg border border-gray-100">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">상태</label>
                <div className="mt-1.5">
                  <Badge className={statusInfo.color}>{statusInfo.text}</Badge>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">디바이스 ID</label>
                <p className="mt-1.5 text-sm text-gray-900">{event.deviceId || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">이벤트명</label>
                <p className="mt-1.5 text-sm text-gray-900">{event.eventName || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">발생 시간</label>
                <p className="mt-1.5 text-sm text-gray-900">
                  {event.occurredAt ? new Date(event.occurredAt).toLocaleString('ko-KR') : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">최소값</label>
                <p className="mt-1.5 text-sm text-gray-900">{event.minValue !== undefined ? event.minValue : 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">최대값</label>
                <p className="mt-1.5 text-sm text-gray-900">{event.maxValue !== undefined ? event.maxValue : 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">가이드 메시지</label>
                <p className="mt-1.5 text-sm text-gray-900">{event.guideMessage || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs font-medium text-gray-500">조치 기록</span>
            </div>
          </div>

          {/* Action History Section */}
          <ActionHistorySection eventId={event.eventId} />
        </div>
      </DialogContent>
  );
}