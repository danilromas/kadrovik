export type AiUserRole = 'guest' | 'candidate' | 'employer' | 'admin'

export interface AiMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface AiPageContext {
  page: string
  summary: string
  data?: Record<string, string | number | string[] | undefined>
}

export interface AiChatResponse {
  content: string
  source: 'gemini' | 'groq' | 'fallback'
  warning?: string
}
