import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { mockPlatformAnalytics, mockVacancyAnalytics } from '@/shared/mocks/analytics'
import { PIPELINE_STAGES } from '@/shared/constants'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

export function EmployerAnalyticsPage() {
  const { registrationsByDay, activeVacanciesByCategory, totalUsers, totalVacancies, totalApplications } =
    mockPlatformAnalytics

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Аналитика</h1>
        <p className="text-muted-foreground">Платформа + вакансия (демо)</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Пользователи</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalUsers}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Вакансии</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalVacancies}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Отклики</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalApplications}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Регистрации по дням</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={registrationsByDay}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8 }} />
              <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Вакансия: просмотры и отклики (пример)</CardTitle>
        </CardHeader>
        <CardContent className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockVacancyAnalytics.viewsByDay}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: 8 }} />
              <Line
                type="monotone"
                dataKey="count"
                name="Просмотры"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Конверсия и воронка (пример)</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-muted/40">
            <p className="text-sm text-muted-foreground">Конверсия откликов</p>
            <p className="text-3xl font-bold text-primary">{mockVacancyAnalytics.conversionRate}%</p>
          </div>
          <div className="space-y-2 text-sm">
            {mockVacancyAnalytics.pipelineStats.map((s) => (
              <div key={s.stage} className="flex justify-between gap-2">
                <span className="text-muted-foreground">{PIPELINE_STAGES[s.stage].label}</span>
                <span className="font-medium">{s.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Активные вакансии по категориям</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activeVacanciesByCategory}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8 }} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
