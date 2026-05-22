import type { AiPageContext, AiUserRole } from './types'

const BASE = `Ты — ИИ-помощник платформы «КАДРОВИК», сервис поиска работы в Крыму (Республика Крым и Севастополь).
Отвечай на русском, кратко и по делу. Города: Симферополь, Севастополь, Ялта, Евпатория, Керчь, Феодосия и др.
Не выдумывай конкретные вакансии с ID — предлагай действия на сайте (фильтры, резюме, отклик).`

const ROLE_HINTS: Record<AiUserRole, string> = {
  guest: 'Пользователь не авторизован. Помогай с поиском вакансий, регистрацией, обзором рынка Крыма.',
  candidate:
    'Пользователь — соискатель. Помогай с резюме, откликами, сопроводительными письмами, подготовкой к собеседованию, выбором вакансий в Крыму.',
  employer:
    'Пользователь — работодатель. Помогай составлять описания вакансий, вопросы для интервью, критерии отбора, привлекательные условия для крымского рынка.',
  admin: 'Пользователь — администратор платформы. Помогай с модерацией, настройками и типовыми сценариями HR-платформы.',
}

export function buildSystemPrompt(role: AiUserRole, context: AiPageContext | null): string {
  let prompt = `${BASE}\n\n${ROLE_HINTS[role]}`
  if (context) {
    prompt += `\n\nКонтекст страницы (${context.page}): ${context.summary}`
    if (context.data && Object.keys(context.data).length > 0) {
      const lines = Object.entries(context.data)
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => `- ${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
      if (lines.length) prompt += `\n${lines.join('\n')}`
    }
  }
  return prompt
}

export function getSuggestedPrompts(role: AiUserRole, context: AiPageContext | null): string[] {
  if (context?.page === 'vacancy') {
    return [
      'Подхожу ли я на эту вакансию?',
      'Что спросить у работодателя?',
      'Помоги с сопроводительным письмом',
    ]
  }
  if (context?.page === 'vacancy-form') {
    return [
      'Сгенерируй описание вакансии',
      'Какие требования указать?',
      'Как указать зарплату в Крыму?',
    ]
  }
  if (context?.page === 'resume-form') {
    return [
      'Улучши блок «О себе»',
      'Какие навыки добавить?',
      'Советы для резюме в Крыму',
    ]
  }

  switch (role) {
    case 'employer':
      return [
        'Составь текст вакансии для Симферополя',
        'Вопросы для собеседования',
        'Как привлечь кандидатов в Крыму?',
      ]
    case 'candidate':
      return [
        'Найди удалёнку в Севастополе',
        'Как улучшить резюме?',
        'Подготовка к собеседованию',
      ]
    default:
      return [
        'Где искать работу в Ялте?',
        'Как создать резюме?',
        'Популярные профессии в Крыму',
      ]
  }
}
