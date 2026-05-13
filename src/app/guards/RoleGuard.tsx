import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'
import type { UserRole } from '@/shared/types'

interface RoleGuardProps {
  children: React.ReactNode
  roles: UserRole[]
}

export function RoleGuard({ children, roles }: RoleGuardProps) {
  const { user } = useAuthStore()

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
