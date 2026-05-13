/**
 * Слой entities (ТЗ A.1): реэкспорт доменных типов.
 * Логику адаптеров можно наращивать по мере появления backend.
 */
export type {
  User,
  UserRole,
  CandidateProfile,
  EmployerProfile,
  Company,
  Vacancy,
  Resume,
  Application,
  ApplicationStatus,
  PipelineStage,
} from '@/shared/types'
