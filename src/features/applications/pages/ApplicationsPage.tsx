import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Filter, Clock, Building2, MapPin, CheckCircle, XCircle, MessageSquare } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Separator } from '@/shared/ui/separator'
import { useAuthStore } from '@/features/auth/store/authStore'
import { APPLICATION_STATUSES, PIPELINE_STAGES } from '@/shared/constants'
import { formatDistanceToNow } from '@/shared/lib/utils'
import type { ApplicationStatus } from '@/shared/types'
import { useApplicationsQuery, useVacanciesQuery } from '@/shared/api/queries'

const TAB_ALL = 'all'

export function ApplicationsPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<string>(TAB_ALL)
  const { data: allApplications = [], isLoading } = useApplicationsQuery()
  const { data: vacancies = [] } = useVacanciesQuery()

  const applications = useMemo(
    () => allApplications.filter((a) => a.candidateId === user?.id),
    [allApplications, user?.id]
  )

  const filteredApplications = useMemo(() => {
    if (activeTab === TAB_ALL) return applications
    return applications.filter((a) => a.status === activeTab)
  }, [applications, activeTab])

  const counts = useMemo(() => {
    const c: Record<string, number> = { [TAB_ALL]: applications.length }
    for (const a of applications) {
      c[a.status] = (c[a.status] ?? 0) + 1
    }
    return c
  }, [applications])

  const statusTabs: { value: string; label: string }[] = [
    { value: TAB_ALL, label: 'Все' },
    { value: 'pending', label: 'На рассмотрении' },
    { value: 'reviewed', label: 'Просмотрено' },
    { value: 'accepted', label: 'Принято' },
    { value: 'rejected', label: 'Отказ' },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-2">Мои отклики</h1>
        <p className="text-muted-foreground">Статус, таймлайн и сообщения от HR (демо)</p>
      </motion.div>

      {isLoading && <p className="text-sm text-muted-foreground">Загрузка откликов…</p>}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          {statusTabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="text-xs sm:text-sm">
              {t.label}
              <Badge variant="secondary" className="ml-1 tabular-nums">
                {counts[t.value] ?? 0}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredApplications.map((application, index) => {
              const vacancy = vacancies.find((v) => v.id === application.vacancyId)
              if (!vacancy) return null

              const st = APPLICATION_STATUSES[application.status as ApplicationStatus]
              const hrNotes = application.notes ?? []
              const timeline = application.timeline ?? []

              return (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                            <Building2 className="h-7 w-7 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link to={`/vacancies/${vacancy.id}`} className="hover:text-primary">
                              <h3 className="font-semibold text-foreground text-lg">{vacancy.title}</h3>
                            </Link>
                            <Link
                              to={`/companies/${vacancy.company?.id ?? vacancy.companyId}`}
                              className="text-muted-foreground hover:text-primary"
                            >
                              {vacancy.company?.name ?? 'Компания'}
                            </Link>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {vacancy.city}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Отклик {formatDistanceToNow(new Date(application.createdAt))}
                              </span>
                              <Badge variant="outline">{PIPELINE_STAGES[application.pipelineStage].label}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <Badge variant="secondary">{st.label}</Badge>
                          <Button variant="outline" size="sm" asChild>
                            <Link to="/dashboard/messages">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Написать
                            </Link>
                          </Button>
                        </div>
                      </div>

                      {hrNotes.length > 0 && (
                        <div className="rounded-lg border bg-muted/30 p-4">
                          <p className="text-sm font-medium text-foreground mb-2">Сообщения от HR</p>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            {hrNotes.map((n) => (
                              <li key={n.id}>
                                <span className="text-foreground">{n.content}</span>
                                <span className="block text-xs mt-0.5">
                                  {formatDistanceToNow(new Date(n.createdAt))}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <details className="group text-sm">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground list-none flex items-center gap-1 [&::-webkit-details-marker]:hidden">
                          <span className="inline-block transition-transform group-open:rotate-90">▸</span>
                          Таймлайн ({timeline.length})
                        </summary>
                        <Separator className="my-3" />
                        <ol className="space-y-2 border-l-2 border-primary/30 pl-4 ml-1 pb-2">
                          {timeline.map((ev) => (
                            <li key={ev.id} className="relative">
                              <span className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-primary" />
                              <p className="text-foreground">{ev.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(ev.createdAt))}
                              </p>
                            </li>
                          ))}
                        </ol>
                      </details>

                      {application.pipelineStage === 'interview' && application.interviewDate && (
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                          <div className="flex items-center gap-2 text-primary">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-medium">Собеседование назначено</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(application.interviewDate).toLocaleDateString('ru-RU', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      )}

                      {application.status === 'rejected' && application.rejectionReason && (
                        <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                          <div className="flex items-center gap-2 text-destructive">
                            <XCircle className="h-5 w-5" />
                            <span className="font-medium">Причина отказа</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{application.rejectionReason}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}

            {filteredApplications.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Нет откликов</h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === TAB_ALL
                      ? 'У вас пока нет откликов. Начните поиск работы!'
                      : 'В этой категории пока нет откликов'}
                  </p>
                  <Button asChild>
                    <Link to="/vacancies">Найти вакансии</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
