export interface ConnectionErrorPayload {
    deviceId: string;
    message: string;
    objectId: string;
    siteId: number;
}

export interface SensorAlarmPayload {
    eventId?: number;
    deviceId: string;
    eventName?: string;
    fieldKey?: string;
    guideMessage?: string;
    lat?: number;
    lon?: number;
    level?: string;
    maxValue?: number;
    message: string;
    minValue?: number;
    objectId: string;
    profileDescription?: string;
    sensorDescription?: string;
    sensorType?: string;
    siteId: number;
    siteName?: string;
    status?: 'PENDING' | 'WORKING' | 'RESOLVED';
    timestamp?: string;
    unit?: string;
    value?: number;
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
    payload: SensorAlarmPayload | ConnectionErrorPayload;
    read?: boolean;
}

export interface NotificationStore {
    notifications: Notification[];
    unreadCount: number;
    isConnected: boolean;
}
