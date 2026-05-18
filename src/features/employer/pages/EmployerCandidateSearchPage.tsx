import { useMemo, useState } from 'react'
import { Search, Star } from 'lucide-react'
import { Input } from '@/shared/ui/input'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { mockCandidates } from '@/shared/mocks/users'
import { mockVacancies } from '@/shared/mocks/vacancies'
import { useEmployerFavoritesStore } from '@/features/favorites/store/employerFavoritesStore'
import { getInitials, getMatchPercentage } from '@/shared/lib/utils'

const refVacancy = mockVacancies[0]
const refSkillNames = refVacancy?.skills.map((s) => s.name) ?? ['React', 'TypeScript', 'JavaScript']

export function EmployerCandidateSearchPage() {
  const [q, setQ] = useState('')
  const { candidateIds, toggleCandidate } = useEmployerFavoritesStore()

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const base = !needle
      ? mockCandidates
      : mockCandidates.filter((c) => {
          const skills = c.skills.join(' ').toLowerCase()
          const name = `${c.firstName} ${c.lastName}`.toLowerCase()
          return name.includes(needle) || skills.includes(needle) || c.city.toLowerCase().includes(needle)
        })
    return [...base].sort(
      (a, b) =>
        getMatchPercentage(b.skills, refSkillNames) - getMatchPercentage(a.skills, refSkillNames)
    )
  }, [q])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Поиск кандидатов</h1>
        <p className="text-muted-foreground">
          Демо: поиск по имени, городу и навыкам. Совпадение с требованиями вакансии «{refVacancy?.title ?? '—'}» —{' '}
          <span className="text-foreground font-medium">{refSkillNames.join(', ')}</span>
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-10" placeholder="Например: React или Симферополь" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((c) => {
          const fav = candidateIds.includes(c.id)
          const match = getMatchPercentage(c.skills, refSkillNames)
          return (
            <Card key={c.id}>
              <CardContent className="p-4 flex gap-4">
                <Avatar className="size-14">
                  <AvatarImage src={c.avatar} />
                  <AvatarFallback>{getInitials(c.firstName, c.lastName)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground">
                        {c.firstName} {c.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{c.city}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge variant={match >= 70 ? 'default' : 'secondary'}>{match}% match</Badge>
                      <Button
                        type="button"
                        size="icon"
                        variant={fav ? 'default' : 'outline'}
                        onClick={() => toggleCandidate(c.id)}
                        aria-label={fav ? 'Убрать из избранного' : 'В избранное'}
                      >
                        <Star className={`h-4 w-4 ${fav ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {c.skills.slice(0, 5).map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
