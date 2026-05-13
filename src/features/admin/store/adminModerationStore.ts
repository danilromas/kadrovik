import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** Локальная «модерация» контента: скрытие с публичных списков и пометки (демо, persist) */
interface AdminModerationState {
  hiddenVacancyIds: string[]
  deletedVacancyIds: string[]
  hiddenResumeIds: string[]
  rejectedResumeIds: string[]
  hideVacancy: (id: string) => void
  unhideVacancy: (id: string) => void
  deleteVacancy: (id: string) => void
  restoreVacancy: (id: string) => void
  hideResume: (id: string) => void
  unhideResume: (id: string) => void
  rejectResume: (id: string) => void
  restoreResume: (id: string) => void
}

export const useAdminModerationStore = create<AdminModerationState>()(
  persist(
    (set, get) => ({
      hiddenVacancyIds: [],
      deletedVacancyIds: [],
      hiddenResumeIds: [],
      rejectedResumeIds: [],

      hideVacancy: (id) =>
        set((s) => ({
          hiddenVacancyIds: s.hiddenVacancyIds.includes(id) ? s.hiddenVacancyIds : [...s.hiddenVacancyIds, id],
        })),

      unhideVacancy: (id) =>
        set((s) => ({
          hiddenVacancyIds: s.hiddenVacancyIds.filter((x) => x !== id),
          deletedVacancyIds: s.deletedVacancyIds.filter((x) => x !== id),
        })),

      deleteVacancy: (id) =>
        set((s) => ({
          deletedVacancyIds: s.deletedVacancyIds.includes(id) ? s.deletedVacancyIds : [...s.deletedVacancyIds, id],
          hiddenVacancyIds: s.hiddenVacancyIds.filter((x) => x !== id),
        })),

      restoreVacancy: (id) => {
        get().unhideVacancy(id)
        set((s) => ({
          deletedVacancyIds: s.deletedVacancyIds.filter((x) => x !== id),
        }))
      },

      hideResume: (id) =>
        set((s) => ({
          hiddenResumeIds: s.hiddenResumeIds.includes(id) ? s.hiddenResumeIds : [...s.hiddenResumeIds, id],
        })),

      unhideResume: (id) =>
        set((s) => ({
          hiddenResumeIds: s.hiddenResumeIds.filter((x) => x !== id),
        })),

      rejectResume: (id) =>
        set((s) => ({
          rejectedResumeIds: s.rejectedResumeIds.includes(id) ? s.rejectedResumeIds : [...s.rejectedResumeIds, id],
        })),

      restoreResume: (id) =>
        set((s) => ({
          hiddenResumeIds: s.hiddenResumeIds.filter((x) => x !== id),
          rejectedResumeIds: s.rejectedResumeIds.filter((x) => x !== id),
        })),
    }),
    { name: 'kadrovik-admin-moderation-v1' }
  )
)

export function isVacancyModeratedOut(id: string, s: Pick<AdminModerationState, 'hiddenVacancyIds' | 'deletedVacancyIds'>) {
  return s.hiddenVacancyIds.includes(id) || s.deletedVacancyIds.includes(id)
}

export function isResumeModeratedOut(
  id: string,
  s: Pick<AdminModerationState, 'hiddenResumeIds' | 'rejectedResumeIds'>
) {
  return s.hiddenResumeIds.includes(id) || s.rejectedResumeIds.includes(id)
}
