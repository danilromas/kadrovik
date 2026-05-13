import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase, 
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  Shield,
  Flag,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { Badge } from '@/shared/ui/badge'
import { useAuthStore } from '@/features/auth/store/authStore'
import { getInitials } from '@/shared/lib/utils'

const adminNavAll = [
  { icon: LayoutDashboard, label: 'Дашборд', href: '/admin/dashboard' },
  { icon: Flag, label: 'Очередь модерации', href: '/admin/moderation' },
  { icon: Users, label: 'Пользователи', href: '/admin/users' },
  { icon: Building2, label: 'Компании', href: '/admin/companies' },
  { icon: Briefcase, label: 'Вакансии', href: '/admin/vacancies' },
  { icon: FileText, label: 'Резюме', href: '/admin/resumes' },
  { icon: BarChart3, label: 'Аналитика', href: '/admin/analytics' },
  { icon: Settings, label: 'Настройки', href: '/admin/settings' },
]

const moderatorNavHrefs = new Set([
  '/admin/dashboard',
  '/admin/moderation',
  '/admin/companies',
  '/admin/vacancies',
  '/admin/resumes',
])

export function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const isModerator = user?.role === 'moderator'
  const adminNavItems = isModerator ? adminNavAll.filter((i) => moderatorNavHrefs.has(i.href)) : adminNavAll

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 glass border-b">
        <div className="flex h-14 items-center justify-between px-4">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            <span className="font-bold">Админ-панель</span>
          </div>
          <Avatar className="size-8">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-xs">
              {user ? getInitials(user.firstName, user.lastName) : 'A'}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          'fixed top-0 left-0 z-50 h-screen bg-background border-r transition-all duration-300',
          sidebarCollapsed ? 'w-16' : 'w-64',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-14 lg:h-16 flex items-center justify-between px-4 border-b">
            {!sidebarCollapsed && (
              <Link to="/admin" className="flex items-center gap-2">
                <Shield className="size-6 text-primary" />
                <span className="font-bold">Админ-панель</span>
              </Link>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              className="hidden lg:flex"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <ChevronLeft className={cn('size-4 transition-transform', sidebarCollapsed && 'rotate-180')} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ChevronLeft className="size-4" />
            </Button>
          </div>

          {/* User Info */}
          {!sidebarCollapsed && (
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>
                    {user ? getInitials(user.firstName, user.lastName) : 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user?.firstName} {user?.lastName}</p>
                  <Badge variant="secondary" className="mt-1">
                    {user?.role === 'admin' ? 'Администратор' : 'Модератор'}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {adminNavItems.map((item) => {
                const isActive =
                  location.pathname === item.href ||
                  (item.href !== '/admin/dashboard' && location.pathname.startsWith(`${item.href}/`))
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <item.icon className="size-5 shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* Bottom Actions */}
          <div className="p-3 border-t space-y-1">
            <Button 
              variant="ghost" 
              className={cn(
                'w-full justify-start gap-3',
                sidebarCollapsed && 'justify-center px-0'
              )}
              asChild
            >
              <Link to="/">
                <ChevronLeft className="size-5 shrink-0" />
                {!sidebarCollapsed && <span>На сайт</span>}
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              className={cn(
                'w-full justify-start gap-3 text-muted-foreground hover:text-destructive',
                sidebarCollapsed && 'justify-center px-0'
              )}
              onClick={handleLogout}
            >
              <LogOut className="size-5 shrink-0" />
              {!sidebarCollapsed && <span>Выйти</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        'transition-all duration-300',
        sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
      )}>
        <div className="container mx-auto p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
