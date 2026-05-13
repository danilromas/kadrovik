import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { mockCandidates } from '@/shared/mocks/users'
import { mockResumes } from '@/shared/mocks/resumes'
import { useEmployerFavoritesStore } from '@/features/favorites/store/employerFavoritesStore'
import { getInitials } from '@/shared/lib/utils'

export function EmployerFavoritesPage() {
  const { candidateIds, toggleCandidate } = useEmployerFavoritesStore()
  const favorites = mockCandidates.filter((c) => candidateIds.includes(c.id))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Избранные кандидаты</h1>
        <p className="text-muted-foreground">Список сохраняется в браузере (демо)</p>
      </div>

      {favorites.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <Heart className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>Пока никого нет. Добавьте кандидатов со страницы «Поиск кандидатов».</p>
            <Button className="mt-4" asChild variant="outline">
              <Link to="/employer/candidates">Перейти к поиску</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {favorites.map((c) => {
            const resume = mockResumes.find((r) => r.userId === c.id)
            return (
              <Card key={c.id}>
                <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-12">
                      <AvatarImage src={c.avatar} />
                      <AvatarFallback>{getInitials(c.firstName, c.lastName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {c.firstName} {c.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{c.city}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {c.skills.slice(0, 4).map((s) => (
                          <Badge key={s} variant="outline" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {resume && (
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/resumes/${resume.id}`}>Резюме</Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => toggleCandidate(c.id)}>
                      Убрать
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
