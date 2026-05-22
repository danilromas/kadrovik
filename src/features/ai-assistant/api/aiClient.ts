import type { AiChatResponse, AiMessage, AiUserRole } from '../types'
import { buildSystemPrompt } from '../prompts'
import type { AiPageContext } from '../types'

export async function sendAiMessage(params: {
  messages: AiMessage[]
  role: AiUserRole
  context: AiPageContext | null
}): Promise<AiChatResponse> {
  const systemPrompt = buildSystemPrompt(params.role, params.context)

  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemPrompt,
      messages: params.messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  })

  const text = await res.text()
  let data: AiChatResponse & { error?: string }
  try {
    data = JSON.parse(text) as AiChatResponse & { error?: string }
  } catch {
    throw new Error(
      res.ok
        ? 'Некорректный ответ сервера'
        : 'Сервер ИИ недоступен. Запустите сайт через npm run dev (не открывайте dist/index.html напрямую).'
    )
  }

  if (!res.ok) {
    throw new Error(data.error ?? 'Не удалось получить ответ')
  }

  if (!data.content?.trim()) {
    throw new Error('Пустой ответ от сервера')
  }

  return {
    content: data.content,
    source: data.source ?? 'fallback',
    warning: data.warning,
  }
}
