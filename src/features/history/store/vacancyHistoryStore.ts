import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface VacancyHistoryState {
  viewedIds: string[]
  recordView: (vacancyId: string) => void
  clear: () => void
}

export const useVacancyHistoryStore = create<VacancyHistoryState>()(
  persist(
    (set, get) => ({
      viewedIds: [],
      recordView: (vacancyId) => {
        const cur = get().viewedIds.filter((id) => id !== vacancyId)
        set({ viewedIds: [vacancyId, ...cur].slice(0, 50) })
      },
      clear: () => set({ viewedIds: [] }),
    }),
    { name: 'kadrovik-vacancy-history' }
  )
)
