import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { mockPlatformAnalytics } from '@/shared/mocks/analytics'
import { USER_ROLES } from '@/shared/constants'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export function AdminAnalyticsPage() {
  const data = mockPlatformAnalytics.usersByRole.map((r) => ({
    name: USER_ROLES[r.role],
    count: r.count,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Аналитика</h1>
        <p className="text-muted-foreground">Сводка по ролям (демо)</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Пользователи по ролям</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
