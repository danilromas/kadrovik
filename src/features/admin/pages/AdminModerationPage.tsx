import { Link } from 'react-router-dom'
import { Flag, FileText, Briefcase, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { formatDistanceToNow } from '@/shared/lib/utils'

/** Демо-очередь жалоб для модераторов (B.4) */
const MOCK_REPORTS = [
  {
    id: 'rep-1',
    kind: 'vacancy' as const,
    title: 'Вакансия',
    description: 'Подозрение на дискриминацию по возрасту в тексте описания.',
    targetId: 'vacancy-1',
    createdAt: '2024-03-19T12:00:00Z',
  },
  {
    id: 'rep-2',
    kind: 'resume' as const,
    title: 'Резюме',
    description: 'Жалоба на контактные данные в поле «О себе».',
    targetId: 'resume-2',
    createdAt: '2024-03-18T09:30:00Z',
  },
  {
    id: 'rep-3',
    kind: 'company' as const,
    title: 'Компания',
    description: 'Несоответствие названия и логотипа.',
    targetId: 'company-1',
    createdAt: '2024-03-17T16:00:00Z',
  },
]

export function AdminModerationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Очередь модерации</h1>
        <p className="text-muted-foreground">
          Сценарий для роли <Badge variant="secondary">moderator</Badge>: обработка жалоб (демо-данные). Перейдите к
          сущности и примите решение в разделах «Вакансии» / «Резюме» / «Компании».
        </p>
      </div>
      <div className="space-y-3">
        {MOCK_REPORTS.map((r) => (
          <Card key={r.id}>
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0 py-3">
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-amber-600 shrink-0" />
                <CardTitle className="text-base font-medium">{r.title}</CardTitle>
                <Badge variant="outline">{r.kind}</Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(r.createdAt))}
              </span>
            </CardHeader>
            <CardContent className="space-y-3 pb-4">
              <p className="text-sm text-muted-foreground">{r.description}</p>
              <div className="flex flex-wrap gap-2">
                {r.kind === 'vacancy' && (
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/vacancies/${r.targetId}`}>
                      <Briefcase className="h-4 w-4 mr-1" />
                      Открыть вакансию
                      <ExternalLink className="h-3 w-3 ml-1 opacity-60" />
                    </Link>
                  </Button>
                )}
                {r.kind === 'resume' && (
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/resumes/${r.targetId}`}>
                      <FileText className="h-4 w-4 mr-1" />
                      Открыть резюме
                      <ExternalLink className="h-3 w-3 ml-1 opacity-60" />
                    </Link>
                  </Button>
                )}
                {r.kind === 'company' && (
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/admin/companies`}>
                      Компании в админке
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
