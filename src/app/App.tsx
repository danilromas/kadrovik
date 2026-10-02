import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'

import { PageLoader } from './PageLoader'

// Layouts (eager — оболочки)
import { MainLayout } from './layouts/MainLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { DashboardLayout } from './layouts/DashboardLayout'
import { AdminLayout } from './layouts/AdminLayout'

import { ProtectedRoute } from './guards/ProtectedRoute'
import { RoleGuard } from './guards/RoleGuard'

// Auth (eager — первый экран входа)
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })))
const VacanciesPage = lazy(() => import('@/pages/VacanciesPage').then((m) => ({ default: m.VacanciesPage })))
const VacancyDetailPage = lazy(() => import('@/pages/VacancyDetailPage').then((m) => ({ default: m.VacancyDetailPage })))
const CompaniesPage = lazy(() => import('@/pages/CompaniesPage').then((m) => ({ default: m.CompaniesPage })))
const CompanyDetailPage = lazy(() => import('@/pages/CompanyDetailPage').then((m) => ({ default: m.CompanyDetailPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))
const PublicResumeDetailPage = lazy(() =>
  import('@/pages/PublicResumeDetailPage').then((m) => ({ default: m.PublicResumeDetailPage }))
)

const CandidateDashboard = lazy(() =>
  import('@/features/dashboard/pages/CandidateDashboard').then((m) => ({ default: m.CandidateDashboard }))
)
const EmployerDashboard = lazy(() =>
  import('@/features/dashboard/pages/EmployerDashboard').then((m) => ({ default: m.EmployerDashboard }))
)
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const SettingsPage = lazy(() =>
  import('@/features/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
)
const ResumesPage = lazy(() =>
  import('@/features/resume/pages/ResumesPage').then((m) => ({ default: m.ResumesPage }))
)
const ResumeFormPage = lazy(() =>
  import('@/features/resume/pages/ResumeFormPage').then((m) => ({ default: m.ResumeFormPage }))
)
const ApplicationsPage = lazy(() =>
  import('@/features/applications/pages/ApplicationsPage').then((m) => ({ default: m.ApplicationsPage }))
)
const FavoritesPage = lazy(() =>
  import('@/features/favorites/pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage }))
)
const ChatPage = lazy(() => import('@/features/chat/pages/ChatPage').then((m) => ({ default: m.ChatPage })))
const NotificationsPage = lazy(() =>
  import('@/features/notifications/pages/NotificationsPage').then((m) => ({ default: m.NotificationsPage }))
)
const AdminDashboard = lazy(() =>
  import('@/features/admin/pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
)
const AdminUsersPage = lazy(() =>
  import('@/features/admin/pages/AdminUsersPage').then((m) => ({ default: m.AdminUsersPage }))
)
const AdminCompaniesPage = lazy(() =>
  import('@/features/admin/pages/AdminCompaniesPage').then((m) => ({ default: m.AdminCompaniesPage }))
)
const AdminVacanciesPage = lazy(() =>
  import('@/features/admin/pages/AdminVacanciesPage').then((m) => ({ default: m.AdminVacanciesPage }))
)
const AdminResumesPage = lazy(() =>
  import('@/features/admin/pages/AdminResumesPage').then((m) => ({ default: m.AdminResumesPage }))
)
const AdminAnalyticsPage = lazy(() =>
  import('@/features/admin/pages/AdminAnalyticsPage').then((m) => ({ default: m.AdminAnalyticsPage }))
)
const AdminSettingsPage = lazy(() =>
  import('@/features/admin/pages/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage }))
)
const AdminModerationPage = lazy(() =>
  import('@/features/admin/pages/AdminModerationPage').then((m) => ({ default: m.AdminModerationPage }))
)
const EmployerCompanyPage = lazy(() =>
  import('@/features/employer/pages/EmployerCompanyPage').then((m) => ({ default: m.EmployerCompanyPage }))
)
const EmployerVacanciesPage = lazy(() =>
  import('@/features/employer/pages/EmployerVacanciesPage').then((m) => ({ default: m.EmployerVacanciesPage }))
)
const EmployerVacancyFormPage = lazy(() =>
  import('@/features/employer/pages/EmployerVacancyFormPage').then((m) => ({ default: m.EmployerVacancyFormPage }))
)
const EmployerApplicationsPage = lazy(() =>
  import('@/features/employer/pages/EmployerApplicationsPage').then((m) => ({ default: m.EmployerApplicationsPage }))
)
const EmployerPipelinePage = lazy(() =>
  import('@/features/employer/pages/EmployerPipelinePage').then((m) => ({ default: m.EmployerPipelinePage }))
)
const EmployerAnalyticsPage = lazy(() =>
  import('@/features/employer/pages/EmployerAnalyticsPage').then((m) => ({ default: m.EmployerAnalyticsPage }))
)
const EmployerFavoritesPage = lazy(() =>
  import('@/features/employer/pages/EmployerFavoritesPage').then((m) => ({ default: m.EmployerFavoritesPage }))
)
const EmployerCandidateSearchPage = lazy(() =>
  import('@/features/employer/pages/EmployerCandidateSearchPage').then((m) => ({
    default: m.EmployerCandidateSearchPage,
  }))
)
const VacancyHistoryPage = lazy(() =>
  import('@/features/history/pages/VacancyHistoryPage').then((m) => ({ default: m.VacancyHistoryPage }))
)

export function App() {
  return (
    <HashRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/vacancies" element={<VacanciesPage />} />
            <Route path="/vacancies/:id" element={<VacancyDetailPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/companies/:id" element={<CompanyDetailPage />} />
            <Route path="/resumes" element={<ResumesPage variant="public" />} />
            <Route path="/resumes/:id" element={<PublicResumeDetailPage />} />
          </Route>

          <Route element={<ProtectedRoute><DashboardLayout variant="candidate" /></ProtectedRoute>}>
            <Route path="/dashboard" element={<CandidateDashboard />} />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            <Route path="/dashboard/resume" element={<ResumesPage />} />
            <Route path="/dashboard/resume/create" element={<ResumeFormPage />} />
            <Route path="/dashboard/resume/:id/edit" element={<ResumeFormPage />} />
            <Route path="/dashboard/applications" element={<ApplicationsPage />} />
            <Route path="/dashboard/favorites" element={<FavoritesPage />} />
            <Route path="/dashboard/history" element={<VacancyHistoryPage />} />
            <Route path="/dashboard/messages" element={<ChatPage />} />
            <Route path="/dashboard/notifications" element={<NotificationsPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <RoleGuard roles={['employer', 'recruiter']}>
                  <DashboardLayout variant="employer" />
                </RoleGuard>
              </ProtectedRoute>
            }
          >
            <Route path="/employer" element={<Navigate to="/employer/dashboard" replace />} />
            <Route path="/employer/dashboard" element={<EmployerDashboard />} />
            <Route path="/employer/company" element={<EmployerCompanyPage />} />
            <Route path="/employer/vacancies" element={<EmployerVacanciesPage />} />
            <Route path="/employer/vacancies/new" element={<EmployerVacancyFormPage />} />
            <Route path="/employer/vacancies/:id/edit" element={<EmployerVacancyFormPage />} />
            <Route path="/employer/applications" element={<EmployerApplicationsPage />} />
            <Route path="/employer/pipeline" element={<EmployerPipelinePage />} />
            <Route path="/employer/analytics" element={<EmployerAnalyticsPage />} />
            <Route path="/employer/favorites" element={<EmployerFavoritesPage />} />
            <Route path="/employer/candidates" element={<EmployerCandidateSearchPage />} />
            <Route path="/employer/profile" element={<ProfilePage />} />
            <Route path="/employer/messages" element={<ChatPage />} />
            <Route path="/employer/notifications" element={<NotificationsPage />} />
            <Route path="/employer/settings" element={<SettingsPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <RoleGuard roles={['admin', 'moderator']}>
                  <AdminLayout />
                </RoleGuard>
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/moderation" element={<AdminModerationPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/companies" element={<AdminCompaniesPage />} />
            <Route path="/admin/vacancies" element={<AdminVacanciesPage />} />
            <Route path="/admin/resumes" element={<AdminResumesPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}
