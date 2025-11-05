import { DialogContent, DialogHeader, DialogTitle } from '@plug-atlas/ui';
import { Badge } from '@plug-atlas/ui';
import {useEventActionHistories} from "../../../services/hooks";
import {getStatusInfo} from "../utils/timeUtils.ts";
import type {Event} from "../../../services/types";

interface EventDetailModalProps {
  event: Event;
}

export default function EventDetailModal({ event }: EventDetailModalProps) {
  const { data: histories, isLoading } = useEventActionHistories(event.eventId);
  const statusInfo = getStatusInfo(event.status);

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <statusInfo.icon className={`h-5 w-5 ${statusInfo.color}`} />
          이벤트 상세 정보 #{event.eventId}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">상태</label>
            <div className="mt-1">
              <Badge className={statusInfo.color}>{statusInfo.text}</Badge>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">디바이스 ID</label>
            <p className="mt-1 text-sm">{event.deviceId || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">이벤트명</label>
            <p className="mt-1 text-sm">{event.eventName || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">발생 시간</label>
            <p className="mt-1 text-sm">{event.occurredAt || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">최소값</label>
            <p className="mt-1 text-sm">{event.minValue !== undefined ? event.minValue : 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">최대값</label>
            <p className="mt-1 text-sm">{event.maxValue !== undefined ? event.maxValue : 'N/A'}</p>
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-500">가이드 메시지</label>
            <p className="mt-1 text-sm">{event.guideMessage || 'N/A'}</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">조치 이력</h4>
          {isLoading ? (
            <p className="text-sm text-gray-500">로딩 중...</p>
          ) : histories && histories.length > 0 ? (
            <div className="space-y-2">
              {histories.map((history) => (
                <div key={history.id} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm">{history.content}</p>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>{history.author || '작성자 없음'}</span>
                    <span>{history.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">조치 이력이 없습니다.</p>
          )}
        </div>
      </div>
    </DialogContent>
  );
}