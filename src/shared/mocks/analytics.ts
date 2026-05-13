import type { VacancyAnalytics, PlatformAnalytics } from '@/shared/types'

export const mockVacancyAnalytics: VacancyAnalytics = {
  vacancyId: 'vacancy-1',
  views: 1250,
  applications: 45,
  conversionRate: 3.6,
  viewsByDay: [
    { date: '2024-03-14', count: 120 },
    { date: '2024-03-15', count: 180 },
    { date: '2024-03-16', count: 210 },
    { date: '2024-03-17', count: 190 },
    { date: '2024-03-18', count: 250 },
    { date: '2024-03-19', count: 170 },
    { date: '2024-03-20', count: 130 },
  ],
  applicationsByDay: [
    { date: '2024-03-14', count: 5 },
    { date: '2024-03-15', count: 8 },
    { date: '2024-03-16', count: 12 },
    { date: '2024-03-17', count: 7 },
    { date: '2024-03-18', count: 6 },
    { date: '2024-03-19', count: 4 },
    { date: '2024-03-20', count: 3 },
  ],
  pipelineStats: [
    { stage: 'new', count: 15 },
    { stage: 'viewed', count: 12 },
    { stage: 'screening', count: 8 },
    { stage: 'interview', count: 5 },
    { stage: 'test', count: 3 },
    { stage: 'offer', count: 1 },
    { stage: 'hired', count: 0 },
    { stage: 'rejected', count: 1 },
  ],
}

export const mockPlatformAnalytics: PlatformAnalytics = {
  totalUsers: 15420,
  totalVacancies: 3256,
  totalResumes: 8934,
  totalApplications: 45678,
  usersByRole: [
    { role: 'candidate', count: 12500 },
    { role: 'employer', count: 1850 },
    { role: 'recruiter', count: 920 },
    { role: 'moderator', count: 45 },
    { role: 'admin', count: 5 },
    { role: 'guest', count: 100 },
  ],
  registrationsByDay: [
    { date: '2024-03-14', count: 45 },
    { date: '2024-03-15', count: 62 },
    { date: '2024-03-16', count: 38 },
    { date: '2024-03-17', count: 28 },
    { date: '2024-03-18', count: 71 },
    { date: '2024-03-19', count: 56 },
    { date: '2024-03-20', count: 49 },
  ],
  activeVacanciesByCategory: [
    { category: 'Разработка', count: 1245 },
    { category: 'Дизайн', count: 456 },
    { category: 'Маркетинг', count: 389 },
    { category: 'Продажи', count: 567 },
    { category: 'Финансы', count: 234 },
    { category: 'HR', count: 178 },
    { category: 'Аналитика', count: 187 },
  ],
}

export type AdminActivityType = 'user_registered' | 'vacancy_created' | 'company_verified' | 'other'

export interface AdminActivityItem {
  type: AdminActivityType
  description: string
  time: string
}

/** Данные для `AdminDashboard` */
export const mockAnalytics = {
  overview: {
    totalUsers: mockPlatformAnalytics.totalUsers,
    totalCompanies: 25_000,
    totalVacancies: mockPlatformAnalytics.totalVacancies,
    pendingModeration: 12,
  },
  recentActivity: [
    {
      type: 'user_registered',
      description: 'Новый кандидат зарегистрировался на платформе',
      time: '5 минут назад',
    },
    {
      type: 'vacancy_created',
      description: 'Компания TechCorp Russia опубликовала вакансию',
      time: '1 час назад',
    },
    {
      type: 'company_verified',
      description: 'Компания Digital Agency Pro прошла верификацию',
      time: '3 часа назад',
    },
  ] satisfies AdminActivityItem[],
}
