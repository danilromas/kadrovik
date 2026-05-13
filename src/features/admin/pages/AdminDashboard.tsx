import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users, Building2, Briefcase, AlertTriangle, TrendingUp, Shield,
  ChevronRight, Clock, Flag, CheckCircle, XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { mockAnalytics, type AdminActivityItem } from '@/shared/mocks/analytics';

export function AdminDashboard() {
  const { overview, recentActivity } = mockAnalytics;

  const stats = [
    { icon: Users, label: 'Всего пользователей', value: overview.totalUsers.toLocaleString(), change: '+12%' },
    { icon: Building2, label: 'Компаний', value: overview.totalCompanies.toLocaleString(), change: '+8%' },
    { icon: Briefcase, label: 'Вакансий', value: overview.totalVacancies.toLocaleString(), change: '+15%' },
    { icon: AlertTriangle, label: 'На модерации', value: overview.pendingModeration, change: 'Требует внимания' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Панель администратора</h1>
            <p className="text-muted-foreground">Обзор платформы и управление</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/admin/reports">
              <TrendingUp className="h-4 w-4 mr-2" />
              Отчёты
            </Link>
          </Button>
        </div>
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
                  <div className="p-3 rounded-xl bg-muted">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant={stat.label === 'На модерации' ? 'destructive' : 'secondary'}>
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
        {/* Moderation Queue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Очередь модерации
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/moderation">
                  Все
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: 'company', name: 'ООО "Новая Компания"', reason: 'Регистрация компании' },
                  { type: 'vacancy', name: 'Senior Developer в Startup', reason: 'Новая вакансия' },
                  { type: 'complaint', name: 'Жалоба на вакансию #1234', reason: 'Подозрительный контент' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        item.type === 'complaint' ? 'bg-red-500/10 text-red-500' :
                        item.type === 'company' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-green-500/10 text-green-500'
                      }`}>
                        {item.type === 'complaint' ? <Flag className="h-4 w-4" /> :
                         item.type === 'company' ? <Building2 className="h-4 w-4" /> :
                         <Briefcase className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.reason}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-500">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Последняя активность
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/activity">
                  Вся активность
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity: AdminActivityItem, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-1 w-2 h-2 rounded-full ${
                      activity.type === 'user_registered' ? 'bg-green-500' :
                      activity.type === 'vacancy_created' ? 'bg-blue-500' :
                      activity.type === 'company_verified' ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
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
                <Link to="/admin/users">
                  <Users className="h-5 w-5" />
                  <span>Пользователи</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/admin/companies">
                  <Building2 className="h-5 w-5" />
                  <span>Компании</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/admin/vacancies">
                  <Briefcase className="h-5 w-5" />
                  <span>Вакансии</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/admin/complaints">
                  <Flag className="h-5 w-5" />
                  <span>Жалобы</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
