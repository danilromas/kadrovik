import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Bot, X, Send, Trash2, Sparkles } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { useAuthStore } from '@/features/auth/store/authStore'
import { usePlatformSettingsStore } from '@/features/platform/store/platformSettingsStore'
import { useAiAssistantStore } from '../store/aiAssistantStore'
import { getSuggestedPrompts } from '../prompts'
import { getAiRemainingToday, AI_DAILY_LIMIT } from '../lib/dailyLimit'
import type { AiChatResponse, AiUserRole } from '../types'

const SOURCE_LABELS: Record<NonNullable<AiChatResponse['source']>, string> = {
  gemini: 'Google Gemini',
  groq: 'Groq AI',
  fallback: 'Встроенный помощник',
}

function mapRole(role: string | undefined): AiUserRole {
  if (role === 'candidate') return 'candidate'
  if (role === 'employer' || role === 'recruiter') return 'employer'
  if (role === 'admin' || role === 'moderator') return 'admin'
  return 'guest'
}

function formatMarkdownLite(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

export function AiAssistantWidget() {
  const enabled = usePlatformSettingsStore((s) => s.aiAssistantEnabled ?? true)
  const user = useAuthStore((s) => s.user)
  const {
    isOpen,
    messages,
    isLoading,
    error,
    role,
    context,
    open,
    close,
    setRole,
    clearMessages,
    sendMessage,
    lastSource,
    lastWarning,
  } = useAiAssistantStore()

  const [input, setInput] = useState('')
  const [remaining, setRemaining] = useState(getAiRemainingToday)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setRole(mapRole(user?.role))
  }, [user?.role, setRole])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) setRemaining(getAiRemainingToday())
  }, [isOpen, messages])

  if (!enabled) return null

  const suggestions = getSuggestedPrompts(role, context)

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    const text = input
    setInput('')
    void sendMessage(text).then(() => setRemaining(getAiRemainingToday()))
  }

  return (
    <>
      {isOpen && (
        <div
          className={cn(
            'fixed z-[60] flex flex-col bg-card border shadow-2xl rounded-2xl overflow-hidden',
            'bottom-20 right-4 w-[min(100vw-2rem,380px)] h-[min(70vh,520px)]',
            'animate-in slide-in-from-bottom-4 fade-in duration-200'
          )}
          role="dialog"
          aria-label="ИИ-помощник"
        >
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b bg-primary/5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="size-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <Sparkles className="size-4 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">ИИ-помощник</p>
                <p className="text-xs text-muted-foreground truncate">КАДРОВИК · Крым</p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={clearMessages}
                title="Очистить чат"
                disabled={messages.length === 0 || isLoading}
              >
                <Trash2 className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="size-8" onClick={close} aria-label="Закрыть">
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {lastWarning && (
            <p className="text-xs text-amber-800 dark:text-amber-200 px-4 py-2 bg-amber-500/15 border-b leading-snug">
              {formatMarkdownLite(lastWarning.replace(/\*\*/g, ''))}
            </p>
          )}

          <ScrollArea className="flex-1 min-h-0 px-3">
            <div className="py-3 space-y-3 min-h-[120px]">
              {messages.length === 0 && (
                <div className="text-sm text-muted-foreground space-y-3 px-1">
                  <p>
                    Здравствуйте! Помогу с вакансиями, резюме и подготовкой к собеседованию в городах Крыма.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="text-xs px-2.5 py-1.5 rounded-full border bg-muted/50 hover:bg-muted transition-colors text-left"
                        onClick={() => void sendMessage(s)}
                        disabled={isLoading}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'text-sm rounded-xl px-3 py-2 max-w-[95%] whitespace-pre-wrap',
                    m.role === 'user'
                      ? 'ml-auto bg-primary text-primary-foreground'
                      : 'mr-auto bg-muted text-foreground'
                  )}
                >
                  {m.role === 'assistant' ? formatMarkdownLite(m.content) : m.content}
                </div>
              ))}
              {isLoading && (
                <div className="text-sm text-muted-foreground px-2 flex items-center gap-2">
                  <span className="inline-flex gap-1">
                    <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce" />
                    <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.15s]" />
                    <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.3s]" />
                  </span>
                  Думаю…
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          {error && (
            <p className="text-xs text-destructive px-4 py-1 border-t bg-destructive/5">{error}</p>
          )}

          <div className="p-3 border-t space-y-2 bg-card shrink-0">
            <p className="text-[10px] text-muted-foreground text-center">
              {lastSource && messages.length > 0 && (
                <span className="block mb-0.5">Ответ: {SOURCE_LABELS[lastSource]}</span>
              )}
              Осталось {remaining} из {AI_DAILY_LIMIT} сообщений сегодня
            </p>
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ваш вопрос…"
                className="min-h-[44px] max-h-24 resize-none text-sm"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                disabled={isLoading}
              />
              <Button
                size="icon"
                className="shrink-0 size-11"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                aria-label="Отправить"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <Button
        type="button"
        size="lg"
        className={cn(
          'fixed z-[59] bottom-4 right-4 size-14 rounded-full shadow-lg',
          isOpen && 'ring-2 ring-primary ring-offset-2'
        )}
        onClick={() => (isOpen ? close() : open())}
        aria-label={isOpen ? 'Закрыть ИИ-помощник' : 'Открыть ИИ-помощник'}
      >
        {isOpen ? <X className="size-6" /> : <Bot className="size-6" />}
      </Button>
    </>
  )
}
