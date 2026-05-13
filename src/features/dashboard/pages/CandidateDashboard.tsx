import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, FileText, MessageSquare, Bell, Eye, TrendingUp,
  Calendar, ChevronRight, Heart, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Progress } from '@/shared/ui/progress';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useFavoritesStore } from '@/features/favorites/store/favoritesStore';
import { formatDistanceToNow, formatSalary, getMatchPercentage } from '@/shared/lib/utils';
import { useApplicationsQuery, useVacanciesQuery } from '@/shared/api/queries';
import { useAdminModerationStore, isVacancyModeratedOut } from '@/features/admin/store/adminModerationStore';

export function CandidateDashboard() {
  const { user } = useAuthStore();
  const { favoriteVacancies } = useFavoritesStore();
  const { data: applications = [] } = useApplicationsQuery();
  const { data: vacanciesList = [] } = useVacanciesQuery();
  const moderation = useAdminModerationStore();

  const myApplications = useMemo(
    () => applications.filter((a) => a.candidateId === user?.id).slice(0, 5),
    [applications, user?.id]
  );

  const recommended = useMemo(() => {
    const skills = user && 'skills' in user ? user.skills : [];
    const visible = vacanciesList.filter((v) => !isVacancyModeratedOut(v.id, moderation));
    return visible
      .map((v) => ({
        vacancy: v,
        match: getMatchPercentage(skills, v.skills.map((s) => s.name)),
      }))
      .sort((a, b) => b.match - a.match)
      .slice(0, 4);
  }, [user, vacanciesList, moderation]);
  
  const stats = [
    { icon: FileText, label: 'Мои отклики', value: myApplications.length, color: 'text-blue-500' },
    { icon: Eye, label: 'Просмотры резюме', value: 156, color: 'text-green-500' },
    { icon: Heart, label: 'В избранном', value: favoriteVacancies.length, color: 'text-red-500' },
    { icon: MessageSquare, label: 'Сообщения', value: 3, color: 'text-purple-500' },
  ];

  const profileCompletion = 75;

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
                  У вас {myApplications.filter(a => a.pipelineStage === 'interview').length} активных этапов собеседования
                </p>
              </div>
              <Button asChild>
                <Link to="/dashboard/resume">
                  <FileText className="h-4 w-4 mr-2" />
                  Мои резюме
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
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Заполненность профиля</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Прогресс</span>
                <span className="font-medium">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2 mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Заполните профиль на 100% чтобы получать больше откликов
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/dashboard/profile">Заполнить профиль</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Мои отклики</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/applications">
                  Все отклики
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {myApplications.length > 0 ? (
                <div className="space-y-4">
                  {myApplications.map(app => {
                    const vacancy = vacanciesList.find((v) => v.id === app.vacancyId);
                    return (
                      <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">{vacancy?.title}</h4>
                          <p className="text-sm text-muted-foreground">{vacancy?.company?.name ?? 'Компания'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              app.status === 'rejected' ? 'destructive' :
                              app.status === 'accepted' || app.pipelineStage === 'interview' ? 'default' :
                              'secondary'
                            }
                          >
                            {app.pipelineStage === 'interview' ? 'Собеседование' :
                             app.status === 'pending' ? 'На рассмотрении' :
                             app.status === 'reviewed' ? 'Просмотрено' :
                             app.status === 'accepted' ? 'Принято' :
                             app.status === 'rejected' ? 'Отказ' : app.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(app.createdAt))}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-4">У вас пока нет откликов</p>
                  <Button asChild>
                    <Link to="/vacancies">Найти вакансии</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recommended Vacancies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Рекомендуемые вакансии</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/vacancies">
                Все вакансии
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {recommended.map(({ vacancy, match }) => (
                <Link key={vacancy.id} to={`/vacancies/${vacancy.id}`}>
                  <div className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium text-foreground line-clamp-1">{vacancy.title}</h4>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {vacancy.isHot && <Badge variant="destructive">Hot</Badge>}
                        <Badge variant="outline" className="text-xs tabular-nums">
                          {match}% match
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{vacancy.company?.name ?? 'Компания'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-medium">
                        {formatSalary(vacancy.salaryMin, vacancy.salaryMax, vacancy.currency)}
                      </span>
                      <span className="text-xs text-muted-foreground">{vacancy.city}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
