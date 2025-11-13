import {useState, useMemo, useEffect} from 'react';
import { Card, Button, Dialog, DataTable } from '@plug-atlas/ui';
import { ChevronDown } from 'lucide-react';
import EventDetailModal from './modal/EventDetailModal.tsx';
import type { Event } from '../../../services/types';
import type { Column } from '@plug-atlas/ui';
import { useUpdateEventStatus, useEvent } from '../../../services/hooks';
import { getStatusInfo, getLevelInfo } from "../utils/timeUtils.ts";
import { useSearchParams } from 'react-router-dom';

interface EventListProps {
    events: Event[];
    isLoading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    onRefresh?: () => void;
}

export default function EventList({ events, isLoading, hasMore, onLoadMore, onRefresh }: EventListProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const eventIdFromUrl = searchParams.get('eventId');
    const targetEventId = eventIdFromUrl ? parseInt(eventIdFromUrl) : null;

    const { data: fetchedEvent } = useEvent(
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
        setIsDialogOpen(false);
        setSelectedEvent(null);
        searchParams.delete('eventId');
        setSearchParams(searchParams);
        if (onRefresh) {
            onRefresh();
        }
    };

    const handleRowClick = (event: Event) => {
        setSelectedEvent(event);
        setIsDialogOpen(true);
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

    useEffect(() => {
        if (targetEventId && fetchedEvent && !isDialogOpen) {
            setSelectedEvent(fetchedEvent);
            setIsDialogOpen(true);
        }
    }, [targetEventId, fetchedEvent, isDialogOpen]);

    const { trigger: updateStatus, isMutating } = useUpdateEventStatus();

    const handleStatusAction = async (event: Event, e: React.MouseEvent) => {
        e.stopPropagation();
        if (event.status === 'ACTIVE') {
            try {
                await updateStatus({
                    eventId: event.eventId,
                    status: { result: 'IN_PROGRESS' }
                });
                handleStatusUpdate();
            } catch (error) {
                console.error('상태 업데이트 실패:', error);
            }
        }
    };

    const columns: Column<Event>[] = [
        {
            key: 'sensorDescription',
            header: '디바이스 ID',
            cell: (_, row) => (
                <div className="text-sm text-gray-700 truncate">
                    {row.sensorDescription || '-'}: {row.deviceId || '-'}
                </div>
            ),
        },
        {
            key: 'fieldKey',
            header: '필드키',
            cell: (value) => (
                <div className="text-sm text-gray-600 truncate font-mono">
                    {value as string || '-'}
                </div>
            ),
        },
        {
            key: 'status',
            header: '상태',
            cell: (_, row) => {
                const statusInfo = getStatusInfo(row.status);
                const getStatusStyle = () => {
                    if (row.status === 'ACTIVE') {
                        return 'bg-red-100 text-red-800 border-l-4 border-red-600';
                    }
                    if (row.status === 'IN_PROGRESS') {
                        return 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-600';
                    }
                    return 'bg-green-100 text-green-800 border-l-4 border-green-600';
                };

                return (
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium ${getStatusStyle()}`}>
                        <statusInfo.icon className="h-3.5 w-3.5" />
                        <span>{statusInfo.text}</span>
                    </div>
                );
            },
        },
        {
            key: 'level',
            header: '심각도',
            cell: (_, row) => {
                const levelInfo = getLevelInfo(row.level);
                return (
                    <div className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-sm shadow-sm ${levelInfo.color}`}>
                        <span>{levelInfo.text}</span>
                    </div>
                );
            },
        },
        {
            key: 'occurredAt',
            header: '발생시간',
            cell: (value) => (
                <div className="text-sm text-gray-600">
                    {value ? new Date(value as string).toLocaleString('ko-KR', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : '-'}
                </div>
            ),
        },
        {
            key: 'updatedBy',
            header: '담당자/작업',
            cell: (_, row) => (
                <div className="flex items-center justify-center">
                    {row.status === 'ACTIVE' ? (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => handleStatusAction(row, e)}
                            disabled={isMutating}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 shadow-sm"
                        >
                            {isMutating ? '처리 중...' : '조치하기'}
                        </Button>
                    ) : (
                        <div className="text-sm text-gray-600 truncate">
                            <span className="font-medium text-gray-500">담당자:</span>{' '}
                            <span>{row.updatedBy || '미지정'}</span>
                        </div>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Card className="p-6">
                {isLoading ? (
                    <div className="p-8">
                        <p className="text-center text-gray-500">이벤트 로딩 중...</p>
                    </div>
                ) : filteredEvents && filteredEvents.length > 0 ? (
                    <>
                        <DataTable
                            data={filteredEvents}
                            columns={columns}
                            onRowClick={handleRowClick}
                            getRowId={(row) => String(row.eventId)}
                        />

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

            <Dialog open={isDialogOpen} onOpenChange={handleModalClose}>
                {selectedEvent && (
                    <EventDetailModal event={selectedEvent} onStatusUpdate={handleStatusUpdate} />
                )}
            </Dialog>
        </>
    );
}
