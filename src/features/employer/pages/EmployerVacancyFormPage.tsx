import { useEffect, useMemo } from 'react'
import { AiAssistantTrigger, useAiPageContext } from '@/features/ai-assistant'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { mockApi } from '@/shared/api/mockApi'
import { CITIES, PROFESSIONS, SCHEDULE_TYPES, EMPLOYMENT_TYPES } from '@/shared/constants'
import type { Currency, EmploymentType, VacancyStatus, WorkSchedule } from '@/shared/types'

const schema = z.object({
  title: z.string().min(2, 'Укажите название'),
  profession: z.string().min(1),
  specialization: z.string().min(1),
  city: z.string().min(1),
  description: z.string().min(20, 'Описание слишком короткое'),
  salaryMin: z.coerce.number().min(0),
  salaryMax: z.coerce.number().min(0),
  currency: z.enum(['RUB', 'USD', 'EUR', 'KZT', 'BYN', 'UAH']),
  experienceYears: z.coerce.number().min(0).max(30),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance']),
  schedule: z.enum(['full-day', 'shift', 'flexible', 'remote']),
  workFormatOffice: z.boolean(),
  workFormatRemote: z.boolean(),
  workFormatHybrid: z.boolean(),
  status: z.enum(['draft', 'published', 'paused', 'closed']),
})

type FormValues = z.infer<typeof schema>

const defaultValues: FormValues = {
  title: '',
  profession: PROFESSIONS[0] ?? 'Разработка',
  specialization: 'Frontend',
  city: 'Симферополь',
  description: '',
  salaryMin: 100000,
  salaryMax: 200000,
  currency: 'RUB',
  experienceYears: 1,
  employmentType: 'full-time',
  schedule: 'full-day',
  workFormatOffice: true,
  workFormatRemote: false,
  workFormatHybrid: true,
  status: 'draft',
}

export function EmployerVacancyFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const isNew = location.pathname.endsWith('/vacancies/new')

  const { data: vacancy, isLoading } = useQuery({
    queryKey: ['vacancy', id],
    queryFn: () => (!id ? Promise.resolve(null) : mockApi.getVacancyById(id)),
    enabled: !isNew && Boolean(id),
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const watched = form.watch()

  const aiContext = useMemo(
    () => ({
      page: 'vacancy-form',
      summary: isNew ? 'Создание новой вакансии' : 'Редактирование вакансии',
      data: {
        title: watched.title,
        city: watched.city,
        profession: watched.profession,
        specialization: watched.specialization,
      },
    }),
    [isNew, watched.title, watched.city, watched.profession, watched.specialization]
  )

  useAiPageContext(aiContext)

  useEffect(() => {
    if (vacancy) {
      form.reset({
        title: vacancy.title,
        profession: vacancy.profession,
        specialization: vacancy.specialization,
        city: vacancy.city,
        description: vacancy.description,
        salaryMin: vacancy.salaryMin ?? 0,
        salaryMax: vacancy.salaryMax ?? 0,
        currency: vacancy.currency,
        experienceYears: vacancy.experienceYears,
        employmentType: vacancy.employmentType[0] ?? 'full-time',
        schedule: vacancy.schedule,
        workFormatOffice: vacancy.workFormat.includes('office'),
        workFormatRemote: vacancy.workFormat.includes('remote'),
        workFormatHybrid: vacancy.workFormat.includes('hybrid'),
        status: vacancy.status,
      })
    }
  }, [vacancy, form])

  const onSubmit = (_data: FormValues) => {
    toast.success(isNew ? 'Вакансия создана (демо)' : 'Вакансия обновлена (демо)')
    navigate('/employer/vacancies')
  }

  if (!isNew && isLoading) {
    return <p className="text-muted-foreground">Загрузка…</p>
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/employer/vacancies">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isNew ? 'Новая вакансия' : 'Редактирование'}</h1>
          <p className="text-muted-foreground text-sm">Форма без отправки на сервер</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <CardTitle>Основное</CardTitle>
            <AiAssistantTrigger
              prompt={`Сгенерируй полное описание вакансии для Крыма: должность «${watched.title || 'не указана'}», город ${watched.city}, сфера ${watched.profession}, специализация ${watched.specialization}. Включи обязанности, требования и условия.`}
              label="ИИ: описание"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Название</Label>
              <Input {...form.register('title')} />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Профессия</Label>
                <Select
                  value={form.watch('profession')}
                  onValueChange={(v) => form.setValue('profession', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFESSIONS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Специализация</Label>
                <Input {...form.register('specialization')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Город</Label>
              <Select value={form.watch('city')} onValueChange={(v) => form.setValue('city', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea rows={10} {...form.register('description')} />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Условия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>От, ₽ / валюта</Label>
                <Input type="number" {...form.register('salaryMin')} />
              </div>
              <div className="space-y-2">
                <Label>До</Label>
                <Input type="number" {...form.register('salaryMax')} />
              </div>
              <div className="space-y-2">
                <Label>Валюта</Label>
                <Select
                  value={form.watch('currency')}
                  onValueChange={(v) => form.setValue('currency', v as Currency)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(['RUB', 'USD', 'EUR'] as const).map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Опыт, лет</Label>
                <Input type="number" {...form.register('experienceYears')} />
              </div>
              <div className="space-y-2">
                <Label>Занятость</Label>
                <Select
                  value={form.watch('employmentType')}
                  onValueChange={(v) => form.setValue('employmentType', v as EmploymentType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>График</Label>
              <Select
                value={form.watch('schedule')}
                onValueChange={(v) => form.setValue('schedule', v as WorkSchedule)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCHEDULE_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Формат работы</Label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.watch('workFormatOffice')}
                    onChange={(e) => form.setValue('workFormatOffice', e.target.checked)}
                  />
                  Офис
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.watch('workFormatRemote')}
                    onChange={(e) => form.setValue('workFormatRemote', e.target.checked)}
                  />
                  Удалённо
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.watch('workFormatHybrid')}
                    onChange={(e) => form.setValue('workFormatHybrid', e.target.checked)}
                  />
                  Гибрид
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Статус</Label>
              <Select
                value={form.watch('status')}
                onValueChange={(v) => form.setValue('status', v as VacancyStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Черновик</SelectItem>
                  <SelectItem value="published">Опубликована</SelectItem>
                  <SelectItem value="paused">Пауза</SelectItem>
                  <SelectItem value="closed">Закрыта</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit">Сохранить</Button>
          <Button type="button" variant="outline" asChild>
            <Link to="/employer/vacancies">Отмена</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
