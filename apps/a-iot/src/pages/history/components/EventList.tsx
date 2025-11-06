import { useState, useEffect, useMemo } from 'react';
import { Card, Button, Dialog, DialogTrigger } from '@plug-atlas/ui';
import { ChevronDown } from 'lucide-react';
import EventDetailModal from './modal/EventDetailModal.tsx';
import type { Event } from '../../../services/types';
import { useUpdateEventStatus } from '../../../services/hooks';
import { getStatusInfo } from "../utils/timeUtils";

interface EventListProps {
    events: Event[];
    isLoading: boolean;
    onRefresh?: () => void;
}

interface EventRowProps {
    event: Event;
    onStatusUpdate: () => void;
}

function EventRow({ event, onStatusUpdate }: EventRowProps) {
    const [isOpen, setIsOpen] = useState(false);
    const statusInfo = getStatusInfo(event.status);
    const { trigger: updateStatus, isMutating } = useUpdateEventStatus();

    const handleStatusAction = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (event.status === 'PENDING') {
            try {
                await updateStatus({
                    eventId: event.eventId,
                    status: { result: 'WORKING' }
                });
                onStatusUpdate();
            } catch (error) {
                console.error('상태 업데이트 실패:', error);
            }
        }
    };

    const getStatusStyle = () => {
        if (event.status === 'PENDING') {
            return 'bg-red-100 text-red-800 border-l-4 border-red-600';
        }
        if (event.status === 'WORKING') {
            return 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-600';
        }
        return 'bg-green-100 text-green-800 border-l-4 border-green-600';
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0 cursor-pointer">
                    <div className="flex-1 min-w-0 pr-4">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {event.eventName || `이벤트 #${event.eventId}`}
                        </p>
                    </div>

                    <div className="w-40 pr-4">
                        <p className="text-sm text-gray-700 truncate">
                            {event.deviceId || '-'}
                        </p>
                    </div>

                    <div className="w-40 pr-4">
                        <p className="text-xs text-gray-600 truncate font-mono">
                            {event.fieldKey || '-'}
                        </p>
                    </div>

                    <div className="w-40 pr-4">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium ${getStatusStyle()}`}>
                            <statusInfo.icon className="h-3.5 w-3.5" />
                            <span>{statusInfo.text}</span>
                        </div>
                    </div>

                    <div className="w-40 pr-4 text-center">
                        <p className="text-sm text-gray-600">
                            {event.occurredAt ? new Date(event.occurredAt).toLocaleString('ko-KR', {
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : '-'}
                        </p>
                    </div>

                    <div className="w-44 flex items-center justify-center">
                        {event.status === 'PENDING' ? (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleStatusAction}
                                disabled={isMutating}
                                className="text-blue-600 border-blue-200 hover:bg-blue-50 shadow-sm"
                            >
                                {isMutating ? '처리 중...' : '조치하기'}
                            </Button>
                        ) : (
                            <div className="text-sm text-gray-600 truncate">
                                <span className="font-medium text-gray-500">담당자:</span>{' '}
                                <span>{event.updatedBy || '미지정'}</span>
                            </div>
                        )}
                    </div>
                </div>
            </DialogTrigger>
            <EventDetailModal event={event} onStatusUpdate={onStatusUpdate} />
        </Dialog>
    );
}

export default function EventList({ events, isLoading, onRefresh }: EventListProps) {
    const [displayCount, setDisplayCount] = useState(10);
    const [eventOrder, setEventOrder] = useState<number[]>([]);

    useEffect(() => {
        if (events.length > 0) {
            const sortedEvents = [...events].sort((a, b) => {
                const dateA = new Date(a.occurredAt).getTime();
                const dateB = new Date(b.occurredAt).getTime();
                return dateB - dateA;
            });

            setEventOrder(sortedEvents.map(e => e.eventId));
            setDisplayCount(10);
        }
    }, [events]);

    const handleStatusUpdate = () => {
        if (onRefresh) {
            onRefresh();
        }
    };

    const orderedEvents = useMemo(() => {
        if (eventOrder.length === 0) return events;

        const eventMap = new Map(events.map(e => [e.eventId, e]));
        return eventOrder
            .map(id => eventMap.get(id))
            .filter((e): e is Event => e !== undefined);
    }, [events, eventOrder]);

    const displayedEvents = orderedEvents.slice(0, displayCount);
    const hasMore = orderedEvents.length > displayCount;

    return (
        <Card>
            {isLoading ? (
                <div className="p-8">
                    <p className="text-center text-gray-500">이벤트 로딩 중...</p>
                </div>
            ) : events && events.length > 0 ? (
                <>
                    <div className="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <div className="flex-1 pr-4">
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">이벤트명</p>
                        </div>
                        <div className="w-40 pr-4 text-center">
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">디바이스 ID</p>
                        </div>
                        <div className="w-40 pr-4 text-center">
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">필드키</p>
                        </div>
                        <div className="w-40 pr-4 text-center">
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">상태</p>
                        </div>
                        <div className="w-40 pr-4 text-center">
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">발생시간</p>
                        </div>
                        <div className="w-44 text-center">
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">담당자/작업</p>
                        </div>
                    </div>

                    <div>
                        {displayedEvents.map((event) => (
                            <EventRow
                                key={event.eventId}
                                event={event}
                                onStatusUpdate={handleStatusUpdate}
                            />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="border-t border-gray-200 p-4 text-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDisplayCount(prev => prev + 10)}
                                className="gap-1.5"
                            >
                                <span>더 보기</span>
                                <ChevronDown className="h-4 w-4" />
                                <span className="text-xs text-gray-500">
                                    ({displayedEvents.length}/{events.length})
                                </span>
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className="p-8">
                    <p className="text-center text-gray-500">이벤트가 없습니다.</p>
                </div>
            )}
        </Card>
    );
}