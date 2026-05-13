import { Outlet, Link, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'

export function AuthLayout() {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated && user) {
    const redirectPath = user.role === 'candidate' 
      ? '/dashboard' 
      : user.role === 'employer' || user.role === 'recruiter'
        ? '/employer/dashboard'
        : user.role === 'admin' || user.role === 'moderator'
          ? '/admin/dashboard'
          : '/'
    return <Navigate to={redirectPath} replace />
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <Link to="/" className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <span className="font-bold text-2xl">К</span>
            </div>
            <span className="font-bold text-2xl">КАДРОВИК</span>
          </Link>
          
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Найдите работу мечты или идеального кандидата
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Платформа, которая соединяет талантливых специалистов с лучшими работодателями
            </p>
            
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <div className="text-3xl font-bold">15K+</div>
                <div className="text-sm text-primary-foreground/70">Вакансий</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-primary-foreground/70">Специалистов</div>
              </div>
              <div>
                <div className="text-3xl font-bold">3K+</div>
                <div className="text-sm text-primary-foreground/70">Компаний</div>
              </div>
            </div>
          </div>

          <div className="text-sm text-primary-foreground/60">
            2024 КАДРОВИК
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-20 -right-20 size-80 rounded-full bg-primary-foreground/5" />
        <div className="absolute -top-20 -right-40 size-96 rounded-full bg-primary-foreground/5" />
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex flex-col">
        <div className="lg:hidden p-4 border-b">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">К</span>
            </div>
            <span className="font-bold text-xl">КАДРОВИК</span>
          </Link>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
