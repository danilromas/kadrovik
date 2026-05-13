import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Briefcase, Banknote } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Separator } from '@/shared/ui/separator'
import { mockApi } from '@/shared/api/mockApi'
import { CURRENCIES, EMPLOYMENT_TYPE_LABELS, WORK_FORMATS, SKILL_LEVELS } from '@/shared/constants'
import { useAuthStore } from '@/features/auth/store/authStore'

export function PublicResumeDetailPage() {
  const { id } = useParams()
  const { user } = useAuthStore()

  const { data: resume, isLoading } = useQuery({
    queryKey: ['public-resume', id],
    queryFn: () => mockApi.getResumeById(id!),
    enabled: Boolean(id),
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-muted-foreground">Загрузка…</p>
      </div>
    )
  }

  if (!resume) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-xl font-semibold mb-4">Резюме не найдено</h1>
        <Button asChild variant="outline">
          <Link to="/resumes">К списку</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link to="/resumes" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Все резюме
      </Link>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{resume.title}</CardTitle>
              <p className="text-muted-foreground mt-1">
                {resume.profession} · {resume.specialization}
              </p>
            </div>
            {resume.desiredSalary != null && (
              <div className="text-right">
                <div className="flex items-center gap-1 text-lg font-semibold text-primary">
                  <Banknote className="h-5 w-5" />
                  от {resume.desiredSalary.toLocaleString('ru-RU')} {CURRENCIES[resume.currency].symbol}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {resume.employmentType.map((t) => (
              <Badge key={t} variant="secondary">
                {EMPLOYMENT_TYPE_LABELS[t]}
              </Badge>
            ))}
            {resume.workFormat.map((w) => (
              <Badge key={w} variant="outline">
                {WORK_FORMATS[w]}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {resume.about && (
            <div>
              <h2 className="font-semibold mb-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                О себе
              </h2>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{resume.about}</p>
            </div>
          )}
          <Separator />
          <div>
            <h2 className="font-semibold mb-3">Навыки</h2>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((s) => (
                <Badge key={s.name} variant="secondary">
                  {s.name} · {SKILL_LEVELS[s.level as keyof typeof SKILL_LEVELS] ?? s.level}
                </Badge>
              ))}
            </div>
          </div>
          {user?.role === 'employer' || user?.role === 'recruiter' ? (
            <Button className="w-full sm:w-auto">Пригласить (демо)</Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
