import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Vacancy, Resume } from '@/shared/types'

interface FavoritesState {
  favoriteVacancies: string[]
  favoriteCompanies: string[]
  favoriteResumes: string[]
  
  toggleVacancyFavorite: (vacancyId: string) => void
  toggleCompanyFavorite: (companyId: string) => void
  toggleResumeFavorite: (resumeId: string) => void
  /** Алиасы для страниц со старыми именами методов */
  toggleVacancy: (vacancyId: string) => void
  toggleCompany: (companyId: string) => void
  isVacancyFavorite: (vacancyId: string) => boolean
  isResumeFavorite: (resumeId: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteVacancies: [],
      favoriteCompanies: [],
      favoriteResumes: [],

      toggleVacancyFavorite: (vacancyId) => {
        set(state => ({
          favoriteVacancies: state.favoriteVacancies.includes(vacancyId)
            ? state.favoriteVacancies.filter(id => id !== vacancyId)
            : [...state.favoriteVacancies, vacancyId],
        }))
      },

      toggleCompanyFavorite: (companyId) => {
        set(state => ({
          favoriteCompanies: state.favoriteCompanies.includes(companyId)
            ? state.favoriteCompanies.filter(id => id !== companyId)
            : [...state.favoriteCompanies, companyId],
        }))
      },

      toggleResumeFavorite: (resumeId) => {
        set(state => ({
          favoriteResumes: state.favoriteResumes.includes(resumeId)
            ? state.favoriteResumes.filter(id => id !== resumeId)
            : [...state.favoriteResumes, resumeId],
        }))
      },

      toggleVacancy: (vacancyId) => {
        get().toggleVacancyFavorite(vacancyId)
      },

      toggleCompany: (companyId) => {
        get().toggleCompanyFavorite(companyId)
      },

      isVacancyFavorite: (vacancyId) => {
        return get().favoriteVacancies.includes(vacancyId)
      },

      isResumeFavorite: (resumeId) => {
        return get().favoriteResumes.includes(resumeId)
      },
    }),
    {
      name: 'kadrovik-favorites',
    }
  )
)
