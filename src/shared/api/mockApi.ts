import type { Vacancy, Application, Company, Resume, User } from '@/shared/types'
import { mockVacancies } from '@/shared/mocks/vacancies'
import { mockApplications } from '@/shared/mocks/applications'
import { mockCompanies } from '@/shared/mocks/companies'
import { mockResumes } from '@/shared/mocks/resumes'
import { mockUsers } from '@/shared/mocks/users'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

export const mockApi = {
  async getVacancies(): Promise<Vacancy[]> {
    await delay(300)
    return [...mockVacancies]
  },

  async getVacanciesByCompany(companyId: string): Promise<Vacancy[]> {
    await delay(250)
    return mockVacancies.filter((v) => v.companyId === companyId || v.company?.id === companyId)
  },

  async getVacancyById(id: string): Promise<Vacancy | null> {
    await delay(200)
    return mockVacancies.find((v) => v.id === id) ?? null
  },

  async getApplications(): Promise<Application[]> {
    await delay(350)
    return [...mockApplications]
  },

  async getCompanies(): Promise<Company[]> {
    await delay(280)
    return [...mockCompanies]
  },

  async getCompanyById(id: string): Promise<Company | null> {
    await delay(200)
    return mockCompanies.find((c) => c.id === id) ?? null
  },

  async getResumes(): Promise<Resume[]> {
    await delay(300)
    return [...mockResumes]
  },

  async getResumeById(id: string): Promise<Resume | null> {
    await delay(200)
    return mockResumes.find((r) => r.id === id) ?? null
  },

  async getUsers(): Promise<User[]> {
    await delay(320)
    return mockUsers.map((u) => {
      const { role, id, email, firstName, lastName, createdAt, lastLoginAt, isVerified, isBlocked } = u
      return {
        id,
        email,
        firstName,
        lastName,
        role,
        createdAt,
        lastLoginAt,
        isVerified,
        isBlocked,
      } as User
    })
  },
}
