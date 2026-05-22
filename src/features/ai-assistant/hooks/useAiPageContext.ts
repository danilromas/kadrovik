import { useEffect } from 'react'
import { useAiAssistantStore } from '../store/aiAssistantStore'
import type { AiPageContext } from '../types'

/** Устанавливает контекст страницы для ИИ-помощника; сбрасывает при размонтировании */
export function useAiPageContext(context: AiPageContext | null) {
  const setContext = useAiAssistantStore((s) => s.setContext)

  useEffect(() => {
    setContext(context)
    return () => setContext(null)
  }, [context, setContext])
}
