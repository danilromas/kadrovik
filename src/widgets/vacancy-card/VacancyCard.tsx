import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { MapPin, Building2, Heart } from 'lucide-react'
import type { Vacancy } from '@/shared/types'
import { formatSalary } from '@/shared/lib/utils'

interface VacancyCardProps {
  vacancy: Vacancy
  showFavorite?: boolean
  onToggleFavorite?: (id: string) => void
  isFavorite?: boolean
}

export function VacancyCard({ vacancy, showFavorite, onToggleFavorite, isFavorite }: VacancyCardProps) {
  const company = vacancy.company
  return (
    <Card className="hover:border-primary/40 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link to={`/vacancies/${vacancy.id}`} className="font-semibold text-foreground hover:text-primary line-clamp-1">
              {vacancy.title}
            </Link>
            <Link
              to={`/companies/${company?.id ?? vacancy.companyId}`}
              className="mt-1 flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
            >
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{company?.name ?? 'Компания'}</span>
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {vacancy.city}
              </span>
              {vacancy.isHot && <Badge variant="destructive">Hot</Badge>}
            </div>
            <p className="mt-2 text-sm font-medium text-primary">
              {formatSalary(vacancy.salaryMin, vacancy.salaryMax, vacancy.currency)}
            </p>
          </div>
          {showFavorite && onToggleFavorite && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => onToggleFavorite(vacancy.id)}
              aria-label="В избранное"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
