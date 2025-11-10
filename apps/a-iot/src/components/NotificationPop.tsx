import { Bell } from 'lucide-react';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@plug-atlas/ui';
import { Notification, SensorAlarmPayload } from "../services/types";
import { useState } from 'react';

interface NotificationPanelProps {
    notifications: Notification[];
    unreadCount: number;
    isConnected: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onMarkAsRead?: (id: string) => void;
    onMarkAllAsRead?: () => void;
    onClearAll?: () => void;
}

const getLevelColor = (level?: string) => {
    switch (level) {
        case 'DANGER':
            return 'text-red-700';
        case 'WARNING':
            return 'text-amber-700';
        case 'CAUTION':
            return 'text-orange-600';
        case 'DISCONNECTED':
            return 'text-purple-700';
        case 'NORMAL':
            return 'text-green-600';
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
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<string>(
        notification.type === 'sensor-alarm'
            ? (notification.payload as SensorAlarmPayload).status
            : ''
    );

    const handleClick = () => {
        if (!notification.read && onMarkAsRead) {
            onMarkAsRead(notification.id);
        }
    };

    const handleAction = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (notification.type !== 'sensor-alarm') return;

        const payload = notification.payload as SensorAlarmPayload;
        setIsUpdating(true);

        try {
                // TODO: Replace with actual API endpoint
                const response = await fetch('/api/sensor-alarms/action', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        deviceId: payload.deviceId,
                        objectId: payload.objectId,
                        status: 'WORKING',
                    }),
                });

            if (response.ok) {
                setCurrentStatus('WORKING');
                console.log('[NotificationItem] Status updated to WORKING');
            }
        } catch (error) {
            console.error('[NotificationItem] Failed to update status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const getLevelBgColor = () => {
        switch (notification.level) {
            case 'DANGER':
                return 'bg-red-600';
            case 'WARNING':
                return 'bg-amber-600';
            case 'CAUTION':
                return 'bg-orange-600';
            case 'DISCONNECTED':
                return 'bg-purple-600';
            case 'NORMAL':
                return 'bg-green-600';
            default:
                return 'bg-gray-400';
        }
    };

    const showActionButton = notification.type === 'sensor-alarm' &&
                             (currentStatus === 'PENDING' || currentStatus === 'WORKING');

    return (
        <div
            onClick={handleClick}
            className={`bg-white rounded-2xl p-4 outline outline-offset-[-1px] outline-neutral-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                !notification.read ? 'bg-blue-50/30' : ''
            }`}
        >

            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`w-7 h-7 rounded-full flex-shrink-0 ${getLevelBgColor()}`} />
                    <span className="text-sm font-bold text-zinc-800 truncate">
                        {notification.title}
                    </span>
                </div>
                <span className="text-xs text-neutral-400 whitespace-nowrap ml-2">
                    {getRelativeTime(notification.timestamp)}
                </span>
            </div>
            <div className="flex justify-between items-center">
                <div className="ml-9 space-y-1">
                    <div className="text-sm text-zinc-800">
                        {notification.siteName || '알 수 없음'}
                    </div>
                    <div className={`text-xs ${getLevelColor(notification.level)}`}>
                        {notification.message}
                    </div>
                </div>

                {showActionButton && (
                    <div className="ml-9 mt-3">
                        <Button
                            size="sm"
                            variant={currentStatus === 'PENDING' ? 'default' : 'secondary'}
                            onClick={handleAction}
                            disabled={currentStatus === 'WORKING' || isUpdating}
                            className="h-7 px-3 text-xs"
                        >
                            {isUpdating ? '처리 중...' : currentStatus === 'WORKING' ? '조치 중' : '조치하기'}
                        </Button>
                    </div>
                )}
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
    console.log('[NotificationPop] Rendering with:', {
        notificationCount: notifications.length,
        unreadCount,
        notifications
    });

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 relative">
                    <Bell className="size-4" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 size-4 flex items-center justify-center p-0 text-xs bg-red-600 text-white rounded-full">
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
