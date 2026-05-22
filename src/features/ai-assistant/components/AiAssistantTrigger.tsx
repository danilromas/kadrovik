import { Sparkles } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { usePlatformSettingsStore } from '@/features/platform/store/platformSettingsStore'
import { useAiAssistantStore } from '../store/aiAssistantStore'

interface AiAssistantTriggerProps {
  prompt: string
  label?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function AiAssistantTrigger({
  prompt,
  label = 'Спросить ИИ',
  variant = 'outline',
  size = 'sm',
  className,
}: AiAssistantTriggerProps) {
  const enabled = usePlatformSettingsStore((s) => s.aiAssistantEnabled ?? true)
  const openWithPrompt = useAiAssistantStore((s) => s.openWithPrompt)

  if (!enabled) return null

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={() => openWithPrompt(prompt)}
    >
      <Sparkles className="size-4 mr-2" />
      {label}
    </Button>
  )
}
