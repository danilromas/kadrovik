import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Plus,
  FileText,
  Eye,
  Download,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Star,
  Clock,
  Funnel,
  X,
} from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { mockResumes } from '@/shared/mocks/resumes'
import { formatDistanceToNow, getExperienceFilterValue } from '@/shared/lib/utils'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { EXPERIENCE_LEVELS, POPULAR_SKILLS } from '@/shared/constants'
import type { Resume } from '@/shared/types'
import { useAdminModerationStore, isResumeModeratedOut } from '@/features/admin/store/adminModerationStore'

type ResumesPageVariant = 'dashboard' | 'public'

interface ResumesPageProps {
  variant?: ResumesPageVariant
}

function resumeTotalYears(resume: Resume): number {
  if (!resume.experience?.length) return 0
  let y = 0
  for (const e of resume.experience) {
    const start = new Date(e.startDate).getTime()
    const end = e.isCurrent ? Date.now() : new Date(e.endDate || e.startDate).getTime()
    y += Math.max(0, (end - start) / (365.25 * 24 * 60 * 60 * 1000))
  }
  return Math.round(y) || 0
}

function uniqueDegrees(resumes: Resume[]): string[] {
  const set = new Set<string>()
  for (const r of resumes) {
    for (const ed of r.education ?? []) {
      if (ed.degree.trim()) set.add(ed.degree.trim())
    }
  }
  return [...set].sort()
}

function uniqueLanguageNames(resumes: Resume[]): string[] {
  const set = new Set<string>()
  for (const r of resumes) {
    for (const l of r.languages ?? []) {
      if (l.name.trim()) set.add(l.name.trim())
    }
  }
  return [...set].sort()
}

