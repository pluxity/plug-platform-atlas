import {useEffect, useRef, useState} from 'react';
import {Client, IMessage, StompSubscription} from '@stomp/stompjs';
import type {ConnectionErrorPayload, Notification, Event} from '../types';
import {useNotificationStore, useEventStore} from '../../stores';

const getWebSocketUrl = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    return `${protocol}//${host}${apiUrl}/stomp/platform`;
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
    const addEvent = useEventStore((state) => state.addEvent);
    const updateEvent = useEventStore((state) => state.updateEvent);

    useEffect(() => {
        const client = new Client({
            brokerURL: STOMP_ENDPOINT,
            reconnectDelay: 5000,
            heartbeatIncoming: 5000,
            heartbeatOutgoing: 5000,
            onConnect: () => {
                setIsConnected(true);

                const sensorAlarmSub = client.subscribe('/user/queue/sensor-alarm', (message: IMessage) => {
                    try {
                        const payload: Event = JSON.parse(message.body);

                        // EventStore에 이벤트 추가/업데이트
                        addEvent(payload);

                        // Notification 생성
                        const notification: Notification = {
                            id: `sensor-${Date.now()}-${Math.random()}`,
                            type: 'sensor-alarm',
                            title: payload.eventName || '센서 알람',
                            siteName: payload.siteName || payload.sensorDescription,
                            message: payload.guideMessage || '',
                            timestamp: payload.occurredAt ? new Date(payload.occurredAt) : new Date(),
                            level: payload.level as Notification['level'],
                            payload,
                        };
                        addNotification(notification);
                    } catch (error) {
                    }
                });
                subscriptionsRef.current.push(sensorAlarmSub);

                const connectionErrorSub = client.subscribe('/user/queue/connection-error', (message: IMessage) => {
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
                    }
                });
                subscriptionsRef.current.push(connectionErrorSub);

                const changeEventStatusSub = client.subscribe('/user/queue/change-event-status', (message: IMessage) => {
                    try {
                        const updatedEvent: Event = JSON.parse(message.body);

                        // EventStore에 이벤트 상태 업데이트 (가장 중요!)
                        updateEvent(updatedEvent.eventId, updatedEvent);

                        // Notification 업데이트
                        const notification: Notification = {
                            id: `event-${updatedEvent.eventId}`,
                            eventId: updatedEvent.eventId,
                            type: 'sensor-alarm',
                            title: updatedEvent.eventName,
                            siteName: updatedEvent.deviceId,
                            message: updatedEvent.guideMessage,
                            timestamp: new Date(updatedEvent.occurredAt),
                            level: updatedEvent.level as Notification['level'],
                            payload: updatedEvent,
                        };
                        addNotification(notification);
                    } catch (error) {
                    }
                });
                subscriptionsRef.current.push(changeEventStatusSub);
            },
            onDisconnect: () => {
                setIsConnected(false);
            },
            onStompError: () => {
            },
        });

        clientRef.current = client;
        client.activate();

        return () => {
            subscriptionsRef.current.forEach(sub => sub.unsubscribe());
            subscriptionsRef.current = [];
            client.deactivate();
        };
    }, [addNotification, addEvent, updateEvent]);

    return {
        isConnected,
    };
}