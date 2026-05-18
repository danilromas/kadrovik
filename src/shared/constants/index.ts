import type { 
  EmploymentType, 
  WorkFormat, 
  WorkSchedule, 
  PipelineStage, 
  CompanySize,
  Currency,
  ApplicationStatus,
  VacancyStatus,
  UserRole
} from '@/shared/types'

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  'full-time': 'Полная занятость',
  'part-time': 'Частичная занятость',
  'contract': 'Контракт',
  'internship': 'Стажировка',
  'freelance': 'Фриланс',
}

/** Варианты для фильтров и селектов (value совпадает с `EmploymentType`) */
export const EMPLOYMENT_TYPES = (Object.entries(EMPLOYMENT_TYPE_LABELS) as [EmploymentType, string][]).map(
  ([value, label]) => ({ value, label })
)

export const WORK_FORMATS: Record<WorkFormat, string> = {
  office: 'В офисе',
  remote: 'Удалённо',
  hybrid: 'Гибрид',
}

export const WORK_SCHEDULES: Record<WorkSchedule, string> = {
  'full-day': 'Полный день',
  shift: 'Сменный график',
  flexible: 'Гибкий график',
  remote: 'Удалённая работа',
}

export const SCHEDULE_TYPES = (Object.entries(WORK_SCHEDULES) as [WorkSchedule, string][]).map(
  ([value, label]) => ({ value, label })
)

export const PIPELINE_STAGES: Record<PipelineStage, { label: string; color: string }> = {
  new: { label: 'Новый', color: 'bg-blue-500' },
  viewed: { label: 'Просмотрен', color: 'bg-sky-500' },
  screening: { label: 'Скрининг', color: 'bg-cyan-500' },
  interview: { label: 'Интервью', color: 'bg-amber-500' },
  test: { label: 'Тестовое', color: 'bg-orange-500' },
  offer: { label: 'Оффер', color: 'bg-emerald-500' },
  hired: { label: 'Принят', color: 'bg-green-600' },
  rejected: { label: 'Отказ', color: 'bg-red-500' },
}

export const COMPANY_SIZE_LABELS: Record<CompanySize, string> = {
  startup: 'Стартап (1-10)',
  small: 'Малый бизнес (11-50)',
  medium: 'Средний бизнес (51-200)',
  large: 'Крупная компания (201-1000)',
  enterprise: 'Корпорация (1000+)',
}

export const COMPANY_SIZES = (Object.entries(COMPANY_SIZE_LABELS) as [CompanySize, string][]).map(
  ([value, label]) => ({ value, label })
)

export const CURRENCIES: Record<Currency, { symbol: string; name: string }> = {
  RUB: { symbol: '₽', name: 'Рубли' },
  USD: { symbol: '$', name: 'Доллары США' },
  EUR: { symbol: '€', name: 'Евро' },
  KZT: { symbol: '₸', name: 'Тенге' },
  BYN: { symbol: 'Br', name: 'Белорусские рубли' },
  UAH: { symbol: '₴', name: 'Гривны' },
}

export const APPLICATION_STATUSES: Record<ApplicationStatus, { label: string; color: string }> = {
  pending: { label: 'На рассмотрении', color: 'bg-yellow-500' },
  reviewed: { label: 'Просмотрено', color: 'bg-blue-500' },
  accepted: { label: 'Принято', color: 'bg-green-500' },
  rejected: { label: 'Отклонено', color: 'bg-red-500' },
}

export const VACANCY_STATUSES: Record<VacancyStatus, { label: string; color: string }> = {
  draft: { label: 'Черновик', color: 'bg-gray-500' },
  published: { label: 'Опубликована', color: 'bg-green-500' },
  paused: { label: 'Приостановлена', color: 'bg-yellow-500' },
  closed: { label: 'Закрыта', color: 'bg-red-500' },
}

export const USER_ROLES: Record<UserRole, string> = {
  guest: 'Гость',
  candidate: 'Соискатель',
  employer: 'Работодатель',
  recruiter: 'Рекрутер',
  moderator: 'Модератор',
  admin: 'Администратор',
}

export const SKILL_LEVELS = {
  beginner: 'Начинающий',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
  expert: 'Эксперт',
}

export const LANGUAGE_LEVELS = {
  A1: 'A1 - Начальный',
  A2: 'A2 - Элементарный',
  B1: 'B1 - Средний',
  B2: 'B2 - Выше среднего',
  C1: 'C1 - Продвинутый',
  C2: 'C2 - Профессиональный',
  native: 'Родной',
}

