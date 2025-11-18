import { create } from 'zustand';
import type { Notification } from '../services/types';

const MAX_NOTIFICATIONS = 50;

export interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isInitialized: boolean;
}

interface NotificationActions {
    addNotification: (notification: Notification) => void;
    setNotifications: (notifications: Notification[]) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
    setInitialized: (initialized: boolean) => void;
    updateUnreadCount: () => void;
}

type NotificationStore = NotificationState & NotificationActions;

export const useNotificationStore = create<NotificationStore>()((set) => ({
    notifications: [],
    unreadCount: 0,
    isInitialized: false,

    addNotification: (notification) => {
        const normalizedNotification = {
            ...notification,
            timestamp: notification.timestamp
        };
        set((state) => {
            const key = normalizedNotification.eventId ? `event-${normalizedNotification.eventId}` : normalizedNotification.id;
            const existingIndex = state.notifications.findIndex(n => {
                const existingKey = n.eventId ? `event-${n.eventId}` : n.id;
                return existingKey === key;
            });

            let newNotifications: Notification[];

            if (existingIndex >= 0) {
                newNotifications = [...state.notifications];
                newNotifications[existingIndex] = normalizedNotification;
            } else {
                newNotifications = [normalizedNotification, ...state.notifications];
            }

            newNotifications = newNotifications.slice(0, MAX_NOTIFICATIONS);

            const unreadCount = newNotifications.filter(n => {
                if (n.type === 'sensor-alarm' && n.payload) {
                    const payload = n.payload as any;
                    return payload.status === 'ACTIVE';
                }
                return false;
            }).length;

            return {
                notifications: newNotifications,
                unreadCount
            };
        });
    },

    setNotifications: (notifications) => {
        set(() => {
            const normalized = notifications.map(n => ({
                ...n,
                timestamp: n.timestamp
            }));

            const sorted = normalized
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .slice(0, MAX_NOTIFICATIONS);

            const unreadCount = sorted.filter(n => {
                if (n.type === 'sensor-alarm' && n.payload) {
                    const payload = n.payload as any;
                    return payload.status === 'ACTIVE';
                }
                return false;
            }).length;

            return {
                notifications: sorted,
                unreadCount
            };
        });
    },

    markAsRead: (id) => {
        set((state) => {
            const updated = state.notifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            );
            const unreadCount = updated.filter(n => {
                if (n.type === 'sensor-alarm' && n.payload) {
                    const payload = n.payload as any;
                    return payload.status === 'ACTIVE';
                }
                return false;
            }).length;
            return { notifications: updated, unreadCount };
        });
    },

    markAllAsRead: () => {
        set((state) => {
            const updated = state.notifications.map(n => ({ ...n, read: true }));
            const unreadCount = updated.filter(n => {
                if (n.type === 'sensor-alarm' && n.payload) {
                    const payload = n.payload as any;
                    return payload.status === 'ACTIVE';
                }
                return false;
            }).length;
            return {
                notifications: updated,
                unreadCount
            };
        });
    },

    clearNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
    },

    setInitialized: (initialized) => {
        set({ isInitialized: initialized });
    },

    updateUnreadCount: () => {
        set((state) => {
            const unreadCount = state.notifications.filter(n => {
                if (n.type === 'sensor-alarm' && n.payload) {
                    const payload = n.payload as any;
                    return payload.status === 'ACTIVE';
                }
                return false;
            }).length;
            return { unreadCount };
        });
    }
}));
