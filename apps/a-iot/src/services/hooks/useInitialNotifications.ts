// External packages
import { useEffect } from 'react'

// Internal imports
import { useEvents } from '@/services/hooks/useEventsManagement'
import type { Event, Notification } from '@/services/types'
import { useEventStore, useNotificationStore } from '@/stores'

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
    const { setEvents } = useEventStore();

    // 전체 이벤트 로드 (status 필터 제거 - 모든 이벤트를 eventStore에 저장)
    const { data: allEvents, isLoading } = useEvents(
        undefined, // 필터 없이 전체 이벤트 조회
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            shouldRetryOnError: false
        }
    );

    useEffect(() => {
        if (!isInitialized && allEvents && !isLoading) {
            // EventStore 초기화 (전체 이벤트 저장)
            setEvents(allEvents);

            // NotificationStore 초기화 (ACTIVE 이벤트만 알림으로 표시)
            const activeEvents = allEvents.filter(event => event.status === 'ACTIVE');
            const notifications = activeEvents.map(eventToNotification);
            setNotifications(notifications);
            setInitialized(true);
        }
    }, [isInitialized, allEvents, isLoading, setNotifications, setInitialized, setEvents]);

    return { isLoading, isInitialized };
}
