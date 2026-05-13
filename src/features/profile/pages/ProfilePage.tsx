import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Camera, Save, Plus, Trash2, Car } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Checkbox } from '@/shared/ui/checkbox'
import { Badge } from '@/shared/ui/badge'
import { useAuthStore } from '@/features/auth/store/authStore'
import { CITIES, LANGUAGE_LEVELS } from '@/shared/constants'
import type { CandidateProfile, Education, Language } from '@/shared/types'
import { generateId } from '@/shared/lib/utils'

const DL_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'BE'] as const

function emptyEducation(): Education {
  const y = new Date().getFullYear()
  return {
    id: generateId(),
    institution: '',
    degree: '',
    field: '',
    startYear: y - 4,
    endYear: y,
    isCurrent: false,
  }
}

function emptyLanguage(): Language {
  return { name: '', level: 'B1' }
}

export function ProfilePage() {
  const { user, updateProfile } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [skillDraft, setSkillDraft] = useState('')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    secondPhone: '',
    city: '',
    about: '',
    gender: '' as '' | 'male' | 'female',
    birthDate: '',
    citizenship: '',
    searchCities: [] as string[],
    education: [] as Education[],
    languages: [] as Language[],
    skills: [] as string[],
    drivingLicense: [] as string[],
    drivingExperience: 0,
  })

  const isCandidate = user?.role === 'candidate'

  useEffect(() => {
    if (!user) return
    setFormData({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      middleName: user.middleName ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      secondPhone: user.secondPhone ?? '',
      city: user.city ?? '',
      about: user.about ?? '',
      gender: isCandidate && 'gender' in user ? (user as CandidateProfile).gender ?? '' : '',
      birthDate: isCandidate && 'birthDate' in user ? (user as CandidateProfile).birthDate ?? '' : '',
      citizenship: isCandidate && 'citizenship' in user ? (user as CandidateProfile).citizenship ?? '' : '',
      searchCities: isCandidate && 'searchCities' in user ? [...((user as CandidateProfile).searchCities ?? [])] : [],
      education:
        isCandidate && 'education' in user && (user as CandidateProfile).education?.length
          ? (user as CandidateProfile).education.map((e) => ({ ...e }))
          : [],
      languages:
        isCandidate && 'languages' in user && (user as CandidateProfile).languages?.length
          ? (user as CandidateProfile).languages.map((l) => ({ ...l }))
          : [],
      skills: isCandidate && 'skills' in user ? [...((user as CandidateProfile).skills ?? [])] : [],
      drivingLicense: isCandidate && 'drivingLicense' in user ? [...((user as CandidateProfile).drivingLicense ?? [])] : [],
      drivingExperience:
        isCandidate && 'drivingExperience' in user ? (user as CandidateProfile).drivingExperience ?? 0 : 0,
    })
  }, [user, isCandidate])

  const toggleSearchCity = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      searchCities: prev.searchCities.includes(value)
        ? prev.searchCities.filter((c) => c !== value)
        : [...prev.searchCities, value],
    }))
  }

  const toggleDl = (code: string) => {
    setFormData((prev) => ({
      ...prev,
      drivingLicense: prev.drivingLicense.includes(code)
        ? prev.drivingLicense.filter((x) => x !== code)
        : [...prev.drivingLicense, code],
    }))
  }

  const handleSave = () => {
    const base = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      middleName: formData.middleName || undefined,
      email: formData.email,
      phone: formData.phone || undefined,
      secondPhone: formData.secondPhone || undefined,
      city: formData.city || undefined,
      about: formData.about || undefined,
    }
    if (isCandidate) {
      updateProfile({
        ...base,
        gender: formData.gender || undefined,
        birthDate: formData.birthDate || undefined,
        citizenship: formData.citizenship || undefined,
        searchCities: formData.searchCities,
        education: formData.education.filter((e) => e.institution.trim()),
        languages: formData.languages.filter((l) => l.name.trim()),
        skills: formData.skills,
        drivingLicense: formData.drivingLicense.length ? formData.drivingLicense : undefined,
        drivingExperience: formData.drivingExperience || undefined,
      })
    } else {
      updateProfile(base)
    }
    toast.success('Профиль сохранён (демо, локально)')
    setIsEditing(false)
  }

  const addSkill = () => {
    const s = skillDraft.trim()
    if (!s || formData.skills.includes(s)) return
    setFormData((p) => ({ ...p, skills: [...p.skills, s] }))
    setSkillDraft('')
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Мой профиль</h1>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Редактировать</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Отмена
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Сохранить
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="relative inline-block mb-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-3xl">
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button size="icon" className="absolute bottom-0 right-0 rounded-full" type="button" disabled title="Демо: загрузка фото">
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Личные данные</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Имя</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      className="pl-10"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Фамилия</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleName">Отчество</Label>
                <Input
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondPhone">Доп. телефон</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="secondPhone"
                      className="pl-10"
                      value={formData.secondPhone}
                      onChange={(e) => setFormData({ ...formData, secondPhone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Необязательно"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Город проживания</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(v) => setFormData({ ...formData, city: v })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="city">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Выберите город" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map((city) => (
                        <SelectItem key={city.value} value={city.value}>
                          {city.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">О себе</Label>
                <Textarea
                  id="about"
                  rows={4}
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Расскажите немного о себе..."
                />
              </div>
            </CardContent>
          </Card>

          {isCandidate && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Соискатель</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Пол</Label>
                      <Select
                        value={formData.gender || '__none__'}
                        onValueChange={(v) =>
                          setFormData({ ...formData, gender: v === '__none__' ? '' : (v as 'male' | 'female') })
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Не указано" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">Не указано</SelectItem>
                          <SelectItem value="male">Мужской</SelectItem>
                          <SelectItem value="female">Женский</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Дата рождения</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="citizenship">Гражданство</Label>
                    <Input
                      id="citizenship"
                      value={formData.citizenship}
                      onChange={(e) => setFormData({ ...formData, citizenship: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Например: Россия"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Города поиска работы</Label>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto rounded-md border p-2">
                      {CITIES.map((c) => (
                        <label key={c.value} className="flex items-center gap-2 text-sm cursor-pointer">
                          <Checkbox
                            checked={formData.searchCities.includes(c.value)}
                            onCheckedChange={() => isEditing && toggleSearchCity(c.value)}
                            disabled={!isEditing}
                          />
                          {c.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Образование</Label>
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData((p) => ({ ...p, education: [...p.education, emptyEducation()] }))}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Запись
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      {formData.education.length === 0 && (
                        <p className="text-sm text-muted-foreground">Записей пока нет</p>
                      )}
                      {formData.education.map((edu, idx) => (
                        <div key={edu.id} className="rounded-lg border p-3 space-y-2">
                          <div className="flex justify-end">
                            {isEditing && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  setFormData((p) => ({
                                    ...p,
                                    education: p.education.filter((e) => e.id !== edu.id),
                                  }))
                                }
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                          <Input
                            placeholder="Учебное заведение"
                            value={edu.institution}
                            disabled={!isEditing}
                            onChange={(e) => {
                              const next = [...formData.education]
                              next[idx] = { ...edu, institution: e.target.value }
                              setFormData({ ...formData, education: next })
                            }}
                          />
                          <div className="grid md:grid-cols-2 gap-2">
                            <Input
                              placeholder="Степень / квалификация"
                              value={edu.degree}
                              disabled={!isEditing}
                              onChange={(e) => {
                                const next = [...formData.education]
                                next[idx] = { ...edu, degree: e.target.value }
                                setFormData({ ...formData, education: next })
                              }}
                            />
                            <Input
                              placeholder="Специальность / направление"
                              value={edu.field}
                              disabled={!isEditing}
                              onChange={(e) => {
                                const next = [...formData.education]
                                next[idx] = { ...edu, field: e.target.value }
                                setFormData({ ...formData, education: next })
                              }}
                            />
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <Input
                              type="number"
                              placeholder="Год начала"
                              value={edu.startYear}
                              disabled={!isEditing}
                              onChange={(e) => {
                                const next = [...formData.education]
                                next[idx] = { ...edu, startYear: Number(e.target.value) || 0 }
                                setFormData({ ...formData, education: next })
                              }}
                            />
                            <Input
                              type="number"
                              placeholder="Год окончания"
                              value={edu.endYear ?? ''}
                              disabled={!isEditing}
                              onChange={(e) => {
                                const next = [...formData.education]
                                next[idx] = { ...edu, endYear: e.target.value ? Number(e.target.value) : undefined }
                                setFormData({ ...formData, education: next })
                              }}
                            />
                            <label className="flex items-center gap-2 text-sm col-span-2">
                              <Checkbox
                                checked={edu.isCurrent}
                                disabled={!isEditing}
                                onCheckedChange={(c) => {
                                  const next = [...formData.education]
                                  next[idx] = { ...edu, isCurrent: c === true }
                                  setFormData({ ...formData, education: next })
                                }}
                              />
                              Учусь сейчас
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Языки</Label>
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData((p) => ({ ...p, languages: [...p.languages, emptyLanguage()] }))}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Язык
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {formData.languages.map((lang, idx) => (
                        <div key={idx} className="flex flex-wrap gap-2 items-end">
                          <Input
                            className="flex-1 min-w-[120px]"
                            placeholder="Язык"
                            value={lang.name}
                            disabled={!isEditing}
                            onChange={(e) => {
                              const next = [...formData.languages]
                              next[idx] = { ...lang, name: e.target.value }
                              setFormData({ ...formData, languages: next })
                            }}
                          />
                          <Select
                            value={lang.level}
                            onValueChange={(v) => {
                              const next = [...formData.languages]
                              next[idx] = { ...lang, level: v as Language['level'] }
                              setFormData({ ...formData, languages: next })
                            }}
                            disabled={!isEditing}
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(LANGUAGE_LEVELS).map(([k, label]) => (
                                <SelectItem key={k} value={k}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isEditing && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setFormData((p) => ({
                                  ...p,
                                  languages: p.languages.filter((_, i) => i !== idx),
                                }))
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Навыки</Label>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {formData.skills.map((s) => (
                        <Badge key={s} variant="secondary" className="gap-1">
                          {s}
                          {isEditing && (
                            <button
                              type="button"
                              className="ml-1 rounded hover:text-destructive"
                              onClick={() =>
                                setFormData((p) => ({ ...p, skills: p.skills.filter((x) => x !== s) }))
                              }
                            >
                              ×
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Навык и Enter"
                          value={skillDraft}
                          onChange={(e) => setSkillDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addSkill()
                            }
                          }}
                        />
                        <Button type="button" variant="secondary" onClick={addSkill}>
                          Добавить
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      Водительское удостоверение
                    </Label>
                    <div className="flex flex-wrap gap-3">
                      {DL_OPTIONS.map((code) => (
                        <label key={code} className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={formData.drivingLicense.includes(code)}
                            disabled={!isEditing}
                            onCheckedChange={() => isEditing && toggleDl(code)}
                          />
                          {code}
                        </label>
                      ))}
                    </div>
                    <div className="space-y-2 max-w-xs">
                      <Label htmlFor="drivingExp">Стаж вождения (лет)</Label>
                      <Input
                        id="drivingExp"
                        type="number"
                        min={0}
                        value={formData.drivingExperience || ''}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setFormData({ ...formData, drivingExperience: Number(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