export const PROFESSIONS = [
  'Разработка',
  'Дизайн',
  'Маркетинг',
  'Продажи',
  'Финансы',
  'HR',
  'Аналитика',
  'Менеджмент',
  'Поддержка',
  'Юриспруденция',
  'Логистика',
  'Производство',
  'Медицина',
  'Образование',
]

const CATEGORY_ICONS = [
  '💻', '🎨', '📣', '🤝', '💰', '👥', '📊', '📋', '🎧', '⚖️', '🚚', '🏭', '🏥', '📚',
]

/** Категории вакансий для главной и фильтров (`value` = `Vacancy.profession`) */
export const CATEGORIES = PROFESSIONS.map((label, i) => ({
  value: label,
  label,
  icon: CATEGORY_ICONS[i] ?? '📁',
}))

/** Уровни опыта для фильтров; `value` согласован с `getExperienceFilterValue` в `@/shared/lib/utils` */
export const EXPERIENCE_LEVELS = [
  { value: 'none', label: 'Без опыта' },
  { value: '1-3', label: '1–3 года' },
  { value: '3-5', label: '3–5 лет' },
  { value: '5+', label: 'Более 5 лет' },
]

export const INDUSTRIES = [
  { value: 'IT / Разработка ПО', label: 'IT / Разработка ПО' },
  { value: 'Маркетинг / Реклама', label: 'Маркетинг / Реклама' },
  { value: 'Финансы / Банки', label: 'Финансы / Банки' },
  { value: 'Образование / EdTech', label: 'Образование / EdTech' },
  { value: 'E-commerce / Ритейл', label: 'E-commerce / Ритейл' },
  { value: 'Игры / Развлечения', label: 'Игры / Развлечения' },
]

export const SPECIALIZATIONS: Record<string, string[]> = {
  'Разработка': [
    'Frontend',
    'Backend',
    'Fullstack',
    'Mobile',
    'DevOps',
    'QA',
    'Data Science',
    'Machine Learning',
    'Embedded',
    'Blockchain',
  ],
  'Дизайн': [
    'UI/UX',
    'Графический дизайн',
    'Motion Design',
    'Веб-дизайн',
    '3D',
    'Иллюстрация',
  ],
  'Маркетинг': [
    'SMM',
    'SEO',
    'Контент',
    'PPC',
    'Email-маркетинг',
    'Brand-менеджмент',
  ],
  'Продажи': [
    'B2B',
    'B2C',
    'Account Management',
    'Business Development',
  ],
  'Финансы': [
    'Бухгалтерия',
    'Финансовый анализ',
    'Аудит',
    'Инвестиции',
  ],
  'HR': [
    'Рекрутинг',
    'HR BP',
    'Кадровое делопроизводство',
    'Обучение и развитие',
  ],
  'Аналитика': [
    'Бизнес-аналитик',
    'Системный аналитик',
    'Продуктовый аналитик',
    'Data Analyst',
  ],
}

export const POPULAR_SKILLS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Vue.js',
  'Angular',
  'Node.js',
  'Python',
  'Java',
  'C#',
  'Go',
  'SQL',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'Kubernetes',
  'AWS',
  'Git',
  'Figma',
  'Photoshop',
  'Excel',
  'Power BI',
  'Tableau',
  '1C',
  'SAP',
]

/** Города Республики Крым и Севастополя */
const CITY_NAMES = [
  'Симферополь',
  'Севастополь',
  'Ялта',
  'Евпатория',
  'Керчь',
  'Феодосия',
  'Алушта',
  'Судак',
  'Бахчисарай',
  'Джанкой',
  'Саки',
  'Красноперекопск',
  'Белогорск',
  'Армянск',
  'Щёлкино',
  'Инкерман',
  'Черноморское',
] as const

/** Список городов для селектов (`value` совпадает с названием в данных) */
export const CITIES = CITY_NAMES.map((name) => ({ value: name, label: name }))

export const EXPERIENCE_OPTIONS = [
  { value: 0, label: 'Без опыта' },
  { value: 1, label: 'От 1 года' },
  { value: 3, label: 'От 3 лет' },
  { value: 5, label: 'От 5 лет' },
  { value: 10, label: 'Более 10 лет' },
]
