import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSalary(min?: number, max?: number, currency = 'RUB'): string {
  const formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  })
  
  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)}`
  }
  if (min) {
    return `от ${formatter.format(min)}`
  }
  if (max) {
    return `до ${formatter.format(max)}`
  }
  return 'По договорённости'
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeDate(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diffInMs = now.getTime() - then.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Сегодня'
  if (diffInDays === 1) return 'Вчера'
  if (diffInDays < 7) return `${diffInDays} дней назад`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} недель назад`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} месяцев назад`
  return formatDate(date)
}

/** Алиас для страниц вакансий (относительное время публикации) */
export function formatDistanceToNow(date: string | Date): string {
  return formatRelativeDate(date)
}

/** Значение для сопоставления с `EXPERIENCE_LEVELS` и `vacancy.experienceYears` */
export function getExperienceFilterValue(years: number): 'none' | '1-3' | '3-5' | '5+' {
  if (years <= 0) return 'none'
  if (years < 3) return '1-3'
  if (years < 5) return '3-5'
  return '5+'
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function getExperienceLabel(years: number): string {
  if (years === 0) return 'Без опыта'
  if (years === 1) return '1 год'
  if (years >= 2 && years <= 4) return `${years} года`
  return `${years} лет`
}

export function getMatchPercentage(candidateSkills: string[], requiredSkills: string[]): number {
  if (requiredSkills.length === 0) return 100
  const matched = candidateSkills.filter(skill => 
    requiredSkills.some(req => req.toLowerCase() === skill.toLowerCase())
  ).length
  return Math.round((matched / requiredSkills.length) * 100)
}
