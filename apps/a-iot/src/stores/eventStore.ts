import { create } from 'zustand';
import type { Event, EventStatus } from '../services/types';

export interface EventState {
    events: Map<number, Event>; // eventId를 키로 사용
    eventsBySite: Map<number, Set<number>>; // siteId -> eventId Set
}

interface EventActions {
    setEvents: (events: Event[]) => void;
    addEvent: (event: Event) => void;
    updateEvent: (eventId: number, updates: Partial<Event>) => void;
    updateEventStatus: (eventId: number, status: EventStatus, updatedBy?: string) => void;
    removeEvent: (eventId: number) => void;
    getEvent: (eventId: number) => Event | undefined;
    getEventsBySite: (siteId: number) => Event[];
    getEventsByStatus: (status: EventStatus) => Event[];
    getAllEvents: () => Event[];
    clearEvents: () => void;
}

type EventStore = EventState & EventActions;

export const useEventStore = create<EventStore>()((set, get) => ({
    events: new Map(),
    eventsBySite: new Map(),

    setEvents: (events) => {
        const eventsMap = new Map<number, Event>();
        const siteMap = new Map<number, Set<number>>();

        events.forEach(event => {
            eventsMap.set(event.eventId, event);

            if (!siteMap.has(event.siteId)) {
                siteMap.set(event.siteId, new Set());
            }
            siteMap.get(event.siteId)!.add(event.eventId);
        });

        set({ events: eventsMap, eventsBySite: siteMap });
    },

    addEvent: (event) => {
        set((state) => {
            const newEvents = new Map(state.events);
            const newSiteMap = new Map(state.eventsBySite);

            newEvents.set(event.eventId, event);

            if (!newSiteMap.has(event.siteId)) {
                newSiteMap.set(event.siteId, new Set());
            }
            newSiteMap.get(event.siteId)!.add(event.eventId);

            return { events: newEvents, eventsBySite: newSiteMap };
        });
    },

    updateEvent: (eventId, updates) => {
        set((state) => {
            const existingEvent = state.events.get(eventId);
            if (!existingEvent) return state;

            const newEvents = new Map(state.events);
            const updatedEvent = { ...existingEvent, ...updates };
            newEvents.set(eventId, updatedEvent);

            return { events: newEvents };
        });
    },

    updateEventStatus: (eventId, status, updatedBy) => {
        set((state) => {
            const existingEvent = state.events.get(eventId);
            if (!existingEvent) return state;

            const newEvents = new Map(state.events);
            const updatedEvent: Event = {
                ...existingEvent,
                status,
                updatedAt: new Date().toISOString(),
                updatedBy: updatedBy || existingEvent.updatedBy,
            };
            newEvents.set(eventId, updatedEvent);

            return { events: newEvents };
        });
    },

    removeEvent: (eventId) => {
        set((state) => {
            const event = state.events.get(eventId);
            if (!event) return state;

            const newEvents = new Map(state.events);
            const newSiteMap = new Map(state.eventsBySite);

            newEvents.delete(eventId);

            const siteEvents = newSiteMap.get(event.siteId);
            if (siteEvents) {
                siteEvents.delete(eventId);
                if (siteEvents.size === 0) {
                    newSiteMap.delete(event.siteId);
                }
            }

            return { events: newEvents, eventsBySite: newSiteMap };
        });
    },

    getEvent: (eventId) => {
        return get().events.get(eventId);
    },

    getEventsBySite: (siteId) => {
        const eventIds = get().eventsBySite.get(siteId);
        if (!eventIds) return [];

        const eventsMap = get().events;
        return Array.from(eventIds)
            .map(id => eventsMap.get(id))
            .filter((event): event is Event => event !== undefined);
    },

    getEventsByStatus: (status) => {
        return Array.from(get().events.values()).filter(
            event => event.status === status
        );
    },

    getAllEvents: () => {
        return Array.from(get().events.values());
    },

    clearEvents: () => {
        set({ events: new Map(), eventsBySite: new Map() });
    },
}));
