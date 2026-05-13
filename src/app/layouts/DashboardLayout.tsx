import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Briefcase, 
  Heart, 
  MessageSquare, 
  Bell,
  Building2,
  Users,
  BarChart3,
  Kanban,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  History,
  UserSearch,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { Separator } from '@/shared/ui/separator'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useNotificationStore } from '@/features/notifications/store/notificationStore'
import { useChatStore } from '@/features/chat/store/chatStore'
import { getInitials } from '@/shared/lib/utils'

interface DashboardLayoutProps {
  variant: 'candidate' | 'employer'
}

const candidateNavItems = [
  { icon: LayoutDashboard, label: 'Дашборд', href: '/dashboard' },
  { icon: User, label: 'Профиль', href: '/dashboard/profile' },
  { icon: FileText, label: 'Мои резюме', href: '/dashboard/resume' },
  { icon: Briefcase, label: 'Отклики', href: '/dashboard/applications' },
  { icon: Heart, label: 'Избранное', href: '/dashboard/favorites' },
  { icon: History, label: 'История', href: '/dashboard/history' },
  { icon: MessageSquare, label: 'Сообщения', href: '/dashboard/messages' },
  { icon: Bell, label: 'Уведомления', href: '/dashboard/notifications' },
  { icon: Settings, label: 'Настройки', href: '/dashboard/settings' },
]

const employerNavItems = [
  { icon: LayoutDashboard, label: 'Дашборд', href: '/employer/dashboard' },
  { icon: Building2, label: 'Компания', href: '/employer/company' },
  { icon: Briefcase, label: 'Вакансии', href: '/employer/vacancies' },
  { icon: Users, label: 'Отклики', href: '/employer/applications' },
  { icon: Kanban, label: 'Pipeline', href: '/employer/pipeline' },
  { icon: UserSearch, label: 'Кандидаты', href: '/employer/candidates' },
  { icon: BarChart3, label: 'Аналитика', href: '/employer/analytics' },
  { icon: Heart, label: 'Избранные', href: '/employer/favorites' },
  { icon: MessageSquare, label: 'Сообщения', href: '/employer/messages' },
  { icon: Bell, label: 'Уведомления', href: '/employer/notifications' },
  { icon: Settings, label: 'Настройки', href: '/employer/settings' },
]

export function DashboardLayout({ variant }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { unreadCount } = useNotificationStore()
  const { chats } = useChatStore()
  
  const unreadMessages = chats.reduce((acc, chat) => acc + chat.unreadCount, 0)
  const navItems = variant === 'candidate' ? candidateNavItems : employerNavItems

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
          <Link to="/" className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">К</span>
            </div>
            <span className="font-bold">КАДРОВИК</span>
          </Link>
          <Avatar className="size-8">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-xs">
              {user ? getInitials(user.firstName, user.lastName) : 'U'}
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
              <Link to="/" className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">К</span>
                </div>
                <span className="font-bold text-lg">КАДРОВИК</span>
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
                    {user ? getInitials(user.firstName, user.lastName) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === '/dashboard' || item.href === '/employer/dashboard'
                    ? location.pathname === item.href
                    : location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                const hasNotification = 
                  (item.href.includes('messages') && unreadMessages > 0) ||
                  (item.href.includes('notifications') && unreadCount > 0)
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative',
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <item.icon className="size-5 shrink-0" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {hasNotification && (
                          <span className={cn(
                            'size-2 rounded-full',
                            isActive ? 'bg-primary-foreground' : 'bg-primary'
                          )} />
                        )}
                      </>
                    )}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* Bottom Actions */}
          <div className="p-3 border-t">
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
