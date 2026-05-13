import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ExternalLink, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { mockApi } from '@/shared/api/mockApi'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { APPLICATION_STATUSES, PIPELINE_STAGES } from '@/shared/constants'
import { formatDistanceToNow } from '@/shared/lib/utils'
import type { PipelineStage } from '@/shared/types'

const STAGE_ALL = '__all__'

export function EmployerApplicationsPage() {
  const { user } = useAuthStore()
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState(STAGE_ALL)

  const companyId =
    user && (user.role === 'employer' || user.role === 'recruiter') && 'companyId' in user && user.companyId
      ? user.companyId
      : 'company-1'

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ['employer-applications', companyId],
    queryFn: async () => {
      const all = await mockApi.getApplications()
      return all.filter((a) => a.vacancy?.companyId === companyId || a.vacancy?.company?.id === companyId)
    },
  })

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return apps.filter((app) => {
      if (stageFilter !== STAGE_ALL && app.pipelineStage !== (stageFilter as PipelineStage)) return false
      if (!q) return true
      const name = app.candidate ? `${app.candidate.firstName} ${app.candidate.lastName}`.toLowerCase() : ''
      const vac = app.vacancy?.title?.toLowerCase() ?? ''
      return name.includes(q) || vac.includes(q)
    })
  }, [apps, search, stageFilter])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Отклики</h1>
        <p className="text-muted-foreground">Поиск, фильтр по этапу, приглашение (демо)</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Поиск по кандидату или вакансии"
          className="max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Этап" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={STAGE_ALL}>Все этапы</SelectItem>
            {(Object.keys(PIPELINE_STAGES) as PipelineStage[]).map((s) => (
              <SelectItem key={s} value={s}>
                {PIPELINE_STAGES[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Загрузка…</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const name = app.candidate ? `${app.candidate.firstName} ${app.candidate.lastName}` : 'Кандидат'
            return (
              <Card key={app.id}>
                <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 pb-2">
                  <div>
                    <CardTitle className="text-base font-medium">{name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{app.vacancy?.title}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{PIPELINE_STAGES[app.pipelineStage].label}</Badge>
                    <Badge variant="secondary">{APPLICATION_STATUSES[app.status].label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                  <span>{formatDistanceToNow(new Date(app.createdAt))}</span>
                  <div className="flex flex-wrap gap-2">
                    {app.resumeId && (
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/resumes/${app.resumeId}`}>
                          Резюме
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        toast.success('Приглашение отправлено (демо)', {
                          description: `${name} · ${app.vacancy?.title}`,
                        })
                      }
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Пригласить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
