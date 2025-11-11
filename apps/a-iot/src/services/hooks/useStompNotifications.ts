import { useEffect, useState, useCallback, useRef } from 'react';
import { Client, StompSubscription } from '@stomp/stompjs';
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
    sendTestMessage: () => void;
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

    useEffect(() => {
        console.log('[useStompNotifications] Merged notifications:', {
            realtimeCount: realtimeNotifications.length,
            apiPendingCount: pendingEvents.length,
            totalUniqueCount: notifications.length,
            unreadCount,
            notifications
        });
    }, [realtimeNotifications, pendingEvents, notifications, unreadCount]);

    const addNotification = useCallback((notification: Notification) => {
        console.log('[NOTIFICATION] Adding real-time notification:', notification);
        setRealtimeNotifications(prev => {
            const updated = [notification, ...prev].slice(0, MAX_NOTIFICATIONS);
            console.log('[NOTIFICATION] Updated real-time notifications list:', updated);
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

    const sendTestMessage = useCallback(() => {
        const client = clientRef.current;
        if (!client || !isConnected) {
            console.warn('[STOMP] Client not connected. Cannot send test message.');
            return;
        }

        const testPayload = {
            deviceId: "SNIOT-P-THM-001",
            fieldKey: "Temperature",
            lat: 37.3948,
            level: "DANGER",
            lon: 127.1114,
            maxValue: -10,
            message: "테스트 화재 알람",
            minValue: -20,
            objectId: "34954",
            profileDescription: "온도",
            sensorDescription: "온습도계",
            sensorType: "Float",
            siteId: 1,
            siteName: "율동공원",
            status: "PENDING",
            timestamp: new Date().toISOString(),
            unit: "-",
            value: -15
        };

        try {
            client.publish({
                destination: '/app/test/sensor-alarm',
                body: JSON.stringify(testPayload)
            });
            console.log('[STOMP] Test message sent:', testPayload);
        } catch (error) {
            console.error('[STOMP] Failed to send test message:', error);
        }
    }, [isConnected]);

    useEffect(() => {
        const client = new Client({
            brokerURL: STOMP_ENDPOINT,
            reconnectDelay: 5000,
            heartbeatIncoming: 5000,
            heartbeatOutgoing: 5000,
            debug: (str: string) => {
                console.log('[STOMP]', str);
            },
            onConnect: () => {
                console.log('[STOMP] Connected successfully!');
                setIsConnected(true);

                console.log('[STOMP] Subscribing to /queue/sensor-alarm');
                const sensorAlarmSub = client.subscribe('/queue/sensor-alarm', (message: any) => {
                    console.log('[STOMP] Received sensor alarm message:', message.body);
                    try {
                        const payload: SensorAlarmPayload = JSON.parse(message.body);
                        console.log('[STOMP] Parsed sensor alarm payload:', payload);
                        const notification: Notification = {
                            id: `sensor-${Date.now()}-${Math.random()}`,
                            type: 'sensor-alarm',
                            title: payload.eventName || '센서 알람',
                            siteName: payload.siteName || payload.sensorDescription,
                            message: payload.message || payload.guideMessage || '',
                            timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
                            level: payload.level as any,
                            payload,
                        };
                        console.log('[STOMP] Created notification object:', notification);
                        addNotification(notification);
                    } catch (error) {
                        console.error('[STOMP] Failed to parse sensor alarm:', error);
                    }
                });
                subscriptionsRef.current.push(sensorAlarmSub);
                console.log('[STOMP] Successfully subscribed to /queue/sensor-alarm');

                console.log('[STOMP] Subscribing to /user/queue/sensor-alarm');
                const userSensorAlarmSub = client.subscribe('/user/queue/sensor-alarm', (message: any) => {
                    console.log('[STOMP] ✅ Received from /user/queue/sensor-alarm:', message.body);
                    try {
                        const payload: SensorAlarmPayload = JSON.parse(message.body);
                        const notification: Notification = {
                            id: `sensor-${Date.now()}-${Math.random()}`,
                            type: 'sensor-alarm',
                            title: payload.eventName || '센서 알람',
                            siteName: payload.siteName || payload.sensorDescription,
                            message: payload.message || payload.guideMessage || '',
                            timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
                            level: payload.level as any,
                            payload,
                        };
                        console.log('[STOMP] Created user notification object:', notification);
                        addNotification(notification);
                    } catch (error) {
                        console.error('[STOMP] Failed to parse user sensor alarm:', error);
                    }
                });
                subscriptionsRef.current.push(userSensorAlarmSub);
                console.log('[STOMP] Successfully subscribed to /user/queue/sensor-alarm');

                console.log('[STOMP] Subscribing to /queue/connection-error');
                const connectionErrorSub = client.subscribe('/queue/connection-error', (message: any) => {
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
                        console.error('[STOMP] Failed to parse connection error:', error);
                    }
                });
                subscriptionsRef.current.push(connectionErrorSub);
                console.log('[STOMP] Successfully subscribed to /queue/connection-error');
                console.log('[STOMP] All subscriptions ready. Total subscriptions:', subscriptionsRef.current.length);
            },
            onDisconnect: () => {
                console.log('[STOMP] Disconnected');
                setIsConnected(false);
            },
            onStompError: (frame: any) => {
                console.error('[STOMP] Error:', frame.headers['message']);
                console.error('[STOMP] Details:', frame.body);
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
        sendTestMessage,
    };
}
