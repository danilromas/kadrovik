// User & Auth Types
export type UserRole = 'guest' | 'candidate' | 'employer' | 'recruiter' | 'moderator' | 'admin'

export interface User {
  id: string
  email: string
  role: UserRole
  firstName: string
  lastName: string
  middleName?: string
  avatar?: string
  phone?: string
  /** Доп. телефон (ТЗ C.1 — несколько телефонов) */
  secondPhone?: string
  city?: string
  about?: string
  createdAt: string
  lastLoginAt: string
  isVerified: boolean
  isBlocked: boolean
}

export interface CandidateProfile extends User {
  role: 'candidate'
  gender?: 'male' | 'female'
  birthDate?: string
  citizenship?: string
  city: string
  searchCities: string[]
  education: Education[]
  languages: Language[]
  skills: string[]
  drivingLicense?: string[]
  drivingExperience?: number
}

export interface EmployerProfile extends User {
  role: 'employer' | 'recruiter'
  companyId: string
  position?: string
}

/** Поля, разрешённые для обновления из формы «Профиль» (mock, без смены id/роли) */
export type ProfileUpdatePayload = Partial<
  Omit<User, 'id' | 'role' | 'createdAt' | 'lastLoginAt' | 'isVerified' | 'isBlocked'>
> &
  Partial<
    Pick<
      CandidateProfile,
      | 'gender'
      | 'birthDate'
      | 'citizenship'
      | 'searchCities'
      | 'education'
      | 'languages'
      | 'skills'
      | 'drivingLicense'
      | 'drivingExperience'
    >
  > &
  Partial<Pick<EmployerProfile, 'position'>>

// Resume Types
export interface Resume {
  id: string
  userId: string
  title: string
  profession: string
  specialization: string
  desiredSalary?: number
  currency: Currency
  employmentType: EmploymentType[]
  workFormat: WorkFormat[]
  skills: SkillLevel[]
  experience: WorkExperience[]
  education: Education[]
  /** Языки владения (каталог / фильтры P.1) */
  languages?: Language[]
  portfolio?: PortfolioItem[]
  links?: string[]
  about?: string
  pdfUrl?: string
  isPublished: boolean
  views: number
  createdAt: string
  updatedAt: string
  /** Демо: статус карточки в списке резюме */
  status?: 'draft' | 'published' | 'archived'
  /** Демо: основное резюме */
  isMain?: boolean
}

export interface SkillLevel {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  description?: string
  achievements?: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startYear: number
  endYear?: number
  isCurrent: boolean
}

export interface Language {
  name: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native'
}

export interface PortfolioItem {
  id: string
  title: string
  url: string
  description?: string
  imageUrl?: string
}

// Company Types
export interface Company {
  id: string
  name: string
  logo?: string
  description?: string
  website?: string
  industry: string
  size: CompanySize
  cities: string[]
  rating: number
  reviewsCount: number
  vacanciesCount: number
  isVerified: boolean
  isPremium: boolean
  createdAt: string
  /** Доп. поля для страниц компании (демо) */
  foundedYear?: number
  address?: string
  email?: string
  phone?: string
  benefits?: string[]
}

export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise'

// Vacancy Types
export interface Vacancy {
  id: string
  companyId: string
  company?: Company
  title: string
  description: string
  profession: string
  specialization: string
  salaryMin?: number
  salaryMax?: number
  currency: Currency
  skills: SkillLevel[]
  experienceYears: number
  employmentType: EmploymentType[]
  schedule: WorkSchedule
  workHours?: string
  workFormat: WorkFormat[]
  location?: string
  city: string
  status: VacancyStatus
  views: number
  applicationsCount: number
  publishedAt?: string
  createdAt: string
  updatedAt: string
  /** Маркеры для демо-UI (списки вакансий) */
  isHot?: boolean
  isUrgent?: boolean
}

export type Currency = 'RUB' | 'USD' | 'EUR' | 'KZT' | 'BYN' | 'UAH'
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance'
export type WorkFormat = 'office' | 'remote' | 'hybrid'
export type WorkSchedule = 'full-day' | 'shift' | 'flexible' | 'remote'
export type VacancyStatus = 'draft' | 'published' | 'paused' | 'closed'

// Application Types
export interface Application {
  id: string
  vacancyId: string
  vacancy?: Vacancy
  candidateId: string
  candidate?: CandidateProfile
  resumeId: string
  resume?: Resume
  coverLetter?: string
  status: ApplicationStatus
  pipelineStage: PipelineStage
  assignedTo?: string
  assignedRecruiter?: User
  notes: ApplicationNote[]
  timeline: TimelineEvent[]
  createdAt: string
  updatedAt: string
  interviewDate?: string
  rejectionReason?: string
}

export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected'
export type PipelineStage = 'new' | 'viewed' | 'screening' | 'interview' | 'test' | 'offer' | 'hired' | 'rejected'

export interface ApplicationNote {
  id: string
  authorId: string
  author?: User
  content: string
  createdAt: string
}

export interface TimelineEvent {
  id: string
  type: 'status_change' | 'stage_change' | 'note_added' | 'message_sent' | 'interview_scheduled'
  description: string
  userId?: string
  user?: User
  createdAt: string
}

// Chat Types
export interface Chat {
  id: string
  participants: string[]
  participantProfiles?: User[]
  lastMessage?: Message
  unreadCount: number
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  sender?: User
  content: string
  attachments?: Attachment[]
  isRead: boolean
  createdAt: string
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: 'file' | 'image'
  size: number
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  link?: string
  isRead: boolean
  createdAt: string
}

export type NotificationType = 
  | 'new_application'
  | 'invitation'
  | 'status_change'
  | 'message'
  | 'moderation'
  | 'system'
  | 'recommendation'

// Filter Types
export interface VacancyFilters {
  search?: string
  profession?: string
  specialization?: string
  skills?: string[]
  salaryMin?: number
  salaryMax?: number
  experienceMin?: number
  experienceMax?: number
  employmentType?: EmploymentType[]
  workFormat?: WorkFormat[]
  city?: string
  companyId?: string
}

export interface ResumeFilters {
  search?: string
  skills?: string[]
  experienceMin?: number
  experienceMax?: number
  education?: string
  languages?: string[]
  city?: string
  specialization?: string
}

// Analytics Types
export interface VacancyAnalytics {
  vacancyId: string
  views: number
  applications: number
  conversionRate: number
  viewsByDay: { date: string; count: number }[]
  applicationsByDay: { date: string; count: number }[]
  pipelineStats: { stage: PipelineStage; count: number }[]
}

export interface PlatformAnalytics {
  totalUsers: number
  totalVacancies: number
  totalResumes: number
  totalApplications: number
  usersByRole: { role: UserRole; count: number }[]
  registrationsByDay: { date: string; count: number }[]
  activeVacanciesByCategory: { category: string; count: number }[]
}

// Geography Types
export interface Country {
  id: string
  name: string
  code: string
}

export interface Region {
  id: string
  countryId: string
  name: string
}

export interface City {
  id: string
  regionId: string
  name: string
}
