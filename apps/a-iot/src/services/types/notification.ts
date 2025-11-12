import type { Event } from '../../services/types';

export interface ConnectionErrorPayload {
    deviceId: string;
    message: string;
    objectId: string;
    siteId: number;
}

export type NotificationType = 'sensor-alarm' | 'connection-error';

export interface Notification {
    id: string;
    eventId?: number;
    type: NotificationType;
    title: string;
    siteName?: string;
    message: string;
    timestamp: Date;
    level?: 'DANGER' | 'WARNING' | 'CAUTION' | 'NORMAL' | 'DISCONNECTED';
    payload: Event | ConnectionErrorPayload;
    read?: boolean;
}

export interface NotificationStore {
    notifications: Notification[];
    unreadCount: number;
    isConnected: boolean;
}
