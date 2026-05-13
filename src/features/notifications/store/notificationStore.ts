import { create } from 'zustand'
import type { Notification } from '@/shared/types'
import { mockNotifications } from '@/shared/mocks/notifications'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  
  fetchNotifications: () => Promise<void>
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true })
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const notifications = mockNotifications
    const unreadCount = notifications.filter(n => !n.isRead).length
    
    set({ notifications, unreadCount, isLoading: false })
  },

  markAsRead: (id) => {
    const notifications = get().notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    )
    const unreadCount = notifications.filter(n => !n.isRead).length
    set({ notifications, unreadCount })
  },

  markAllAsRead: () => {
    const notifications = get().notifications.map(n => ({ ...n, isRead: true }))
    set({ notifications, unreadCount: 0 })
  },

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    set(state => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
    }))
  },
}))
