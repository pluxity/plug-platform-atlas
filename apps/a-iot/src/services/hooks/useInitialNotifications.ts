import { useEffect } from 'react';
import { useNotificationStore } from '../../stores';
import { useEvents } from './useEventsManagement';
import type { Event, Notification } from '../types';

const eventToNotification = (event: Event): Notification => {
    return {
        id: `event-${event.eventId}`,
        eventId: event.eventId,
        type: 'sensor-alarm',
        title: event.eventName,
        siteName: event.deviceId,
        message: event.guideMessage,
        timestamp: new Date(event.occurredAt),
        level: event.level as Notification['level'],
        payload: event,
        read: false,
    };
};

export function useInitialNotifications() {
    const { isInitialized, setInitialized, setNotifications } = useNotificationStore();

    const { data: pendingEvents, isLoading } = useEvents(
        { status: 'ACTIVE' },
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            shouldRetryOnError: false
        }
    );

    useEffect(() => {
        if (!isInitialized && pendingEvents && pendingEvents.length > 0 && !isLoading) {
            const notifications = pendingEvents.map(eventToNotification);
            setNotifications(notifications);
            setInitialized(true);
        }
    }, [isInitialized, pendingEvents, isLoading, setNotifications, setInitialized]);

    return { isLoading, isInitialized };
}
