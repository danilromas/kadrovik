import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Building2, Globe, MapPin, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { mockApi } from '@/shared/api/mockApi'
import { useAuthStore } from '@/features/auth/store/authStore'
import type { Company } from '@/shared/types'

export function EmployerCompanyPage() {
  const { user } = useAuthStore()
  const companyId =
    user && (user.role === 'employer' || user.role === 'recruiter') && 'companyId' in user && user.companyId
      ? user.companyId
      : 'company-1'

  const { data: company, isLoading } = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => mockApi.getCompanyById(companyId),
  })

  const [form, setForm] = useState<Partial<Company>>({})

  useEffect(() => {
    if (company) {
      setForm({
        name: company.name,
        description: company.description,
        website: company.website,
        industry: company.industry,
        cities: [...company.cities],
      })
    }
  }, [company])

  const handleSave = () => {
    toast.success('Изменения сохранены (демо)', { description: 'Backend не подключён' })
  }

  if (isLoading || !company) {
    return <p className="text-muted-foreground">Загрузка…</p>
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Компания</h1>
        <p className="text-muted-foreground">Карточка организации (редактирование — демо)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Основное
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {company.logo && (
              <img src={company.logo} alt="" className="h-16 w-16 rounded-xl object-cover border" />
            )}
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span>{company.rating}</span>
                <span>· {company.reviewsCount} отзывов</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {company.cities.join(', ')}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Название</Label>
            <Input value={form.name ?? ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Отрасль</Label>
            <Input
              value={form.industry ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Сайт</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                value={form.website ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Города (через запятую)</Label>
            <Input
              value={(form.cities ?? []).join(', ')}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  cities: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Описание</Label>
            <Textarea
              rows={6}
              value={form.description ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <Button type="button" onClick={handleSave}>
            Сохранить
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
