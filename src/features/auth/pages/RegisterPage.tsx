import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Mail, Lock, User, Building2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Checkbox } from '@/shared/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { useAuthStore } from '../store/authStore'
import { getPostLoginPath } from '@/shared/lib/navigation'
import { registerSchema, type RegisterFormValues } from '@/shared/lib/schemas'
import type { UserRole } from '@/shared/types'
import { usePlatformSettingsStore } from '@/features/platform/store/platformSettingsStore'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuthStore()
  const registrationsOpen = usePlatformSettingsStore((s) => s.registrationsOpen)
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<UserRole>('candidate')

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
      rememberMe: true,
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    if (!registrationsOpen) {
      form.setError('root', { message: 'Регистрация временно закрыта администратором (демо).' })
      return
    }
    form.clearErrors('root')
    try {
      await register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role,
        rememberMe: data.rememberMe,
      })
      navigate(getPostLoginPath(useAuthStore.getState().user))
    } catch {
      form.setError('root', { message: 'Ошибка регистрации. Попробуйте позже.' })
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Создать аккаунт</h1>
        <p className="text-muted-foreground">Начните поиск работы или сотрудников</p>
      </div>

      {!registrationsOpen && (
        <div className="mb-4 p-3 rounded-lg bg-amber-500/15 text-amber-900 dark:text-amber-100 text-sm border border-amber-500/30">
          Регистрация закрыта в настройках платформы (демо). Войдите под существующим аккаунтом.
        </div>
      )}

      <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
        <button
          type="button"
          onClick={() => setRole('candidate')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
            role === 'candidate'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className="h-4 w-4" />
          Соискатель
        </button>
        <button
          type="button"
          onClick={() => setRole('employer')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
            role === 'employer'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Building2 className="h-4 w-4" />
          Работодатель
        </button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {form.formState.errors.root && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {form.formState.errors.root.message}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input placeholder="Иван" autoComplete="given-name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Фамилия</FormLabel>
                  <FormControl>
                    <Input placeholder="Иванов" autoComplete="family-name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <FormControl>
                    <Input type="email" placeholder="example@mail.ru" className="pl-10" autoComplete="email" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Минимум 8 символов"
                      className="pl-10 pr-10"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Подтвердите пароль</FormLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Повторите пароль"
                      className="pl-10"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    id="remember-reg"
                    checked={field.value}
                    onCheckedChange={(c) => field.onChange(c === true)}
                  />
                </FormControl>
                <FormLabel htmlFor="remember-reg" className="text-sm font-normal cursor-pointer">
                  Запомнить меня на этом устройстве
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreeTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                <FormControl>
                  <Checkbox id="terms" checked={field.value} onCheckedChange={(c) => field.onChange(c === true)} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel htmlFor="terms" className="text-sm font-normal leading-tight cursor-pointer">
                    Я согласен с{' '}
                    <Link to="/terms" className="text-primary hover:underline">
                      условиями использования
                    </Link>{' '}
                    и{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      политикой конфиденциальности
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading || !registrationsOpen}>
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Войти
            </Link>
          </p>
        </form>
      </Form>
    </motion.div>
  )
}
