import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { mockApi } from '@/shared/api/mockApi'
import { VACANCY_STATUSES } from '@/shared/constants'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { toast } from 'sonner'
import { useAdminModerationStore } from '@/features/admin/store/adminModerationStore'

export function AdminVacanciesPage() {
  const { data: vacancies = [], isLoading } = useQuery({
    queryKey: ['admin-vacancies'],
    queryFn: () => mockApi.getVacancies(),
  })
  const hideVacancy = useAdminModerationStore((s) => s.hideVacancy)
  const deleteVacancy = useAdminModerationStore((s) => s.deleteVacancy)
  const restoreVacancy = useAdminModerationStore((s) => s.restoreVacancy)
  const hiddenVacancyIds = useAdminModerationStore((s) => s.hiddenVacancyIds)
  const deletedVacancyIds = useAdminModerationStore((s) => s.deletedVacancyIds)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Вакансии</h1>
        <p className="text-muted-foreground">
          Модерация AD.3: скрыть с публичного списка, удалить из выдачи (демо, persist в localStorage)
        </p>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Загрузка…</p>
      ) : (
        <div className="space-y-2">
          {vacancies.map((v) => {
            const hidden = hiddenVacancyIds.includes(v.id)
            const deleted = deletedVacancyIds.includes(v.id)
            return (
              <Card key={v.id}>
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 py-3">
                  <CardTitle className="text-base font-medium">{v.title}</CardTitle>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary">{VACANCY_STATUSES[v.status].label}</Badge>
                    {hidden && <Badge variant="outline">Скрыта</Badge>}
                    {deleted && <Badge variant="destructive">Удалена из выдачи</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2 pb-4">
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/vacancies/${v.id}`}>Открыть</Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={hidden}
                    onClick={() => {
                      hideVacancy(v.id)
                      toast.success('Вакансия скрыта с публичных списков')
                    }}
                  >
                    Скрыть
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={deleted}
                    onClick={() => {
                      deleteVacancy(v.id)
                      toast.success('Вакансия убрана из публичной выдачи')
                    }}
                  >
                    Удалить из выдачи
                  </Button>
                  {(hidden || deleted) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        restoreVacancy(v.id)
                        toast.success('Модерация сброшена для этой вакансии')
                      }}
                    >
                      Восстановить
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
