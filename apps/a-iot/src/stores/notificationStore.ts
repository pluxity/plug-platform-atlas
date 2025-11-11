import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

export const useNotificationStore = create<NotificationStore>()(
    persist(
        (set, get) => ({
            notifications: [],
            unreadCount: 0,
            isInitialized: false,

            addNotification: (notification) => {
                // Ensure timestamp is a Date object
                const normalizedNotification = {
                    ...notification,
                    timestamp: notification.timestamp instanceof Date
                        ? notification.timestamp
                        : new Date(notification.timestamp)
                };
                set((state) => {
                    // Check for duplicates by eventId or id
                    const key = normalizedNotification.eventId ? `event-${normalizedNotification.eventId}` : normalizedNotification.id;
                    const existingIndex = state.notifications.findIndex(n => {
                        const existingKey = n.eventId ? `event-${n.eventId}` : n.id;
                        return existingKey === key;
                    });

                    let newNotifications: Notification[];

                    if (existingIndex >= 0) {
                        // Update existing notification
                        newNotifications = [...state.notifications];
                        newNotifications[existingIndex] = normalizedNotification;
                    } else {
                        // Add new notification to the beginning (stack)
                        newNotifications = [normalizedNotification, ...state.notifications];
                    }

                    // Keep only latest MAX_NOTIFICATIONS
                    newNotifications = newNotifications.slice(0, MAX_NOTIFICATIONS);

                    // Calculate unread count (notifications with read: false or PENDING status)
                    const unreadCount = newNotifications.filter(n => !n.read).length;

                    return {
                        notifications: newNotifications,
                        unreadCount
                    };
                });
            },

            setNotifications: (notifications) => {
                set(() => {
                    // Normalize timestamps and sort by timestamp (newest first)
                    const normalized = notifications.map(n => ({
                        ...n,
                        timestamp: n.timestamp instanceof Date ? n.timestamp : new Date(n.timestamp)
                    }));

                    const sorted = normalized
                        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                        .slice(0, MAX_NOTIFICATIONS);

                    const unreadCount = sorted.filter(n => !n.read).length;

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
                    const unreadCount = updated.filter(n => !n.read).length;
                    return { notifications: updated, unreadCount };
                });
            },

            markAllAsRead: () => {
                set((state) => ({
                    notifications: state.notifications.map(n => ({ ...n, read: true })),
                    unreadCount: 0
                }));
            },

            clearNotifications: () => {
                set({ notifications: [], unreadCount: 0 });
            },

            setInitialized: (initialized) => {
                set({ isInitialized: initialized });
            },

            updateUnreadCount: () => {
                set((state) => ({
                    unreadCount: state.notifications.filter(n => !n.read).length
                }));
            }
        }),
        {
            name: 'notification-storage',
            partialize: (state) => ({
                notifications: state.notifications,
                unreadCount: state.unreadCount,
                isInitialized: state.isInitialized
            }),
            // Custom merge function to convert timestamp strings to Date objects
            merge: (persistedState: any, currentState: NotificationStore) => {
                if (persistedState && persistedState.notifications) {
                    return {
                        ...currentState,
                        ...persistedState,
                        notifications: persistedState.notifications.map((n: Notification) => ({
                            ...n,
                            timestamp: new Date(n.timestamp)
                        }))
                    };
                }
                return { ...currentState, ...persistedState };
            }
        }
    )
);
