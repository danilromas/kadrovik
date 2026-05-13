import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Briefcase, Users, MessageSquare, Eye, TrendingUp, Plus,
  ChevronRight, Calendar, Clock, Building2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { useMemo } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { formatDistanceToNow } from '@/shared/lib/utils';
import { useApplicationsQuery, useVacanciesQuery } from '@/shared/api/queries';

export function EmployerDashboard() {
  const { user } = useAuthStore();
  const { data: vacancies = [] } = useVacanciesQuery();
  const { data: applications = [] } = useApplicationsQuery();

  const myVacancies = useMemo(
    () => vacancies.filter((v) => v.companyId === 'company-1' || v.company?.id === 'company-1').slice(0, 5),
    [vacancies]
  );
  const recentApplications = useMemo(() => applications.slice(0, 5), [applications]);
  
  const stats = [
    { icon: Briefcase, label: 'Активные вакансии', value: myVacancies.length, color: 'text-blue-500', change: '+2' },
    { icon: Users, label: 'Новые отклики', value: 48, color: 'text-green-500', change: '+12' },
    { icon: Eye, label: 'Просмотры вакансий', value: '2.4K', color: 'text-purple-500', change: '+18%' },
    { icon: MessageSquare, label: 'Сообщения', value: 15, color: 'text-orange-500', change: '+5' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  Добро пожаловать, {user?.firstName}!
                </h1>
                <p className="text-muted-foreground">
                  У вас {recentApplications.filter(a => a.status === 'pending').length} новых откликов сегодня
                </p>
              </div>
              <Button asChild>
                <Link to="/employer/vacancies/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Создать вакансию
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="text-green-600">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Vacancies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Мои вакансии</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/employer/vacancies">
                  Все вакансии
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myVacancies.map(vacancy => (
                  <Link key={vacancy.id} to={`/employer/vacancies/${vacancy.id}/edit`}>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{vacancy.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {vacancy.applicationsCount} откликов
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {vacancy.views} просмотров
                          </span>
                        </div>
                      </div>
                      <Badge variant={vacancy.status === 'published' ? 'default' : 'secondary'}>
                        {vacancy.status === 'published' ? 'Активна' : 'Архив'}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Новые отклики</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/employer/applications">
                  Все отклики
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.map(app => {
                  const vacancy = vacancies.find((v) => v.id === app.vacancyId);
                  const candidateName = app.candidate
                    ? `${app.candidate.firstName} ${app.candidate.lastName}`.trim()
                    : 'Кандидат';
                  return (
                    <div key={app.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {candidateName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground">{candidateName}</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          на {vacancy?.title}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={app.status === 'pending' ? 'default' : 'secondary'}>
                          {app.status === 'pending' ? 'Новый' : 'Просмотрен'}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(app.createdAt))}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/employer/vacancies/new">
                  <Plus className="h-5 w-5" />
                  <span>Новая вакансия</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/employer/candidates">
                  <Users className="h-5 w-5" />
                  <span>Поиск кандидатов</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/employer/company">
                  <Building2 className="h-5 w-5" />
                  <span>Профиль компании</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/employer/analytics">
                  <TrendingUp className="h-5 w-5" />
                  <span>Аналитика</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
