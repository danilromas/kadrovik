const STORAGE_KEY = 'kadrovik-ai-daily-v1'
const DAILY_LIMIT = 20

interface DailyRecord {
  date: string
  count: number
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function read(): DailyRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { date: todayKey(), count: 0 }
    const parsed = JSON.parse(raw) as DailyRecord
    if (parsed.date !== todayKey()) return { date: todayKey(), count: 0 }
    return parsed
  } catch {
    return { date: todayKey(), count: 0 }
  }
}

function write(record: DailyRecord) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
}

export function getAiRemainingToday(): number {
  return Math.max(0, DAILY_LIMIT - read().count)
}

export function canSendAiMessage(): boolean {
  return getAiRemainingToday() > 0
}

export function incrementAiUsage(): void {
  const r = read()
  write({ date: todayKey(), count: r.count + 1 })
}

export const AI_DAILY_LIMIT = DAILY_LIMIT
