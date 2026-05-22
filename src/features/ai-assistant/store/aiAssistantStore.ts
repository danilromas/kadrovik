import { create } from 'zustand'
import type { AiMessage } from '../types'
import { sendAiMessage } from '../api/aiClient'
import { canSendAiMessage, incrementAiUsage } from '../lib/dailyLimit'
import type { AiPageContext, AiUserRole } from '../types'

function newId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

interface AiAssistantState {
  isOpen: boolean
  messages: AiMessage[]
  isLoading: boolean
  error: string | null
  lastSource: 'gemini' | 'groq' | 'fallback' | null
  lastWarning: string | null
  role: AiUserRole
  context: AiPageContext | null
  open: () => void
  close: () => void
  toggle: () => void
  setRole: (role: AiUserRole) => void
  setContext: (context: AiPageContext | null) => void
  clearMessages: () => void
  openWithPrompt: (prompt: string) => void
  sendMessage: (text: string) => Promise<void>
}

export const useAiAssistantStore = create<AiAssistantState>((set, get) => ({
  isOpen: false,
  messages: [],
  isLoading: false,
  error: null,
  lastSource: null,
  lastWarning: null,
  role: 'guest',
  context: null,

  open: () => set({ isOpen: true, error: null }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen, error: null })),

  setRole: (role) => set({ role }),
  setContext: (context) => set({ context }),

  clearMessages: () => set({ messages: [], error: null, lastSource: null, lastWarning: null }),

  openWithPrompt: (prompt) => {
    set({ isOpen: true, error: null })
    void get().sendMessage(prompt)
  },

  sendMessage: async (text) => {
    const trimmed = text.trim()
    if (!trimmed) return

    if (!canSendAiMessage()) {
      set({ error: 'Достигнут лимит сообщений на сегодня (20). Попробуйте завтра.' })
      return
    }

    const userMsg: AiMessage = { id: newId(), role: 'user', content: trimmed }
    const { messages, role, context } = get()
    const nextMessages = [...messages, userMsg]

    set({ messages: nextMessages, isLoading: true, error: null })

    try {
      const { content, source, warning } = await sendAiMessage({
        messages: nextMessages,
        role,
        context,
      })
      incrementAiUsage()
      set({
        messages: [...nextMessages, { id: newId(), role: 'assistant', content }],
        isLoading: false,
        lastSource: source,
        lastWarning: warning ?? null,
      })
    } catch (e) {
      set({
        isLoading: false,
        error: e instanceof Error ? e.message : 'Ошибка запроса',
      })
    }
  },
}))
