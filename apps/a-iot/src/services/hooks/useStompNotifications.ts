import {useEffect, useRef, useState} from 'react';
import {Client, IMessage, StompSubscription} from '@stomp/stompjs';
import type {ConnectionErrorPayload, Notification, SensorAlarmPayload} from '../types';
import {useNotificationStore} from '../../stores';

const getWebSocketUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  return `${protocol}//${host}/api/stomp/platform`;
};

const STOMP_ENDPOINT = getWebSocketUrl();

interface UseStompNotificationsReturn {
    isConnected: boolean;
}

export function useStompNotifications(): UseStompNotificationsReturn {
    const [isConnected, setIsConnected] = useState(false);
    const clientRef = useRef<Client | null>(null);
    const subscriptionsRef = useRef<StompSubscription[]>([]);

    const addNotification = useNotificationStore((state) => state.addNotification);

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
        isConnected,
    };
}
