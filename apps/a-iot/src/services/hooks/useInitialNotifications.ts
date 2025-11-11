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

/**
 * Hook to load initial PENDING events on mount
 * Only fetches once if not already initialized
 */
export function useInitialNotifications() {
    const { isInitialized, setInitialized, setNotifications } = useNotificationStore();

    // Only fetch if not initialized (don't use refreshInterval)
    const { data: pendingEvents, isLoading } = useEvents(
        { status: 'PENDING' },
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            shouldRetryOnError: false
        }
    );

    useEffect(() => {
        // Only load initial data once
        if (!isInitialized && pendingEvents && pendingEvents.length > 0 && !isLoading) {
            const notifications = pendingEvents.map(eventToNotification);
            setNotifications(notifications);
            setInitialized(true);
        }
    }, [isInitialized, pendingEvents, isLoading, setNotifications, setInitialized]);

    return { isLoading, isInitialized };
}
