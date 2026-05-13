import { Outlet, Link, useNavigate } from 'react-router-dom'
import { 
  Search, 
  Bell, 
  MessageSquare, 
  User, 
  LogOut, 
  Building2, 
  FileText,
  Menu,
  X,
  ChevronDown,
  Moon,
  Sun,
} from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useNotificationStore } from '@/features/notifications/store/notificationStore'
import { useChatStore } from '@/features/chat/store/chatStore'
import { getInitials, formatDistanceToNow } from '@/shared/lib/utils'
import { useTheme } from '@/app/providers/AppProviders'
import { usePlatformSettingsStore } from '@/features/platform/store/platformSettingsStore'

export function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const { unreadCount, notifications, fetchNotifications, markAsRead } = useNotificationStore()
  const { chats } = useChatStore()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const maintenance = usePlatformSettingsStore((s) => s.maintenance)
  
  const unreadMessages = chats.reduce((acc, chat) => acc + chat.unreadCount, 0)

  useEffect(() => {
    if (isAuthenticated) {
      void fetchNotifications()
    }
  }, [isAuthenticated, fetchNotifications])

  const getDashboardLink = () => {
    if (!user) return '/login'
    switch (user.role) {
      case 'candidate':
        return '/dashboard'
      case 'employer':
      case 'recruiter':
        return '/employer/dashboard'
      case 'admin':
      case 'moderator':
        return '/admin/dashboard'
      default:
        return '/'
    }
  }

  const getMessagesLink = () => {
    if (!user) return '/login'
    if (user.role === 'candidate') return '/dashboard/messages'
    if (user.role === 'employer' || user.role === 'recruiter') return '/employer/messages'
    return '/dashboard/messages'
  }

  const getNotificationsLink = () => {
    if (!user) return '/login'
    if (user.role === 'candidate') return '/dashboard/notifications'
    if (user.role === 'employer' || user.role === 'recruiter') return '/employer/notifications'
    return '/dashboard/notifications'
  }

  const notificationGroups = useMemo(() => {
    const list = notifications.slice(0, 20)
    const map = new Map<string, typeof list>()
    for (const n of list) {
      const day = new Date(n.createdAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      if (!map.has(day)) map.set(day, [])
      map.get(day)!.push(n)
    }
    return [...map.entries()]
  }, [notifications])

  return (
    <div className="min-h-screen bg-background">
      {maintenance && (
        <div className="bg-amber-500/90 text-amber-950 text-center text-sm py-2 px-4 font-medium">
          Режим обслуживания (демо): баннер из настроек админки. Регистрация может быть отключена отдельно.
        </div>
      )}
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">К</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline">КАДРОВИК</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/vacancies" className="text-sm font-medium hover:text-primary transition-colors">
                Вакансии
              </Link>
              <Link to="/companies" className="text-sm font-medium hover:text-primary transition-colors">
                Компании
              </Link>
              <Link to="/resumes" className="text-sm font-medium hover:text-primary transition-colors">
                Резюме
              </Link>
            </nav>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                  placeholder="Поиск вакансий, компаний..." 
                  className="pl-10"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" type="button" onClick={toggleTheme} aria-label="Тема">
                {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </Button>
              {isAuthenticated ? (
                <>
                  {/* Messages */}
                  <Button variant="ghost" size="icon" asChild className="relative">
                    <Link to={getMessagesLink()}>
                      <MessageSquare className="size-5" />
                      {unreadMessages > 0 && (
                        <span className="absolute -top-1 -right-1 size-5 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                          {unreadMessages}
                        </span>
                      )}
                    </Link>
                  </Button>

                  {/* Notifications */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <Bell className="size-5" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 size-5 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 max-h-80 overflow-y-auto">
                      <div className="px-2 py-1.5 text-sm font-medium">Уведомления</div>
                      <DropdownMenuSeparator />
                      {notificationGroups.map(([day, items]) => (
                        <div key={day}>
                          <div className="px-2 py-1.5 text-[11px] font-medium text-muted-foreground border-b border-border/60">
                            {day}
                          </div>
                          {items.map((n) => (
                            <DropdownMenuItem
                              key={n.id}
                              className="flex flex-col items-start gap-1 py-2 cursor-pointer"
                              onClick={() => {
                                markAsRead(n.id)
                                if (n.link) navigate(n.link)
                              }}
                            >
                              <span className="font-medium text-sm">{n.title}</span>
                              <span className="text-xs text-muted-foreground line-clamp-2">{n.message}</span>
                              <span className="text-[10px] text-muted-foreground">
                                {formatDistanceToNow(new Date(n.createdAt))}
                              </span>
                            </DropdownMenuItem>
                          ))}
                        </div>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate(getNotificationsLink())}>
                        Все уведомления
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="gap-2">
                        <Avatar className="size-8">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback>
                            {user ? getInitials(user.firstName, user.lastName) : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline max-w-24 truncate">
                          {user?.firstName}
                        </span>
                        <ChevronDown className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5">
                        <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
                        <User className="size-4 mr-2" />
                        Личный кабинет
                      </DropdownMenuItem>
                      {user?.role === 'candidate' && (
                        <DropdownMenuItem onClick={() => navigate('/dashboard/resume')}>
                          <FileText className="size-4 mr-2" />
                          Мои резюме
                        </DropdownMenuItem>
                      )}
                      {(user?.role === 'employer' || user?.role === 'recruiter') && (
                        <DropdownMenuItem onClick={() => navigate('/employer/vacancies')}>
                          <Building2 className="size-4 mr-2" />
                          Мои вакансии
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="text-destructive">
                        <LogOut className="size-4 mr-2" />
                        Выйти
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="hidden sm:inline-flex">
                    <Link to="/login">Войти</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register">Регистрация</Link>
                  </Button>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-background animate-slide-down">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input placeholder="Поиск..." className="pl-10" />
              </div>
              <nav className="flex flex-col gap-2">
                <Link 
                  to="/vacancies" 
                  className="px-3 py-2 rounded-md hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Вакансии
                </Link>
                <Link 
                  to="/companies" 
                  className="px-3 py-2 rounded-md hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Компании
                </Link>
                <Link 
                  to="/resumes" 
                  className="px-3 py-2 rounded-md hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Резюме
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Соискателям</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/vacancies" className="hover:text-foreground">Поиск вакансий</Link></li>
                <li><Link to="/companies" className="hover:text-foreground">Компании</Link></li>
                <li><Link to="/register" className="hover:text-foreground">Создать резюме</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Работодателям</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/resumes" className="hover:text-foreground">База резюме</Link></li>
                <li><Link to="/employer/vacancies/new" className="hover:text-foreground">Разместить вакансию</Link></li>
                <li><Link to="/employer/dashboard" className="hover:text-foreground">Личный кабинет</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">О проекте</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">О нас</a></li>
                <li><a href="#" className="hover:text-foreground">Контакты</a></li>
                <li><a href="#" className="hover:text-foreground">Помощь</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Контакты</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>support@kadrovik.ru</li>
                <li>+7 (800) 123-45-67</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              2024 КАДРОВИК. Все права защищены.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">Политика конфиденциальности</a>
              <a href="#" className="hover:text-foreground">Условия использования</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
