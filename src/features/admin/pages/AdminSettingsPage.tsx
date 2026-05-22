import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Switch } from '@/shared/ui/switch'
import { Button } from '@/shared/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { platformSettingsSchema, type PlatformSettingsFormValues } from '@/shared/lib/schemas'
import { usePlatformSettingsStore } from '@/features/platform/store/platformSettingsStore'

export function AdminSettingsPage() {
  const maintenance = usePlatformSettingsStore((s) => s.maintenance)
  const registrationsOpen = usePlatformSettingsStore((s) => s.registrationsOpen)
  const chatEnabled = usePlatformSettingsStore((s) => s.chatEnabled)
  const pipelineEnabled = usePlatformSettingsStore((s) => s.pipelineEnabled)
  const referralsEnabled = usePlatformSettingsStore((s) => s.referralsEnabled)
  const aiAssistantEnabled = usePlatformSettingsStore((s) => s.aiAssistantEnabled)
  const patch = usePlatformSettingsStore((s) => s.patch)

  const form = useForm<PlatformSettingsFormValues>({
    resolver: zodResolver(platformSettingsSchema),
    defaultValues: {
      maintenance,
      registrationsOpen,
      chatEnabled,
      pipelineEnabled,
      referralsEnabled,
      aiAssistantEnabled,
    },
  })

  useEffect(() => {
    form.reset({
      maintenance,
      registrationsOpen,
      chatEnabled,
      pipelineEnabled,
      referralsEnabled,
      aiAssistantEnabled,
    })
  }, [maintenance, registrationsOpen, chatEnabled, pipelineEnabled, referralsEnabled, aiAssistantEnabled, form])

  const onSubmit = (data: PlatformSettingsFormValues) => {
    patch(data)
    toast.success('Настройки сохранены (локально, демо)')
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Настройки платформы</h1>
        <p className="text-muted-foreground">Feature flags и системные переключатели (persist, демо)</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Общие</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="maintenance"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Режим обслуживания</FormLabel>
                      <FormDescription>Баннер на сайте + ограничение регистрации</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registrationsOpen"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Регистрация открыта</FormLabel>
                      <FormDescription>Страница регистрации учитывает флаг</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chatEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Чат включён</FormLabel>
                      <FormDescription>Индикатор для интеграций (UI-флаг)</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pipelineEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>ATS / Pipeline</FormLabel>
                      <FormDescription>Доступность канбан-рекрутинга</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="referralsEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Реферальная программа</FormLabel>
                      <FormDescription>Экспериментальный модуль</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aiAssistantEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>ИИ-помощник</FormLabel>
                      <FormDescription>Плавающий чат на сайте (Gemini / демо-режим)</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Сохранить</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
