import type { Application, PipelineStage } from '@/shared/types'
import { mockVacancies } from './vacancies'
import { mockResumes } from './resumes'
import { mockCandidates } from './users'

export const mockApplications: Application[] = [
  {
    id: 'app-1',
    vacancyId: 'vacancy-1',
    vacancy: mockVacancies[0],
    candidateId: 'user-1',
    candidate: mockCandidates[0],
    resumeId: 'resume-1',
    resume: mockResumes[0],
    coverLetter: 'Добрый день! Меня очень заинтересовала ваша вакансия. У меня есть 6 лет опыта работы с React и TypeScript...',
    status: 'reviewed',
    pipelineStage: 'interview',
    assignedTo: 'user-3',
    notes: [
      {
        id: 'note-1',
        authorId: 'user-3',
        content: 'Отличный кандидат, хорошее портфолио. Назначить техническое интервью.',
        createdAt: '2024-03-18T14:00:00Z',
      },
    ],
    timeline: [
      {
        id: 'event-1',
        type: 'status_change',
        description: 'Заявка создана',
        createdAt: '2024-03-16T10:00:00Z',
      },
      {
        id: 'event-2',
        type: 'stage_change',
        description: 'Переведён на этап "Просмотрен"',
        userId: 'user-3',
        createdAt: '2024-03-17T11:00:00Z',
      },
      {
        id: 'event-3',
        type: 'note_added',
        description: 'Добавлен комментарий',
        userId: 'user-3',
        createdAt: '2024-03-18T14:00:00Z',
      },
      {
        id: 'event-4',
        type: 'stage_change',
        description: 'Переведён на этап "Интервью"',
        userId: 'user-3',
        createdAt: '2024-03-18T14:30:00Z',
      },
    ],
    createdAt: '2024-03-16T10:00:00Z',
    updatedAt: '2024-03-18T14:30:00Z',
    interviewDate: '2024-03-25T14:00:00Z',
  },
  {
    id: 'app-2',
    vacancyId: 'vacancy-1',
    vacancy: mockVacancies[0],
    candidateId: 'candidate-2',
    candidate: mockCandidates[1],
    resumeId: 'resume-2',
    resume: mockResumes[1],
    status: 'pending',
    pipelineStage: 'new',
    notes: [],
    timeline: [
      {
        id: 'event-5',
        type: 'status_change',
        description: 'Заявка создана',
        createdAt: '2024-03-19T09:00:00Z',
      },
    ],
    createdAt: '2024-03-19T09:00:00Z',
    updatedAt: '2024-03-19T09:00:00Z',
  },
  {
    id: 'app-3',
    vacancyId: 'vacancy-3',
    vacancy: mockVacancies[2],
    candidateId: 'candidate-3',
    candidate: mockCandidates[2],
    resumeId: 'resume-3',
    resume: mockResumes[2],
    coverLetter: 'Здравствуйте! Я дизайнер с 3-летним опытом работы в digital-агентствах...',
    status: 'reviewed',
    pipelineStage: 'test',
    assignedTo: 'user-2',
    notes: [
      {
        id: 'note-2',
        authorId: 'user-2',
        content: 'Сильное портфолио. Отправить тестовое задание на дизайн лендинга.',
        createdAt: '2024-03-15T10:00:00Z',
      },
    ],
    timeline: [
      {
        id: 'event-6',
        type: 'status_change',
        description: 'Заявка создана',
        createdAt: '2024-03-13T10:00:00Z',
      },
      {
        id: 'event-7',
        type: 'stage_change',
        description: 'Переведён на этап "Тестовое задание"',
        userId: 'user-2',
        createdAt: '2024-03-15T10:30:00Z',
      },
    ],
    createdAt: '2024-03-13T10:00:00Z',
    updatedAt: '2024-03-15T10:30:00Z',
  },
  {
    id: 'app-4',
    vacancyId: 'vacancy-2',
    vacancy: mockVacancies[1],
    candidateId: 'candidate-2',
    candidate: mockCandidates[1],
    resumeId: 'resume-2',
    resume: mockResumes[1],
    status: 'accepted',
    pipelineStage: 'offer',
    assignedTo: 'user-3',
    notes: [
      {
        id: 'note-3',
        authorId: 'user-3',
        content: 'Отличное техническое интервью. Готовим оффер.',
        createdAt: '2024-03-10T16:00:00Z',
      },
    ],
    timeline: [
      {
        id: 'event-8',
        type: 'status_change',
        description: 'Заявка создана',
        createdAt: '2024-03-01T10:00:00Z',
      },
      {
        id: 'event-9',
        type: 'stage_change',
        description: 'Переведён на этап "Оффер"',
        userId: 'user-3',
        createdAt: '2024-03-10T16:00:00Z',
      },
    ],
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-10T16:00:00Z',
  },
]

// Pipeline data grouped by stage
export const getApplicationsByStage = (vacancyId?: string): Record<PipelineStage, Application[]> => {
  const apps = vacancyId 
    ? mockApplications.filter(a => a.vacancyId === vacancyId)
    : mockApplications

  return {
    new: apps.filter(a => a.pipelineStage === 'new'),
    viewed: apps.filter(a => a.pipelineStage === 'viewed'),
    screening: apps.filter(a => a.pipelineStage === 'screening'),
    interview: apps.filter(a => a.pipelineStage === 'interview'),
    test: apps.filter(a => a.pipelineStage === 'test'),
    offer: apps.filter(a => a.pipelineStage === 'offer'),
    hired: apps.filter(a => a.pipelineStage === 'hired'),
    rejected: apps.filter(a => a.pipelineStage === 'rejected'),
  }
}
