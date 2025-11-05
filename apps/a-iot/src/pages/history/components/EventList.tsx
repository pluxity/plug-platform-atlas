import { Card, CardContent } from '@plug-atlas/ui';
import { Dialog, DialogTrigger } from '@plug-atlas/ui';
import { Badge } from '@plug-atlas/ui';
import EventDetailModal from './EventDetailModal';
import type { Event } from '../../../services/types';
import { getStatusInfo } from "../utils/timeUtils";

interface EventListProps {
    events: Event[];
    isLoading: boolean;
}

export default function EventList({ events, isLoading }: EventListProps) {
    return (
        <Card>
            <CardContent className="p-0">
                {isLoading ? (
                    <p className="text-center text-gray-500 py-8">이벤트 로딩 중...</p>
                ) : events && events.length > 0 ? (
                    <div className="divide-y">
                        {events.map((event) => {
                            const statusInfo = getStatusInfo(event.status);
                            return (
                                <Dialog key={event.eventId}>
                                    <DialogTrigger asChild>
                                        <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <statusInfo.icon className={`h-4 w-4 ${statusInfo.color}`} />
                                                    <div>
                                                        <p className="font-medium">{event.eventName || `이벤트 #${event.eventId}`}</p>
                                                        <p className="text-sm text-gray-500">
                                                            디바이스: {event.deviceId}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge className={statusInfo.color}>
                                                        {statusInfo.text}
                                                    </Badge>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {event.occurredAt}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </DialogTrigger>
                                    <EventDetailModal event={event} />
                                </Dialog>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">이벤트가 없습니다.</p>
                )}
            </CardContent>
        </Card>
    );
}