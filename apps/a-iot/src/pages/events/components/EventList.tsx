import { useState, useMemo, useEffect } from 'react';
import { Card, Button, Dialog, DialogTrigger } from '@plug-atlas/ui';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import EventDetailModal from './modal/EventDetailModal.tsx';
import type { Event } from '../../../services/types';
import { useUpdateEventStatus, useEvent } from '../../../services/hooks';
import { getStatusInfo, getLevelInfo } from "../utils/timeUtils.ts";
import { useSearchParams } from 'react-router-dom';

type SortField = 'occurredAt' | 'level' | 'status';
type SortDirection = 'asc' | 'desc' | null;

interface EventListProps {
    events: Event[];
    isLoading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    onRefresh?: () => void;
}

interface EventRowProps {
    event: Event;
    onStatusUpdate: () => void;
}

interface EventRowInternalProps extends EventRowProps {
    initialOpen?: boolean;
    onClose?: () => void;
}

function EventRow({ event, onStatusUpdate, initialOpen = false, onClose }: EventRowInternalProps) {
    const [isOpen, setIsOpen] = useState(initialOpen);
    const statusInfo = getStatusInfo(event.status);
    const levelInfo = getLevelInfo(event.level);
    const { trigger: updateStatus, isMutating } = useUpdateEventStatus();

    useEffect(() => {
        setIsOpen(initialOpen);
    }, [initialOpen]);

    const handleStatusAction = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (event.status === 'ACTIVE') {
            try {
                await updateStatus({
                    eventId: event.eventId,
                    status: { result: 'IN_PROGRESS' }
                });
                onStatusUpdate();
            } catch (error) {
                console.error('상태 업데이트 실패:', error);
            }
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            onStatusUpdate();
            if (onClose) {
                onClose();
            }
        }
    };

    const getStatusStyle = () => {
        if (event.status === 'ACTIVE') {
            return 'bg-red-100 text-red-800 border-l-4 border-red-600';
        }
        if (event.status === 'IN_PROGRESS') {
            return 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-600';
        }
        return 'bg-green-100 text-green-800 border-l-4 border-green-600';
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <div className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0 cursor-pointer">
                    <div className="flex-1 min-w-0 pr-4">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {event.eventName || `이벤트 #${event.eventId}`}
                        </p>
                    </div>

                    <div className="w-48 pr-4 text-center">
                        <p className="text-sm text-gray-700 truncate">
                            {event.deviceId || '-'}
                        </p>
                    </div>

                    <div className="w-48 pr-4 text-center">
                        <p className="text-gray-600 truncate font-mono">
                            {event.fieldKey || '-'}
                        </p>
                    </div>

                    <div className="w-40 pr-4 text-center">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium ${getStatusStyle()}`}>
                            <statusInfo.icon className="h-3.5 w-3.5" />
                            <span>{statusInfo.text}</span>
                        </div>
                    </div>

                    <div className="w-32 pr-4 text-center">
                        <div className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-sm shadow-sm ${levelInfo.color}`}>
                            <span>{levelInfo.text}</span>
                        </div>
                    </div>

                    <div className="w-40 pr-4 text-center">
                        <p className="text-gray-600">
                            {event.occurredAt ? new Date(event.occurredAt).toLocaleString('ko-KR', {
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : '-'}
                        </p>
                    </div>

                    <div className="w-48 flex items-center justify-center">
                        {event.status === 'ACTIVE' ? (
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

export default function EventList({ events, isLoading, hasMore, onLoadMore, onRefresh }: EventListProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [sortField, setSortField] = useState<SortField | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);

    const eventIdFromUrl = searchParams.get('eventId');
    const targetEventId = eventIdFromUrl ? parseInt(eventIdFromUrl) : null;

    const { data: fetchedEvent} = useEvent(
        targetEventId || 0,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    );

    const handleStatusUpdate = () => {
        if (onRefresh) {
            onRefresh();
        }
    };

    const handleModalClose = () => {
        searchParams.delete('eventId');
        setSearchParams(searchParams);
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            if (sortDirection === 'asc') {
                setSortDirection('desc');
            } else if (sortDirection === 'desc') {
                setSortDirection(null);
                setSortField(null);
            }
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const filteredEvents = useMemo(() => {
        let eventList = events.filter(event => event.level !== 'NORMAL');

        if (fetchedEvent && targetEventId) {
            const exists = eventList.some(e => e.eventId === targetEventId);
            if (!exists) {
                eventList = [fetchedEvent, ...eventList];
            }
        }

        return eventList;
    }, [events, fetchedEvent, targetEventId]);

    const sortedEvents = useMemo(() => {
        if (!sortField || !sortDirection) return filteredEvents;

        return [...filteredEvents].sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (sortField === 'occurredAt') {
                aValue = new Date(a.occurredAt).getTime();
                bValue = new Date(b.occurredAt).getTime();
            } else if (sortField === 'level') {
                const levelOrder = { 'DANGER': 5, 'DISCONNECTED': 4, 'WARNING': 3, 'CAUTION': 2 };
                aValue = levelOrder[a.level as keyof typeof levelOrder] || 0;
                bValue = levelOrder[b.level as keyof typeof levelOrder] || 0;
            } else if (sortField === 'status') {
                const statusOrder = { 'ACTIVE': 3, 'IN_PROGRESS': 2, 'RESOLVED': 1 };
                aValue = statusOrder[a.status as keyof typeof statusOrder] || 0;
                bValue = statusOrder[b.status as keyof typeof statusOrder] || 0;
            }

            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }, [filteredEvents, sortField, sortDirection]);

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) {
            return <ChevronsUpDown className="h-3.5 w-3.5 ml-1 text-gray-400" />;
        }
        if (sortDirection === 'asc') {
            return <ChevronUp className="h-3.5 w-3.5 ml-1 text-gray-700" />;
        }
        return <ChevronDown className="h-3.5 w-3.5 ml-1 text-gray-700" />;
    };

    return (
        <Card>
            {isLoading ? (
                <div className="p-8">
                    <p className="text-center text-gray-500">이벤트 로딩 중...</p>
                </div>
            ) : sortedEvents && sortedEvents.length > 0 ? (
                <>
                    <div className="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <div className="flex-1 pr-4">
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">이벤트명</p>
                        </div>
                        <div className="w-48 pr-4 text-center">
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">디바이스 ID</p>
                        </div>
                        <div className="w-48 pr-4 text-center">
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">필드키</p>
                        </div>
                        <div className="w-40 pr-4 flex items-center justify-center">
                            <button
                                onClick={() => handleSort('status')}
                                className="flex items-center text-xs font-semibold text-gray-700 uppercase tracking-wide hover:text-gray-900 transition-colors"
                            >
                                상태
                                <SortIcon field="status" />
                            </button>
                        </div>
                        <div className="w-32 pr-4 flex items-center justify-center">
                            <button
                                onClick={() => handleSort('level')}
                                className="flex items-center text-xs font-semibold text-gray-700 uppercase tracking-wide hover:text-gray-900 transition-colors"
                            >
                                심각도
                                <SortIcon field="level" />
                            </button>
                        </div>
                        <div className="w-40 pr-4 flex items-center justify-center">
                            <button
                                onClick={() => handleSort('occurredAt')}
                                className="flex items-center text-xs font-semibold text-gray-700 uppercase tracking-wide hover:text-gray-900 transition-colors"
                            >
                                발생시간
                                <SortIcon field="occurredAt" />
                            </button>
                        </div>
                        <div className="w-48 text-center">
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">담당자/작업</p>
                        </div>
                    </div>

                    <div>
                        {sortedEvents.map((event) => (
                            <EventRow
                                key={event.eventId}
                                event={event}
                                onStatusUpdate={handleStatusUpdate}
                                initialOpen={targetEventId === event.eventId}
                                onClose={handleModalClose}
                            />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="border-t border-gray-200 p-4 text-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onLoadMore}
                                className="gap-1.5"
                            >
                                <span>더 보기</span>
                                <ChevronDown className="h-4 w-4" />
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