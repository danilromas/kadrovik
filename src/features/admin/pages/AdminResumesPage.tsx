import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { mockApi } from '@/shared/api/mockApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { toast } from 'sonner'
import { useAdminModerationStore } from '@/features/admin/store/adminModerationStore'

export function AdminResumesPage() {
  const { data: resumes = [], isLoading } = useQuery({
    queryKey: ['admin-resumes'],
    queryFn: () => mockApi.getResumes(),
  })
  const hideResume = useAdminModerationStore((s) => s.hideResume)
  const rejectResume = useAdminModerationStore((s) => s.rejectResume)
  const restoreResume = useAdminModerationStore((s) => s.restoreResume)
  const hiddenResumeIds = useAdminModerationStore((s) => s.hiddenResumeIds)
  const rejectedResumeIds = useAdminModerationStore((s) => s.rejectedResumeIds)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Резюме</h1>
        <p className="text-muted-foreground">
          Модерация AD.4: скрытие из каталога, отклонение по жалобе (демо, persist)
        </p>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Загрузка…</p>
      ) : (
        <div className="space-y-2">
          {resumes.map((r) => {
            const hidden = hiddenResumeIds.includes(r.id)
            const rejected = rejectedResumeIds.includes(r.id)
            return (
              <Card key={r.id}>
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 py-3">
                  <CardTitle className="text-base font-medium">{r.title}</CardTitle>
                  <div className="flex gap-1">
                    {hidden && <Badge variant="outline">Скрыто</Badge>}
                    {rejected && <Badge variant="destructive">Отклонено</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2 pb-4 text-sm text-muted-foreground">
                  <span>{r.profession}</span>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/resumes/${r.id}`}>Просмотр</Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={hidden}
                    onClick={() => {
                      hideResume(r.id)
                      toast.success('Резюме скрыто из публичного каталога')
                    }}
                  >
                    Скрыть из каталога
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={rejected}
                    onClick={() => {
                      rejectResume(r.id)
                      toast.success('Жалоба обработана: резюме отклонено (демо)')
                    }}
                  >
                    Отклонить
                  </Button>
                  {(hidden || rejected) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        restoreResume(r.id)
                        toast.success('Статус модерации сброшен')
                      }}
                    >
                      Сбросить
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
