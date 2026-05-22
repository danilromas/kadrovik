import { useEffect, useMemo, useState } from 'react'
import { AiAssistantTrigger, useAiPageContext } from '@/features/ai-assistant'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
import { PROFESSIONS, CITIES } from '@/shared/constants'

const schema = z.object({
  title: z.string().min(2),
  profession: z.string().min(1),
  specialization: z.string().min(1),
  desiredSalary: z.coerce.number().min(0),
  about: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function ResumeFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isCreate = !id

  const { data: resume, isLoading } = useQuery({
    queryKey: ['resume-edit', id],
    queryFn: () => mockApi.getResumeById(id!),
    enabled: !isCreate && Boolean(id),
  })

  const [pdfLabel, setPdfLabel] = useState('')

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      profession: PROFESSIONS[0] ?? '',
      specialization: '',
      desiredSalary: 150000,
      about: '',
    },
  })

  const watched = form.watch()

  const aiContext = useMemo(
    () => ({
      page: 'resume-form',
      summary: isCreate ? 'Создание резюме' : 'Редактирование резюме',
      data: {
        title: watched.title,
        profession: watched.profession,
        specialization: watched.specialization,
        about: watched.about?.slice(0, 200),
      },
    }),
    [isCreate, watched.title, watched.profession, watched.specialization, watched.about]
  )

  useAiPageContext(aiContext)

  useEffect(() => {
    if (resume?.pdfUrl) setPdfLabel(resume.pdfUrl.split('/').pop() ?? 'resume.pdf')
    else if (!resume && !isCreate) setPdfLabel('')
  }, [resume, isCreate])

  useEffect(() => {
    if (resume) {
      form.reset({
        title: resume.title,
        profession: resume.profession,
        specialization: resume.specialization,
        desiredSalary: resume.desiredSalary ?? 0,
        about: resume.about ?? '',
      })
    }
  }, [resume, form])

  const onSubmit = (_data: FormValues) => {
    toast.success(isCreate ? 'Резюме создано (демо)' : 'Резюме сохранено (демо)')
    navigate('/dashboard/resume')
  }

  if (!isCreate && isLoading) {
    return <p className="text-muted-foreground">Загрузка…</p>
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/dashboard/resume">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-foreground">{isCreate ? 'Новое резюме' : 'Редактирование'}</h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <CardTitle>Основное</CardTitle>
            <AiAssistantTrigger
              prompt={`Помоги улучшить резюме для Крыма: должность «${watched.title || 'не указана'}», сфера ${watched.profession}. Предложи блок «О себе» и список навыков.`}
              label="ИИ: резюме"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Название</Label>
              <Input {...form.register('title')} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Профессия</Label>
                <Select value={form.watch('profession')} onValueChange={(v) => form.setValue('profession', v)}>
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
              <Label>Желаемая зарплата</Label>
              <Input type="number" {...form.register('desiredSalary')} />
            </div>
            <div className="space-y-2">
              <Label>Город (справочник)</Label>
              <Select defaultValue={CITIES[0]?.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.slice(0, 20).map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>О себе</Label>
              <Textarea rows={6} {...form.register('about')} />
            </div>
            <div className="space-y-2">
              <Label>PDF резюме (ТЗ C.3, демо)</Label>
              <Input
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) {
                    setPdfLabel(f.name)
                    toast.message('Файл выбран', { description: 'На сервер не загружается — только UI.' })
                  }
                }}
              />
              {pdfLabel ? (
                <p className="text-xs text-muted-foreground">Текущий файл: {pdfLabel}</p>
              ) : null}
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-2">
          <Button type="submit">Сохранить</Button>
          <Button type="button" variant="outline" asChild>
            <Link to="/dashboard/resume">Отмена</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
