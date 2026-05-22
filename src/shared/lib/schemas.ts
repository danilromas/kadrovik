import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Введите email').email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль'),
  rememberMe: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'Укажите имя'),
    lastName: z.string().min(1, 'Укажите фамилию'),
    email: z.string().min(1, 'Введите email').email('Некорректный email'),
    password: z.string().min(8, 'Минимум 8 символов'),
    confirmPassword: z.string().min(1, 'Подтвердите пароль'),
    agreeTerms: z.boolean().refine((v) => v === true, {
      message: 'Необходимо принять условия использования',
    }),
    rememberMe: z.boolean(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

export const vacancyApplySchema = z.object({
  resumeId: z.string().min(1, 'Выберите резюме'),
  coverLetter: z.string().max(5000, 'Не более 5000 символов').optional(),
})

export type VacancyApplyFormValues = z.infer<typeof vacancyApplySchema>

export const platformSettingsSchema = z.object({
  maintenance: z.boolean(),
  registrationsOpen: z.boolean(),
  chatEnabled: z.boolean(),
  pipelineEnabled: z.boolean(),
  referralsEnabled: z.boolean(),
  aiAssistantEnabled: z.boolean(),
})

export type PlatformSettingsFormValues = z.infer<typeof platformSettingsSchema>
