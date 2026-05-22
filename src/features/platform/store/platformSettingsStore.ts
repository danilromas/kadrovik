import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PlatformSettings {
  maintenance: boolean
  registrationsOpen: boolean
  chatEnabled: boolean
  pipelineEnabled: boolean
  referralsEnabled: boolean
  aiAssistantEnabled: boolean
}

const defaults: PlatformSettings = {
  maintenance: false,
  registrationsOpen: true,
  chatEnabled: true,
  pipelineEnabled: true,
  referralsEnabled: false,
  aiAssistantEnabled: true,
}

interface PlatformSettingsState extends PlatformSettings {
  patch: (p: Partial<PlatformSettings>) => void
  reset: () => void
}

export const usePlatformSettingsStore = create<PlatformSettingsState>()(
  persist(
    (set) => ({
      ...defaults,
      patch: (p) => set((s) => ({ ...s, ...p })),
      reset: () => set({ ...defaults }),
    }),
    { name: 'kadrovik-platform-settings-v2' }
  )
)
