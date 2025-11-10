import { useEffect, useState, useCallback, useRef } from 'react';
import { Client, StompSubscription } from '@stomp/stompjs';
import type { Notification, SensorAlarmPayload, ConnectionErrorPayload } from '../types';

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

export function useStompNotifications(): UseStompNotificationsReturn {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);

    const clientRef = useRef<Client | null>(null);
    const subscriptionsRef = useRef<StompSubscription[]>([]);

    const addNotification = useCallback((notification: Notification) => {
        console.log('[NOTIFICATION] Adding notification:', notification);
        setNotifications(prev => {
            const updated = [notification, ...prev].slice(0, MAX_NOTIFICATIONS);
            console.log('[NOTIFICATION] Updated notifications list:', updated);
            return updated;
        });
        setUnreadCount(prev => {
            const newCount = prev + 1;
            console.log('[NOTIFICATION] Updated unread count:', newCount);
            return newCount;
        });
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
    }, []);

    const sendTestMessage = useCallback(() => {
        const client = clientRef.current;
        if (!client || !isConnected) {
            console.warn('[STOMP] Client not connected. Cannot send test message.');
            return;
        }

        const testPayload = {
            deviceId: "SNIOT-P-FIR-005",
            eventName: "화재 발생",
            fieldKey: "Fire Alarm",
            guideMessage: "불이 났어요",
            lat: 37.3948,
            level: "DANGER",
            lon: 127.1114,
            maxValue: 1.1,
            message: "테스트 화재 알람",
            minValue: 1.1,
            objectId: "34956",
            sensorDescription: "화재감지",
            sensorType: "Boolean",
            siteId: 1,
            siteName: "중앙공원",
            status: "PENDING",
            timestamp: new Date().toISOString(),
            unit: "-",
            value: 1.1
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
                            siteName: payload.sensorDescription,
                            message: payload.message || payload.guideMessage,
                            timestamp: new Date(payload.timestamp),
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

                // Also subscribe to user-specific queue (in case backend sends there)
                console.log('[STOMP] Subscribing to /user/queue/sensor-alarm');
                const userSensorAlarmSub = client.subscribe('/user/queue/sensor-alarm', (message: any) => {
                    console.log('[STOMP] ✅ Received from /user/queue/sensor-alarm:', message.body);
                    try {
                        const payload: SensorAlarmPayload = JSON.parse(message.body);
                        const notification: Notification = {
                            id: `sensor-${Date.now()}-${Math.random()}`,
                            type: 'sensor-alarm',
                            title: payload.eventName || '센서 알람',
                            siteName: payload.sensorDescription,
                            message: payload.message || payload.guideMessage,
                            timestamp: new Date(payload.timestamp),
                            level: payload.level as any,
                            payload,
                        };
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