export function ResumesPage({ variant = 'dashboard' }: ResumesPageProps) {
  const [resumes] = useState(mockResumes)
  const isPublic = variant === 'public'
  const moderation = useAdminModerationStore()

  const [q, setQ] = useState('')
  const debouncedQ = useDebounce(q, 300)
  const [specialization, setSpecialization] = useState<string>('__all__')
  const [skillTag, setSkillTag] = useState<string>('__all__')
  const [expBand, setExpBand] = useState<string>('__all__')
  const [degree, setDegree] = useState<string>('__all__')
  const [languageName, setLanguageName] = useState<string>('__all__')

  const specs = useMemo(() => {
    const s = new Set(resumes.map((r) => r.specialization).filter(Boolean))
    return [...s].sort()
  }, [resumes])

  const degrees = useMemo(() => uniqueDegrees(resumes), [resumes])
  const languageNames = useMemo(() => uniqueLanguageNames(resumes), [resumes])

  const filteredPublic = useMemo(() => {
    if (!isPublic) return resumes
    const base = resumes.filter((r) => !isResumeModeratedOut(r.id, moderation))
    const needle = debouncedQ.trim().toLowerCase()
    return base.filter((r) => {
      if (specialization !== '__all__' && r.specialization !== specialization) return false
      if (skillTag !== '__all__') {
        const names = r.skills.map((x) => x.name.toLowerCase())
        if (!names.includes(skillTag.toLowerCase())) return false
      }
      if (expBand !== '__all__') {
        const band = getExperienceFilterValue(resumeTotalYears(r))
        if (band !== expBand) return false
      }
      if (degree !== '__all__') {
        const has = r.education?.some((e) => e.degree === degree)
        if (!has) return false
      }
      if (languageName !== '__all__') {
        const hasLang = r.languages?.some((l) => l.name === languageName)
        if (!hasLang) return false
      }
      if (!needle) return true
      const blob = `${r.title} ${r.profession} ${r.specialization} ${r.skills.map((s) => s.name).join(' ')} ${(r.languages ?? []).map((l) => l.name).join(' ')}`.toLowerCase()
      return blob.includes(needle)
    })
  }, [isPublic, resumes, moderation, debouncedQ, specialization, skillTag, expBand, degree, languageName])

  const clearFilters = () => {
    setQ('')
    setSpecialization('__all__')
    setSkillTag('__all__')
    setExpBand('__all__')
    setDegree('__all__')
    setLanguageName('__all__')
  }

  const list = isPublic ? filteredPublic : resumes

  const publicCatalogTotal = useMemo(
    () => resumes.filter((r) => !isResumeModeratedOut(r.id, moderation)).length,
    [resumes, moderation]
  )

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isPublic ? 'Каталог резюме' : 'Мои резюме'}
          </h1>
          <p className="text-muted-foreground">
            {isPublic ? 'Демо-данные специалистов на платформе' : 'Управляйте своими резюме'}
          </p>
        </div>
        {!isPublic && (
          <Button asChild>
            <Link to="/dashboard/resume/create">
              <Plus className="h-4 w-4 mr-2" />
              Создать резюме
            </Link>
          </Button>
        )}
        {isPublic && (
          <Button asChild variant="outline">
            <Link to="/register">Разместить резюме</Link>
          </Button>
        )}
      </motion.div>

      {isPublic && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Funnel className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Фильтры</span>
              <Button type="button" variant="ghost" size="sm" className="ml-auto gap-1" onClick={clearFilters}>
                <X className="h-3 w-3" />
                Сбросить
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <div className="space-y-1 lg:col-span-2">
                <Label htmlFor="resume-q">Поиск</Label>
                <Input
                  id="resume-q"
                  placeholder="Должность, навык, направление…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Специализация</Label>
                <Select value={specialization} onValueChange={setSpecialization}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Все</SelectItem>
                    {specs.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Навык</Label>
                <Select value={skillTag} onValueChange={setSkillTag}>
                  <SelectTrigger>
                    <SelectValue placeholder="Любой" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    <SelectItem value="__all__">Любой</SelectItem>
                    {POPULAR_SKILLS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Опыт (оценка)</Label>
                <Select value={expBand} onValueChange={setExpBand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Любой" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Любой</SelectItem>
                    {EXPERIENCE_LEVELS.map((e) => (
                      <SelectItem key={e.value} value={e.value}>
                        {e.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                <Label>Образование (степень)</Label>
                <Select value={degree} onValueChange={setDegree}>
                  <SelectTrigger>
                    <SelectValue placeholder="Любая" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Любая</SelectItem>
                    {degrees.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 sm:col-span-2 lg:col-span-2">
                <Label>Язык</Label>
                <Select value={languageName} onValueChange={setLanguageName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Любой" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Любой</SelectItem>
                    {languageNames.map((n) => (
                      <SelectItem key={n} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Найдено: {list.length} из {isPublic ? publicCatalogTotal : resumes.length}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((resume, index) => (
          <motion.div
            key={resume.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {isPublic ? (
              <Link to={`/resumes/${resume.id}`} className="block">
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-primary/10">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground line-clamp-1">{resume.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {resume.desiredSalary
                              ? `${resume.desiredSalary.toLocaleString()} ₽`
                              : 'Зарплата не указана'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{resume.specialization}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {resume.views} просмотров
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDistanceToNow(new Date(resume.updatedAt))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant={resume.isPublished ? 'default' : 'secondary'}>
                        {resume.isPublished ? 'Активно' : 'Скрыто'}
                      </Badge>
                      {resume.isMain && (
                        <Badge variant="outline" className="gap-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          Основное
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground line-clamp-1">{resume.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {resume.desiredSalary
                            ? `${resume.desiredSalary.toLocaleString()} ₽`
                            : 'Зарплата не указана'}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/dashboard/resume/${resume.id}/edit`} className="flex items-center cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" />
                            Редактировать
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Дублировать
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Скачать PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {resume.views} просмотров
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDistanceToNow(new Date(resume.updatedAt))}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant={resume.isPublished ? 'default' : 'secondary'}>
                      {resume.isPublished ? 'Активно' : 'Скрыто'}
                    </Badge>
                    {resume.isMain && (
                      <Badge variant="outline" className="gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        Основное
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        ))}

        {!isPublic && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: resumes.length * 0.1 }}
          >
            <Link to="/dashboard/resume/create">
              <Card className="h-full min-h-[200px] border-dashed hover:border-primary hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="p-4 rounded-full bg-muted mb-4">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Создать резюме</h3>
                  <p className="text-sm text-muted-foreground">Добавьте новое резюме для поиска работы</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        )}
      </div>

      {isPublic && list.length === 0 && (
        <p className="text-center text-muted-foreground py-8">Ничего не найдено — измените фильтры.</p>
      )}
    </div>
  )
}
