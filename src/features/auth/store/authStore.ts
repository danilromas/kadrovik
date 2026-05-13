import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, UserRole, CandidateProfile, EmployerProfile, ProfileUpdatePayload } from '@/shared/types'
import { mockUsers } from '@/shared/mocks/users'
import { authPersistStorage, setAuthPersistScope } from '../authPersistStorage'

interface AuthState {
  user: User | CandidateProfile | EmployerProfile | null
  token: string | null
  /** ТЗ B.1 — mock refresh token (ротация через rotateRefreshToken) */
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (data: ProfileUpdatePayload) => void
  setRole: (role: UserRole) => void
  rotateRefreshToken: () => void
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
  /** ТЗ B.2 */
  rememberMe?: boolean
}

function newTokens() {
  const ts = Date.now()
  return {
    token: `mock-jwt-${ts}`,
    refreshToken: `mock-refresh-${ts}`,
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, _password: string, rememberMe = true) => {
        setAuthPersistScope(!rememberMe)
        set({ isLoading: true })

        await new Promise((resolve) => setTimeout(resolve, 800))

        const user = mockUsers.find((u) => u.email === email)

        if (user) {
          const { token, refreshToken } = newTokens()
          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          set({ isLoading: false })
          throw new Error('Неверный email или пароль')
        }
      },

      register: async (data: RegisterData) => {
        const rememberMe = data.rememberMe !== false
        setAuthPersistScope(!rememberMe)
        set({ isLoading: true })

        await new Promise((resolve) => setTimeout(resolve, 1000))

        const newUser: User = {
          id: `user-${Date.now()}`,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          isVerified: false,
          isBlocked: false,
        }

        const { token, refreshToken } = newTokens()
        set({
          user: newUser,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      logout: () => {
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false })
      },

      updateProfile: (data) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...data } as typeof currentUser })
        }
      },

      setRole: (role) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, role } })
        }
      },

      rotateRefreshToken: () => {
        const { refreshToken: cur } = get()
        if (!cur) return
        const { token, refreshToken } = newTokens()
        set({ token, refreshToken })
      },
    }),
    {
      name: 'kadrovik-auth',
      storage: createJSONStorage(() => authPersistStorage),
      partialize: (s) => ({
        user: s.user,
        token: s.token,
        refreshToken: s.refreshToken,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
)
