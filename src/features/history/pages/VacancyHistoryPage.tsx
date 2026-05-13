import { Link } from 'react-router-dom'
import { History } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { useVacancyHistoryStore } from '@/features/history/store/vacancyHistoryStore'
import { mockVacancies } from '@/shared/mocks/vacancies'
import { formatSalary } from '@/shared/lib/utils'

export function VacancyHistoryPage() {
  const { viewedIds, clear } = useVacancyHistoryStore()
  const items = viewedIds
    .map((id) => mockVacancies.find((v) => v.id === id))
    .filter((v): v is (typeof mockVacancies)[number] => Boolean(v))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <History className="h-7 w-7" />
            История просмотров
          </h1>
          <p className="text-muted-foreground">Вакансии, которые вы открывали в этом браузере</p>
        </div>
        {viewedIds.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => clear()}>
            Очистить
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Пока пусто. Откройте несколько вакансий из каталога.
            <div className="mt-4">
              <Button asChild variant="outline">
                <Link to="/vacancies">К вакансиям</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((v) => (
              <Card key={v.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
                  <CardTitle className="text-base font-medium">
                    <Link to={`/vacancies/${v.id}`} className="hover:text-primary">
                      {v.title}
                    </Link>
                  </CardTitle>
                  <span className="text-sm font-medium text-primary">
                    {formatSalary(v.salaryMin, v.salaryMax, v.currency)}
                  </span>
                </CardHeader>
                <CardContent className="pb-4 text-sm text-muted-foreground">{v.company?.name ?? 'Компания'}</CardContent>
              </Card>
          ))}
        </div>
      )}
    </div>
  )
}
