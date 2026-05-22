import type { Connect, Plugin } from 'vite'
import { loadEnv } from 'vite'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequestBody {
  messages: ChatMessage[]
  systemPrompt: string
}

type AiSource = 'gemini' | 'groq' | 'fallback'

const GEMINI_MODELS = ['gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-flash-8b']

function fallbackReply(userText: string, systemPrompt: string, hint?: string): string {
  const prefix = hint ? `${hint}\n\n---\n\n` : ''
  const t = userText.toLowerCase()
  if (t.includes('резюме') || t.includes('cv')) {
    return `${prefix}**Резюме (Крым):**\n- Укажите город: Симферополь, Севастополь, Ялта и т.д.\n- В «О себе» — 3–5 предложений с результатами.\n- Навыки — только релевантные вакансии.`
  }
  if (t.includes('ваканс') || t.includes('описан') || t.includes('должност')) {
    return `${prefix}**Текст вакансии:**\n1. Заголовок — должность + город.\n2. Обязанности — 5–7 пунктов.\n3. Требования и условия (зарплата, график).\n\nПример: «Менеджер, Ялта, от 80 000 ₽».`
  }
  if (t.includes('собесед') || t.includes('интервью')) {
    return `${prefix}**Собеседование:** подготовьте вопросы о задачах, уточните график и испытательный срок. В Крыму часто важна сезонность — спросите об этом.`
  }
  if (t.includes('симферополь') || t.includes('севастополь') || t.includes('ялт') || t.includes('крым')) {
    return `${prefix}На **КАДРОВИК** вакансии по всему Крыму. Откройте раздел «Вакансии» и выберите город в фильтре.`
  }
  if (systemPrompt.includes('работодатель')) {
    return `${prefix}Опишите должность, город и зарплату — подскажу структуру вакансии и вопросы кандидатам.`
  }
  return `${prefix}Я помощник **КАДРОВИК** (работа в Крыму). Спросите про вакансии, резюме или собеседование — отвечу по делу.`
}

async function callGemini(apiKey: string, systemPrompt: string, messages: ChatMessage[]): Promise<string> {
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  let lastError = 'Gemini недоступен'

  for (const model of GEMINI_MODELS) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      }
    )

    if (res.ok) {
      const data = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[]
      }
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) return text
    }

    const errText = await res.text()
    lastError = `${model}: ${res.status} ${errText.slice(0, 180)}`
    if (res.status !== 429 && res.status !== 404) break
  }

  throw new Error(lastError)
}

async function callGroq(apiKey: string, systemPrompt: string, messages: ChatMessage[]): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Groq: ${res.status} ${errText.slice(0, 200)}`)
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
  const text = data.choices?.[0]?.message?.content
  if (!text) throw new Error('Пустой ответ Groq')
  return text
}

function quotaHint(hasGemini: boolean, hasGroq: boolean): string | undefined {
  if (hasGemini && !hasGroq) {
    return '⚠️ **Лимит Google Gemini исчерпан.** Сейчас ответ из встроенной базы знаний. Подождите до завтра или добавьте бесплатный ключ `GROQ_API_KEY` в `.env` (console.groq.com).'
  }
  if (hasGemini || hasGroq) {
    return '⚠️ **Внешний ИИ временно недоступен.** Ниже — ответ встроенного помощника.'
  }
  return 'ℹ️ **Демо-режим.** Добавьте `GEMINI_API_KEY` или `GROQ_API_KEY` в `.env` для умных ответов.'
}

function createAiMiddleware(geminiKey?: string, groqKey?: string): Connect.NextHandleFunction {
  return (req, res, next) => {
    if (req.method !== 'POST' || !req.url?.startsWith('/api/ai/chat')) {
      next()
      return
    }

    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => {
      void (async () => {
        try {
          const body = Buffer.concat(chunks).toString('utf8')
          const parsed = JSON.parse(body) as ChatRequestBody
          const messages = parsed.messages ?? []
          const systemPrompt = parsed.systemPrompt ?? ''
          const lastUser = [...messages].reverse().find((m) => m.role === 'user')

          if (!lastUser?.content?.trim()) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify({ error: 'Нет сообщения пользователя' }))
            return
          }

          let content: string
          let source: AiSource = 'fallback'
          let warning: string | undefined

          const tryGemini = Boolean(geminiKey?.trim())
          const tryGroq = Boolean(groqKey?.trim())

          if (tryGemini) {
            try {
              content = await callGemini(geminiKey!.trim(), systemPrompt, messages)
              source = 'gemini'
            } catch (e) {
              warning = quotaHint(true, tryGroq)
              if (tryGroq) {
                try {
                  content = await callGroq(groqKey!.trim(), systemPrompt, messages)
                  source = 'groq'
                  warning = undefined
                } catch {
                  content = fallbackReply(lastUser.content, systemPrompt, warning)
                }
              } else {
                content = fallbackReply(lastUser.content, systemPrompt, warning)
              }
              console.warn('[ai-proxy] Gemini failed:', e instanceof Error ? e.message : e)
            }
          } else if (tryGroq) {
            try {
              content = await callGroq(groqKey!.trim(), systemPrompt, messages)
              source = 'groq'
            } catch (e) {
              warning = quotaHint(false, true)
              content = fallbackReply(lastUser.content, systemPrompt, warning)
              console.warn('[ai-proxy] Groq failed:', e instanceof Error ? e.message : e)
            }
          } else {
            warning = quotaHint(false, false)
            content = fallbackReply(lastUser.content, systemPrompt, warning)
          }

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ content, source, warning }))
        } catch (e) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(
            JSON.stringify({
              error: e instanceof Error ? e.message : 'Ошибка сервера',
            })
          )
        }
      })()
    })
  }
}

export function aiProxyPlugin(): Plugin {
  return {
    name: 'kadrovik-ai-proxy',
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.root, '')
      server.middlewares.use(createAiMiddleware(env.GEMINI_API_KEY, env.GROQ_API_KEY))
    },
    configurePreviewServer(server) {
      const env = loadEnv(server.config.mode ?? 'production', server.config.root, '')
      server.middlewares.use(createAiMiddleware(env.GEMINI_API_KEY, env.GROQ_API_KEY))
    },
  }
}
