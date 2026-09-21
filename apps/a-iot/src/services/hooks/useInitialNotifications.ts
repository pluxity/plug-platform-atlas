// External packages
import { useEffect } from 'react'

// Internal imports
import { useEvents } from '@/services/hooks/useEventsManagement'

import { useEventStore, useNotificationStore } from '@/stores'

export function useInitialNotifications() {
    const { isInitialized, setInitialized } = useNotificationStore();
    const { setEvents } = useEventStore();

    // 초기 이벤트 저장소 로드. 알림 목록은 GNB의 ACTIVE 커서 조회로 관리한다.
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
            // Preserve socket updates that arrived while the initial page was loading.
            const existing = useEventStore.getState().getAllEvents();
            setEvents([...new Map([...allEvents, ...existing].map(event => [event.eventId, event])).values()]);

            setInitialized(true);
        }
    }, [isInitialized, allEvents, isLoading, setInitialized, setEvents]);

    return { isLoading, isInitialized };
}
