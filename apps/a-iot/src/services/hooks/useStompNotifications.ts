import { useEffect, useState, useCallback, useRef } from 'react';
import { Client, StompSubscription, IMessage } from '@stomp/stompjs';
import type { Notification, SensorAlarmPayload, ConnectionErrorPayload } from '../types';
import { useEvents } from './useEventsManagement';
import type { Event } from '../types';

const getWebSocketUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  return `${protocol}//${host}/api/stomp/platform`;
};

const STOMP_ENDPOINT = getWebSocketUrl();
const MAX_NOTIFICATIONS = 50;

interface UseStompNotificationsReturn {
    notifications: Notification[];
    unreadCount: number;
    isConnected: boolean;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
}

const eventToNotification = (event: Event): Notification => {
    return {
        id: `event-${event.eventId}`,
        eventId: event.eventId,
        type: 'sensor-alarm',
        title: event.eventName,
        siteName: event.deviceId,
        message: event.guideMessage,
        timestamp: new Date(event.occurredAt),
        level: event.level as any,
        payload: {
            deviceId: event.deviceId,
            eventName: event.eventName,
            fieldKey: event.fieldKey,
            guideMessage: event.guideMessage,
            lat: event.latitude,
            lon: event.longitude,
            level: event.level,
            maxValue: event.maxValue,
            message: event.guideMessage,
            minValue: event.minValue,
            objectId: event.objectId,
            sensorDescription: event.sensorDescription,
            sensorType: 'Unknown',
            siteId: 0,
            status: event.status as 'PENDING' | 'WORKING' | 'RESOLVED',
            timestamp: event.occurredAt,
            unit: '',
            value: event.minValue,
            profileDescription: event.profileDescription,
            siteName: event.siteName
        },
        read: false,
    };
};

export function useStompNotifications(): UseStompNotificationsReturn {
    const [realtimeNotifications, setRealtimeNotifications] = useState<Notification[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    const clientRef = useRef<Client | null>(null);
    const subscriptionsRef = useRef<StompSubscription[]>([]);

    const { data: pendingEvents = [] } = useEvents(
        { status: 'PENDING' },
        { refreshInterval: 5000 }
    );

    const apiNotifications = pendingEvents.map(eventToNotification);

    const allNotifications = [...realtimeNotifications, ...apiNotifications];
    const uniqueNotifications = allNotifications.reduce((acc, notification) => {
        const key = notification.eventId ? `event-${notification.eventId}` : notification.id;
        if (!acc.has(key)) {
            acc.set(key, notification);
        }
        return acc;
    }, new Map<string, Notification>());

    const notifications = Array.from(uniqueNotifications.values())
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, MAX_NOTIFICATIONS);

    const unreadCount = pendingEvents.length;

    const addNotification = useCallback((notification: Notification) => {
        setRealtimeNotifications(prev => {
            const updated = [notification, ...prev].slice(0, MAX_NOTIFICATIONS);
            return updated;
        });
    }, []);

    const markAsRead = useCallback((id: string) => {
        setRealtimeNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setRealtimeNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const clearNotifications = useCallback(() => {
        setRealtimeNotifications([]);
    }, []);

    useEffect(() => {
        const client = new Client({
            brokerURL: STOMP_ENDPOINT,
            reconnectDelay: 5000,
            heartbeatIncoming: 5000,
            heartbeatOutgoing: 5000,
            onConnect: () => {
                setIsConnected(true);

                const sensorAlarmSub = client.subscribe('/queue/sensor-alarm', (message: IMessage) => {
                    try {
                        const payload: SensorAlarmPayload = JSON.parse(message.body);
                        const notification: Notification = {
                            id: `sensor-${Date.now()}-${Math.random()}`,
                            type: 'sensor-alarm',
                            title: payload.eventName || '센서 알람',
                            siteName: payload.siteName || payload.sensorDescription,
                            message: payload.message || payload.guideMessage || '',
                            timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
                            level: payload.level as Notification['level'],
                            payload,
                        };
                        addNotification(notification);
                    } catch (error) {
                        // Silent error handling
                    }
                });
                subscriptionsRef.current.push(sensorAlarmSub);

                const userSensorAlarmSub = client.subscribe('/user/queue/sensor-alarm', (message: IMessage) => {
                    try {
                        const payload: SensorAlarmPayload = JSON.parse(message.body);
                        const notification: Notification = {
                            id: `sensor-${Date.now()}-${Math.random()}`,
                            type: 'sensor-alarm',
                            title: payload.eventName || '센서 알람',
                            siteName: payload.siteName || payload.sensorDescription,
                            message: payload.message || payload.guideMessage || '',
                            timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
                            level: payload.level as Notification['level'],
                            payload,
                        };
                        addNotification(notification);
                    } catch (error) {
                        // Silent error handling
                    }
                });
                subscriptionsRef.current.push(userSensorAlarmSub);

                const connectionErrorSub = client.subscribe('/queue/connection-error', (message: IMessage) => {
                    try {
                        const payload: ConnectionErrorPayload = JSON.parse(message.body);
                        const notification: Notification = {
                            id: `error-${Date.now()}-${Math.random()}`,
                            type: 'connection-error',
                            title: '연결 오류',
                            siteName: payload.objectId,
                            message: payload.message,
                            timestamp: new Date(),
                            level: 'DISCONNECTED',
                            payload,
                        };
                        addNotification(notification);
                    } catch (error) {
                        // Silent error handling
                    }
                });
                subscriptionsRef.current.push(connectionErrorSub);
            },
            onDisconnect: () => {
                setIsConnected(false);
            },
            onStompError: () => {
                // Silent error handling
            },
        });

        clientRef.current = client;
        client.activate();

        return () => {
            subscriptionsRef.current.forEach(sub => sub.unsubscribe());
            subscriptionsRef.current = [];
            client.deactivate();
        };
    }, [addNotification]);

    return {
        notifications,
        unreadCount,
        isConnected,
        markAsRead,
        markAllAsRead,
        clearNotifications,
    };
}
