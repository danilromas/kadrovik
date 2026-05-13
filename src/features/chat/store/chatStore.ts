import { create } from 'zustand'
import type { Attachment, Chat, Message } from '@/shared/types'
import { mockChats, mockMessages } from '@/shared/mocks/chat'
import { useAuthStore } from '@/features/auth/store/authStore'

interface ChatState {
  chats: Chat[]
  activeChat: Chat | null
  messages: Message[]
  isLoading: boolean

  fetchChats: () => Promise<void>
  selectChat: (chatId: string) => Promise<void>
  sendMessage: (content: string, attachments?: File[]) => Promise<void>
  markAsRead: (chatId: string) => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  activeChat: null,
  messages: [],
  isLoading: false,

  fetchChats: async () => {
    set({ isLoading: true })
    await new Promise((resolve) => setTimeout(resolve, 500))
    set({ chats: mockChats, isLoading: false })
  },

  selectChat: async (chatId) => {
    set({ isLoading: true })
    const chat = get().chats.find((c) => c.id === chatId) || null

    await new Promise((resolve) => setTimeout(resolve, 300))

    const selfId = useAuthStore.getState().user?.id ?? 'user-1'
    const messages = mockMessages
      .filter((m) => m.chatId === chatId)
      .map((m) => (m.senderId !== selfId ? { ...m, isRead: true } : m))
    set({ activeChat: chat, messages, isLoading: false })
  },

  sendMessage: async (content, attachments) => {
    const activeChat = get().activeChat
    if (!activeChat) return

    const senderId = useAuthStore.getState().user?.id ?? 'user-1'
    const files = attachments ?? []
    const attachmentEntities: Attachment[] = files.map((file, i) => ({
      id: `att-${Date.now()}-${i}`,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'file',
      size: file.size,
    }))

    const trimmed = content.trim()
    const text =
      trimmed ||
      (attachmentEntities.length
        ? `📎 ${attachmentEntities.map((a) => a.name).join(', ')}`
        : '')

    if (!text && attachmentEntities.length === 0) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId: activeChat.id,
      senderId,
      content: text,
      attachments: attachmentEntities.length ? attachmentEntities : undefined,
      isRead: false,
      createdAt: new Date().toISOString(),
    }

    set((state) => ({
      messages: [...state.messages, newMessage],
    }))
  },

  markAsRead: (chatId) => {
    set((state) => ({
      chats: state.chats.map((c) => (c.id === chatId ? { ...c, unreadCount: 0 } : c)),
    }))
  },
}))
