import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { mockApi } from '@/shared/api/mockApi'
import { useAuthStore } from '@/features/auth/store/authStore'
import { VACANCY_STATUSES } from '@/shared/constants'
import { formatSalary } from '@/shared/lib/utils'

export function EmployerVacanciesPage() {
  const { user } = useAuthStore()
  const companyId =
    user && (user.role === 'employer' || user.role === 'recruiter') && 'companyId' in user && user.companyId
      ? user.companyId
      : 'company-1'

  const { data: list = [], isLoading } = useQuery({
    queryKey: ['employer-vacancies', companyId],
    queryFn: () => mockApi.getVacanciesByCompany(companyId),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Вакансии</h1>
          <p className="text-muted-foreground">Управление вакансиями компании (демо)</p>
        </div>
        <Button asChild>
          <Link to="/employer/vacancies/new">
            <Plus className="h-4 w-4 mr-2" />
            Новая вакансия
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Загрузка…</p>
      ) : (
        <div className="space-y-3">
          {list.map((v) => (
            <Card key={v.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  <Link to={`/employer/vacancies/${v.id}/edit`} className="hover:text-primary">
                    {v.title}
                  </Link>
                </CardTitle>
                <Badge variant="secondary">{VACANCY_STATUSES[v.status].label}</Badge>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                <span>{v.city}</span>
                <span className="font-medium text-primary">
                  {formatSalary(v.salaryMin, v.salaryMax, v.currency)}
                </span>
                <span>откликов: {v.applicationsCount}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
