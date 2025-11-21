import { useEffect, useRef, useCallback } from 'react';
import { useEventStore } from '../../stores';
import type { Event, EventStatus } from '../types';

/**
 * 이벤트 업데이트를 구독하는 훅
 * Cesium 마커나 다른 컴포넌트에서 이벤트 상태 변경을 실시간으로 감지할 수 있습니다.
 *
 * @example
 * ```tsx
 * // Cesium 컴포넌트에서 사용
 * function CesiumMarkers() {
 *   const events = useEventUpdates({
 *     siteId: 1,  // 특정 사이트만
 *     status: 'ACTIVE',  // ACTIVE 이벤트만
 *     onChange: (event) => {
 *       // 마커 색상 업데이트
 *       updateMarkerColor(event.eventId, event.status);
 *     }
 *   });
 *
 *   return <Markers events={events} />;
 * }
 * ```
 */

interface UseEventUpdatesOptions {
    /** 특정 사이트의 이벤트만 필터링 */
    siteId?: number;
    /** 특정 상태의 이벤트만 필터링 */
    status?: EventStatus;
    /** 이벤트가 업데이트될 때 호출되는 콜백 */
    onChange?: (event: Event, previousEvent?: Event) => void;
    /** 이벤트가 추가될 때 호출되는 콜백 */
    onAdd?: (event: Event) => void;
    /** 이벤트가 제거될 때 호출되는 콜백 */
    onRemove?: (eventId: number) => void;
}

export function useEventUpdates(options: UseEventUpdatesOptions = {}) {
    const { siteId, status, onChange, onAdd, onRemove } = options;

    const getAllEvents = useEventStore((state) => state.getAllEvents);
    const getEventsBySite = useEventStore((state) => state.getEventsBySite);
    const getEventsByStatus = useEventStore((state) => state.getEventsByStatus);

    // 이전 이벤트 상태를 저장
    const previousEventsRef = useRef<Map<number, Event>>(new Map());

    // 필터링된 이벤트 가져오기
    const getFilteredEvents = useCallback(() => {
        let events: Event[] = [];

        if (siteId !== undefined) {
            events = getEventsBySite(siteId);
        } else if (status !== undefined) {
            events = getEventsByStatus(status);
        } else {
            events = getAllEvents();
        }

        // 추가 필터링
        if (siteId !== undefined && status !== undefined) {
            events = events.filter(e => e.siteId === siteId && e.status === status);
        }

        return events;
    }, [siteId, status, getAllEvents, getEventsBySite, getEventsByStatus]);

    const events = getFilteredEvents();

    // 이벤트 변경 감지
    useEffect(() => {
        const currentEventsMap = new Map(events.map(e => [e.eventId, e]));
        const previousEventsMap = previousEventsRef.current;

        // 새로 추가된 이벤트 감지
        events.forEach(event => {
            if (!previousEventsMap.has(event.eventId)) {
                onAdd?.(event);
            }
        });

        // 업데이트된 이벤트 감지
        events.forEach(event => {
            const previousEvent = previousEventsMap.get(event.eventId);
            if (previousEvent) {
                // 이벤트가 변경되었는지 확인 (status, level, updatedAt 등)
                if (
                    previousEvent.status !== event.status ||
                    previousEvent.level !== event.level ||
                    previousEvent.updatedAt !== event.updatedAt
                ) {
                    onChange?.(event, previousEvent);
                }
            }
        });

        // 제거된 이벤트 감지
        previousEventsMap.forEach((_, eventId) => {
            if (!currentEventsMap.has(eventId)) {
                onRemove?.(eventId);
            }
        });

        // 현재 상태를 이전 상태로 업데이트
        previousEventsRef.current = currentEventsMap;
    }, [events, onChange, onAdd, onRemove]);

    return events;
}

/**
 * 특정 이벤트의 실시간 업데이트를 구독하는 훅
 *
 * @example
 * ```tsx
 * function EventDetail({ eventId }: { eventId: number }) {
 *   const event = useEventById(eventId);
 *
 *   if (!event) return <div>이벤트를 찾을 수 없습니다</div>;
 *
 *   return <div>상태: {event.status}</div>;
 * }
 * ```
 */
export function useEventById(eventId: number) {
    const getEvent = useEventStore((state) => state.getEvent);
    return getEvent(eventId);
}

/**
 * 특정 사이트의 이벤트를 구독하는 훅
 *
 * @example
 * ```tsx
 * function SiteEvents({ siteId }: { siteId: number }) {
 *   const events = useEventsBySite(siteId);
 *
 *   return (
 *     <div>
 *       {events.map(event => (
 *         <EventCard key={event.eventId} event={event} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useEventsBySite(siteId: number) {
    const getEventsBySite = useEventStore((state) => state.getEventsBySite);
    return getEventsBySite(siteId);
}

/**
 * 특정 상태의 이벤트를 구독하는 훅
 *
 * @example
 * ```tsx
 * function ActiveEvents() {
 *   const activeEvents = useEventsByStatus('ACTIVE');
 *
 *   return <div>진행 중인 이벤트: {activeEvents.length}개</div>;
 * }
 * ```
 */
export function useEventsByStatus(status: EventStatus) {
    const getEventsByStatus = useEventStore((state) => state.getEventsByStatus);
    return getEventsByStatus(status);
}
