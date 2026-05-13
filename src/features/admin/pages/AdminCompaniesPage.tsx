import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { mockApi } from '@/shared/api/mockApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Label } from '@/shared/ui/label'
import { Switch } from '@/shared/ui/switch'
import { toast } from 'sonner'

export function AdminCompaniesPage() {
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['admin-companies'],
    queryFn: () => mockApi.getCompanies(),
  })

  const [premiumMap, setPremiumMap] = useState<Record<string, boolean>>({})

  const isPremium = (id: string, initial: boolean) => premiumMap[id] ?? initial

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Компании</h1>
        <p className="text-muted-foreground">Верификация, premium-флаг (демо)</p>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Загрузка…</p>
      ) : (
        <div className="space-y-2">
          {companies.map((c) => (
            <Card key={c.id}>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-base font-medium">{c.name}</CardTitle>
                  {c.isVerified && <Badge variant="secondary">Верифицирована</Badge>}
                  {isPremium(c.id, c.isPremium) && <Badge>Premium</Badge>}
                </div>
                <Button size="sm" variant="outline" onClick={() => toast.success('Верификация отмечена (демо)')}>
                  Верифицировать
                </Button>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pb-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                <span className="text-muted-foreground">{c.industry}</span>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`prem-${c.id}`} className="text-xs text-muted-foreground">
                      Premium
                    </Label>
                    <Switch
                      id={`prem-${c.id}`}
                      checked={isPremium(c.id, c.isPremium)}
                      onCheckedChange={(v) => {
                        setPremiumMap((m) => ({ ...m, [c.id]: v }))
                        toast.success(v ? 'Premium включён (демо)' : 'Premium выключен (демо)')
                      }}
                    />
                  </div>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <Link to={`/companies/${c.id}`}>На сайте</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
