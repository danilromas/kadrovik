import type { User, CandidateProfile, EmployerProfile } from '@/shared/types'

type AuthUser = User | CandidateProfile | EmployerProfile

/** Куда вести пользователя после успешного входа / регистрации */
export function getPostLoginPath(user: AuthUser | null): string {
  if (!user) return '/'
  switch (user.role) {
    case 'candidate':
      return '/dashboard'
    case 'employer':
    case 'recruiter':
      return '/employer/dashboard'
    case 'admin':
      return '/admin/dashboard'
    case 'moderator':
      return '/admin/dashboard'
    default:
      return '/'
  }
}
