import type { Vacancy } from '@/shared/types'
import { mockCompanies } from './companies'

export const mockVacancies: Vacancy[] = [
  {
    id: 'vacancy-1',
    companyId: 'company-1',
    company: mockCompanies[0],
    title: 'Senior Frontend Developer',
    description: `Мы ищем опытного Frontend-разработчика для работы над нашими флагманскими продуктами.

**Обязанности:**
- Разработка пользовательских интерфейсов на React/TypeScript
- Код-ревью и менторинг junior-разработчиков
- Участие в архитектурных решениях
- Оптимизация производительности приложений

**Требования:**
- Опыт работы с React от 3 лет
- Отличное знание TypeScript
- Опыт работы с современными инструментами (Vite, Webpack)
- Понимание принципов UX/UI

**Будет плюсом:**
- Опыт с Next.js
- Знание тестирования (Jest, Cypress)
- Опыт работы с GraphQL`,
    profession: 'Разработка',
    specialization: 'Frontend',
    salaryMin: 250000,
    salaryMax: 350000,
    currency: 'RUB',
    skills: [
      { name: 'React', level: 'expert' },
      { name: 'TypeScript', level: 'advanced' },
      { name: 'JavaScript', level: 'expert' },
      { name: 'CSS', level: 'advanced' },
    ],
    experienceYears: 3,
    employmentType: ['full-time'],
    schedule: 'full-day',
    workHours: '10:00 - 19:00',
    workFormat: ['hybrid', 'remote'],
    location: 'БЦ Белая Площадь',
    city: 'Москва',
    status: 'published',
    views: 1250,
    applicationsCount: 45,
    publishedAt: '2024-03-15T10:00:00Z',
    createdAt: '2024-03-14T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    isHot: true,
  },
  {
    id: 'vacancy-2',
    companyId: 'company-1',
    company: mockCompanies[0],
    title: 'Backend Developer (Node.js)',
    description: `Ищем Backend-разработчика для развития нашей микросервисной архитектуры.

**Обязанности:**
- Разработка и поддержка REST API
- Проектирование баз данных
- Работа с очередями сообщений
- Написание документации

**Требования:**
- Опыт работы с Node.js от 2 лет
- Знание PostgreSQL, Redis
- Понимание принципов микросервисной архитектуры
- Опыт работы с Docker`,
    profession: 'Разработка',
    specialization: 'Backend',
    salaryMin: 200000,
    salaryMax: 300000,
    currency: 'RUB',
    skills: [
      { name: 'Node.js', level: 'advanced' },
      { name: 'PostgreSQL', level: 'advanced' },
      { name: 'Docker', level: 'intermediate' },
      { name: 'TypeScript', level: 'advanced' },
    ],
    experienceYears: 2,
    employmentType: ['full-time'],
    schedule: 'flexible',
    workFormat: ['remote'],
    city: 'Москва',
    status: 'published',
    views: 890,
    applicationsCount: 32,
    publishedAt: '2024-03-10T10:00:00Z',
    createdAt: '2024-03-09T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
  },
  {
    id: 'vacancy-3',
    companyId: 'company-2',
    company: mockCompanies[1],
    title: 'UI/UX Designer',
    description: `Креативное агентство ищет талантливого дизайнера для работы над digital-проектами.

**Обязанности:**
- Создание дизайн-концепций
- Проектирование пользовательских интерфейсов
- Создание прототипов
- Работа с дизайн-системами

**Требования:**
- Портфолио с примерами работ
- Опыт работы с Figma
- Понимание UX-принципов
- Навыки анимации`,
    profession: 'Дизайн',
    specialization: 'UI/UX',
    salaryMin: 150000,
    salaryMax: 220000,
    currency: 'RUB',
    skills: [
      { name: 'Figma', level: 'expert' },
      { name: 'UI/UX', level: 'advanced' },
      { name: 'Prototyping', level: 'advanced' },
    ],
    experienceYears: 2,
    employmentType: ['full-time'],
    schedule: 'full-day',
    workFormat: ['office', 'hybrid'],
    location: 'Арт-квартал',
    city: 'Москва',
    status: 'published',
    views: 567,
    applicationsCount: 23,
    publishedAt: '2024-03-12T10:00:00Z',
    createdAt: '2024-03-11T10:00:00Z',
    updatedAt: '2024-03-12T10:00:00Z',
  },
  {
    id: 'vacancy-4',
    companyId: 'company-3',
    company: mockCompanies[2],
    title: 'Data Analyst',
    description: `Ищем аналитика данных для работы над финансовыми продуктами.

**Обязанности:**
- Анализ больших данных
- Создание дашбордов и отчетов
- A/B тестирование
- Работа с product-командой`,
    profession: 'Аналитика',
    specialization: 'Data Analyst',
    salaryMin: 180000,
    salaryMax: 260000,
    currency: 'RUB',
    skills: [
      { name: 'SQL', level: 'expert' },
      { name: 'Python', level: 'advanced' },
      { name: 'Tableau', level: 'intermediate' },
    ],
    experienceYears: 2,
    employmentType: ['full-time'],
    schedule: 'full-day',
    workFormat: ['hybrid'],
    city: 'Москва',
    status: 'published',
    views: 445,
    applicationsCount: 18,
    publishedAt: '2024-03-08T10:00:00Z',
    createdAt: '2024-03-07T10:00:00Z',
    updatedAt: '2024-03-08T10:00:00Z',
  },
  {
    id: 'vacancy-5',
    companyId: 'company-4',
    company: mockCompanies[3],
    title: 'Junior Python Developer',
    description: `Стартап ищет начинающего Python-разработчика. Отличная возможность для старта карьеры!

**Обязанности:**
- Разработка backend-части образовательной платформы
- Написание автотестов
- Участие в code-review`,
    profession: 'Разработка',
    specialization: 'Backend',
    salaryMin: 80000,
    salaryMax: 120000,
    currency: 'RUB',
    skills: [
      { name: 'Python', level: 'beginner' },
      { name: 'Git', level: 'beginner' },
    ],
    experienceYears: 0,
    employmentType: ['full-time', 'internship'],
    schedule: 'flexible',
    workFormat: ['remote'],
    city: 'Москва',
    status: 'published',
    views: 1890,
    applicationsCount: 156,
    publishedAt: '2024-03-18T10:00:00Z',
    createdAt: '2024-03-17T10:00:00Z',
    updatedAt: '2024-03-18T10:00:00Z',
  },
  {
    id: 'vacancy-6',
    companyId: 'company-5',
    company: mockCompanies[4],
    title: 'Product Manager',
    description: `Крупный маркетплейс ищет Product Manager для развития мобильного приложения.

**Обязанности:**
- Управление продуктовым бэклогом
- Анализ метрик и конкурентов
- Работа с командой разработки
- Проведение A/B тестов`,
    profession: 'Менеджмент',
    specialization: 'Product',
    salaryMin: 300000,
    salaryMax: 450000,
    currency: 'RUB',
    skills: [
      { name: 'Product Management', level: 'expert' },
      { name: 'Analytics', level: 'advanced' },
      { name: 'SQL', level: 'intermediate' },
    ],
    experienceYears: 5,
    employmentType: ['full-time'],
    schedule: 'full-day',
    workFormat: ['office'],
    location: 'Головной офис',
    city: 'Москва',
    status: 'published',
    views: 678,
    applicationsCount: 28,
    publishedAt: '2024-03-05T10:00:00Z',
    createdAt: '2024-03-04T10:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z',
  },
  {
    id: 'vacancy-7',
    companyId: 'company-6',
    company: mockCompanies[5],
    title: 'Unity Developer',
    description: `Игровая студия ищет Unity-разработчика для работы над новым проектом.

**Обязанности:**
- Разработка геймплейных механик
- Оптимизация производительности
- Работа с 3D-графикой`,
    profession: 'Разработка',
    specialization: 'Game Development',
    salaryMin: 180000,
    salaryMax: 280000,
    currency: 'RUB',
    skills: [
      { name: 'Unity', level: 'advanced' },
      { name: 'C#', level: 'advanced' },
      { name: '3D', level: 'intermediate' },
    ],
    experienceYears: 2,
    employmentType: ['full-time'],
    schedule: 'flexible',
    workFormat: ['office', 'hybrid'],
    city: 'Санкт-Петербург',
    status: 'published',
    views: 345,
    applicationsCount: 15,
    publishedAt: '2024-03-16T10:00:00Z',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-16T10:00:00Z',
  },
  {
    id: 'vacancy-8',
    companyId: 'company-1',
    company: mockCompanies[0],
    title: 'DevOps Engineer',
    description: `TechCorp ищет DevOps-инженера для автоматизации процессов разработки.

**Обязанности:**
- Настройка CI/CD пайплайнов
- Управление Kubernetes кластерами
- Мониторинг и алертинг
- Инфраструктура как код`,
    profession: 'Разработка',
    specialization: 'DevOps',
    salaryMin: 280000,
    salaryMax: 400000,
    currency: 'RUB',
    skills: [
      { name: 'Kubernetes', level: 'expert' },
      { name: 'Docker', level: 'expert' },
      { name: 'AWS', level: 'advanced' },
      { name: 'Terraform', level: 'advanced' },
    ],
    experienceYears: 4,
    employmentType: ['full-time'],
    schedule: 'flexible',
    workFormat: ['remote', 'hybrid'],
    city: 'Москва',
    status: 'published',
    views: 567,
    applicationsCount: 21,
    publishedAt: '2024-03-17T10:00:00Z',
    createdAt: '2024-03-16T10:00:00Z',
    updatedAt: '2024-03-17T10:00:00Z',
  },
]
