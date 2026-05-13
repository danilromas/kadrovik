import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface EmployerFavoritesState {
  candidateIds: string[]
  toggleCandidate: (candidateId: string) => void
}

export const useEmployerFavoritesStore = create<EmployerFavoritesState>()(
  persist(
    (set, get) => ({
      candidateIds: [],
      toggleCandidate: (candidateId) =>
        set({
          candidateIds: get().candidateIds.includes(candidateId)
            ? get().candidateIds.filter((id) => id !== candidateId)
            : [...get().candidateIds, candidateId],
        }),
    }),
    { name: 'kadrovik-employer-fav-candidates' }
  )
)
