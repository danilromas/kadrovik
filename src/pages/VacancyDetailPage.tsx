import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  MapPin,
  Building2,
  Clock,
  Briefcase,
  Heart,
  Share2,
  Flag,
  Users,
  Globe,
  Calendar,
  ArrowLeft,
  Send,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Separator } from '@/shared/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Textarea } from '@/shared/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { mockResumes } from '@/shared/mocks/resumes'
import { useFavoritesStore } from '@/features/favorites/store/favoritesStore'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useVacancyHistoryStore } from '@/features/history/store/vacancyHistoryStore'
import { EXPERIENCE_LEVELS, EMPLOYMENT_TYPE_LABELS, WORK_SCHEDULES } from '@/shared/constants'
import { formatDistanceToNow, formatSalary, getExperienceFilterValue } from '@/shared/lib/utils'
import { getPostLoginPath } from '@/shared/lib/navigation'
import { useVacancyQuery, useVacanciesQuery } from '@/shared/api/queries'
import { vacancyApplySchema, type VacancyApplyFormValues } from '@/shared/lib/schemas'

export function VacancyDetailPage() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const { favoriteVacancies, toggleVacancy } = useFavoritesStore()
  const recordView = useVacancyHistoryStore((s) => s.recordView)
  const [applyOpen, setApplyOpen] = useState(false)

  const { data: vacancy, isPending: vacancyLoading, isError } = useVacancyQuery(id)
  const { data: vacancyList = [] } = useVacanciesQuery()

  const applyForm = useForm<VacancyApplyFormValues>({
    resolver: zodResolver(vacancyApplySchema),
    defaultValues: { resumeId: '', coverLetter: '' },
  })

  useEffect(() => {
    if (vacancy?.id) recordView(vacancy.id)
  }, [vacancy?.id, recordView])

  const myResumes = useMemo(
    () => (user?.role === 'candidate' ? mockResumes.filter((r) => r.userId === user.id) : []),
    [user]
  )
  const isCandidate = user?.role === 'candidate'

  useEffect(() => {
    if (applyOpen && myResumes.length > 0) {
      applyForm.reset({
        resumeId: myResumes[0].id,
        coverLetter: '',
      })
    }
  }, [applyOpen, myResumes, applyForm])

  if (vacancyLoading) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">Загрузка вакансии…</div>
      </div>
    )
  }

  if (!vacancy || isError) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Вакансия не найдена</h1>
          <Button asChild>
            <Link to="/vacancies">К списку вакансий</Link>
          </Button>
        </div>
      </div>
    )
  }

  const isFavorite = favoriteVacancies.includes(vacancy.id)
  const similarVacancies = vacancyList
    .filter((v) => v.id !== vacancy.id && v.profession === vacancy.profession)
    .slice(0, 3)

  const company = vacancy.company

  const onApplySubmit = (data: VacancyApplyFormValues) => {
    toast.success('Отклик отправлен (демо)', {
      description: `Вакансия: ${vacancy.title}. Резюме: ${myResumes.find((r) => r.id === data.resumeId)?.title ?? data.resumeId}`,
    })
    setApplyOpen(false)
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Link to="/vacancies" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к вакансиям
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center shrink-0">
                        {company?.logo ? (
                          <img src={company.logo} alt="" className="w-12 h-12 object-contain" />
                        ) : (
                          <Building2 className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {vacancy.isHot && <Badge variant="destructive">Hot</Badge>}
                          {vacancy.isUrgent && <Badge>Срочно</Badge>}
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-1">{vacancy.title}</h1>
                        <Link
                          to={`/companies/${company?.id ?? vacancy.companyId}`}
                          className="text-primary hover:underline"
                        >
                          {company?.name ?? 'Компания'}
                        </Link>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => toggleVacancy(vacancy.id)}>
                        <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-2xl font-bold text-primary mb-6">
                    {formatSalary(vacancy.salaryMin, vacancy.salaryMax, vacancy.currency)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{vacancy.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>
                        {EXPERIENCE_LEVELS.find((e) => e.value === getExperienceFilterValue(vacancy.experienceYears))
                          ?.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{WORK_SCHEDULES[vacancy.schedule]}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDistanceToNow(new Date(vacancy.createdAt))}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6">
                    {vacancy.employmentType.map((t) => EMPLOYMENT_TYPE_LABELS[t]).join(' · ')}
                  </p>

                  {vacancy.workFormat.includes('remote') && (
                    <Badge variant="secondary" className="mb-6">
                      <Globe className="h-3 w-3 mr-1" />
                      Удалённая работа
                    </Badge>
                  )}

                  <Separator className="my-6" />

                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Описание</h2>
                    <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                      {vacancy.description}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Ключевые навыки</h2>
                    <div className="flex flex-wrap gap-2">
                      {vacancy.skills.map((skill) => (
                        <Badge key={skill.name} variant="secondary">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {similarVacancies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Похожие вакансии</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {similarVacancies.map((v) => (
                      <Link key={v.id} to={`/vacancies/${v.id}`}>
                        <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted transition-colors">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <Building2 className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate">{v.title}</h4>
                            <p className="text-sm text-muted-foreground">{v.company?.name ?? 'Компания'}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-primary">
                              {formatSalary(v.salaryMin, v.salaryMax, v.currency)}
                            </div>
                            <div className="text-sm text-muted-foreground">{v.city}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  {user ? (
                    isCandidate ? (
                      <>
                        <Button className="w-full mb-3" size="lg" type="button" onClick={() => setApplyOpen(true)}>
                          <Send className="h-4 w-4 mr-2" />
                          Откликнуться
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/dashboard/messages">Написать сообщение</Link>
                        </Button>
                        <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Отклик на вакансию</DialogTitle>
                              <DialogDescription>
                                Выберите резюме и при необходимости добавьте сопроводительное письмо (демо).
                              </DialogDescription>
                            </DialogHeader>
                            {myResumes.length === 0 ? (
                              <p className="text-sm text-muted-foreground">Сначала создайте резюме в личном кабинете.</p>
                            ) : (
                              <Form {...applyForm}>
                                <form
                                  id="apply-form"
                                  onSubmit={applyForm.handleSubmit(onApplySubmit)}
                                  className="space-y-4 py-2"
                                >
                                  <FormField
                                    control={applyForm.control}
                                    name="resumeId"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Резюме</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                          <FormControl>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Выберите резюме" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            {myResumes.map((r) => (
                                              <SelectItem key={r.id} value={r.id}>
                                                {r.title}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={applyForm.control}
                                    name="coverLetter"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Сопроводительное письмо</FormLabel>
                                        <FormControl>
                                          <Textarea
                                            rows={5}
                                            placeholder="Кратко расскажите, почему вам интересна эта позиция"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </form>
                              </Form>
                            )}
                            <DialogFooter className="gap-2 sm:gap-0">
                              <Button type="button" variant="outline" onClick={() => setApplyOpen(false)}>
                                Отмена
                              </Button>
                              <Button type="submit" form="apply-form" disabled={!myResumes.length}>
                                Отправить
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground text-center mb-4">
                          Отклик доступен соискателям. Откройте личный кабинет для других действий.
                        </p>
                        <Button variant="outline" className="w-full" asChild>
                          <Link to={user ? getPostLoginPath(user) : '/'}>Личный кабинет</Link>
                        </Button>
                      </>
                    )
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        Войдите, чтобы откликнуться на вакансию
                      </p>
                      <Button asChild className="w-full">
                        <Link to="/login">Войти</Link>
                      </Button>
                    </>
                  )}
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {vacancy.views} просмотров
                    </span>
                    <span>{vacancy.applicationsCount} откликов</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">О компании</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                      <Building2 className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <div>
                      <Link
                        to={`/companies/${company?.id ?? vacancy.companyId}`}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {company?.name ?? 'Компания'}
                      </Link>
                      <p className="text-sm text-muted-foreground">{company?.industry}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{company?.description}</p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/companies/${company?.id ?? vacancy.companyId}`}>Подробнее о компании</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <Button variant="ghost" className="w-full text-muted-foreground">
              <Flag className="h-4 w-4 mr-2" />
              Пожаловаться на вакансию
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
