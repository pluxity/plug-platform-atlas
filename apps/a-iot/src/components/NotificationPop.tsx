import { Bell } from 'lucide-react';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@plug-atlas/ui';
import { Notification, Event } from "../services/types";
import { useNavigate } from 'react-router-dom';
import { getLevelInfo } from '../pages/events/utils/timeUtils';

interface NotificationPanelProps {
    notifications: Notification[];
    unreadCount: number;
    isConnected: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onMarkAsRead?: (id: string) => void;
}

const getLevelColor = (level?: string) => {
    switch (level) {
        case 'DANGER':
            return 'text-red-700';
        case 'WARNING':
            return 'text-orange-700';
        case 'CAUTION':
            return 'text-amber-600';
        case 'DISCONNECTED':
            return 'text-purple-700';
        default:
            return 'text-gray-600';
    }
};

const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    return `${diffDays}일 전`;
};

function NotificationItem({ notification, onMarkAsRead }: { notification: Notification; onMarkAsRead?: (id: string) => void }) {
    const navigate = useNavigate();

    const payload = notification.type === 'sensor-alarm'
        ? (notification.payload as Event)
        : null;

    const handleClick = () => {
        if (!notification.read && onMarkAsRead) {
            onMarkAsRead(notification.id);
        }

        if (notification.eventId) {
            navigate(`/events?eventId=${notification.eventId}`);
        }
    };

    const getLevelIconPath = () => {
        switch (notification.level) {
            case 'DANGER':
                return '/images/icons/notification/danger.svg';
            case 'WARNING':
                return '/images/icons/notification/warning.svg';
            case 'CAUTION':
                return '/images/icons/notification/caution.svg';
            case 'DISCONNECTED':
                return '/images/icons/notification/danger.svg';
            default:
                return '/images/icons/notification/caution.svg';
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`bg-white rounded-2xl p-5 outline outline-offset-[-1px] outline-neutral-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                !notification.read ? 'bg-blue-50/30' : ''
            }`}
        >

            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center flex-1 min-w-0">
                    <span className="text-sm font-bold text-zinc-800 truncate">
                        {payload?.profileDescription || payload?.sensorDescription || '센서'} {getLevelInfo(payload?.level || notification.level || '').text} 발생
                    </span>
                </div>
                <span className="text-xs text-neutral-400 whitespace-nowrap ml-2">
                    {getRelativeTime(notification.timestamp)}
                </span>
            </div>
            <div className="flex gap-2.5 items-center">
                <img
                    src={getLevelIconPath()}
                    alt={notification.level || 'notification'}
                    className="w-7 h-7 flex-shrink-0"
                />
                <div className="space-y-1">
                    <div className="text-sm text-zinc-800 m-0">
                        {payload?.siteName || '알 수 없음'}
                    </div>
                    <div className={`text-xs ${getLevelColor(notification.level)}`}>
                        {payload?.sensorDescription || ''}: {notification.payload.deviceId}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function NotificationPop({
    notifications,
    unreadCount,
    open,
    onOpenChange,
    onMarkAsRead,
}: NotificationPanelProps) {
    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 relative">
                    <Bell className="size-4" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 -right-1 size-4 flex items-center justify-center p-0 text-[10px] bg-red-600 text-white rounded-full">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                side="right"
                align="start"
                className="w-96 p-3.5 bg-gray-100 rounded-2xl border-0 relative left-10 top-[-4px] shadow-[-4px_8px_15px_0px_rgba(0,0,0,0.15)]"
            >
                <svg
                    width="21"
                    height="25"
                    viewBox="0 0 21 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute -left-5 top-3 z-30"
                >
                    <path d="M0 12.1243L21 -8.7738e-05V24.2486L0 12.1243Z" fill="#EFF1F4"/>
                </svg>

                <div className="flex flex-col">

                    <div className="relative">
                        <div className="max-h-[540px] overflow-y-auto space-y-2.5 scrollbar-thin">
                            {notifications.length === 0 ? (
                                <div className="min-h-48 bg-white rounded-2xl flex flex-col items-center justify-center text-gray-400">
                                    <Bell className="size-10 mb-2" />
                                    <p className="text-sm">알림이 없습니다</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onMarkAsRead={onMarkAsRead}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
