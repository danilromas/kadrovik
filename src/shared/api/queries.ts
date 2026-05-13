import { useQuery } from '@tanstack/react-query'
import { mockApi } from '@/shared/api/mockApi'

export const queryKeys = {
  vacancies: ['vacancies'] as const,
  vacancy: (id: string) => ['vacancy', id] as const,
  applications: ['applications'] as const,
}

export function useVacanciesQuery() {
  return useQuery({
    queryKey: queryKeys.vacancies,
    queryFn: () => mockApi.getVacancies(),
  })
}

export function useVacancyQuery(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.vacancy(id ?? ''),
    queryFn: () => mockApi.getVacancyById(id!),
    enabled: Boolean(id),
  })
}

export function useApplicationsQuery() {
  return useQuery({
    queryKey: queryKeys.applications,
    queryFn: () => mockApi.getApplications(),
  })
}
