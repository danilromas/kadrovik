import { motion } from 'framer-motion';
import { Bell, Lock, Eye, Globe, Palette, Trash2, LogOut } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Switch } from '@/shared/ui/switch';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';
import { useAuthStore } from '@/features/auth/store/authStore';

export function SettingsPage() {
  const { logout } = useAuthStore();

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground mb-2">Настройки</h1>
        <p className="text-muted-foreground">Управляйте настройками аккаунта</p>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Уведомления
            </CardTitle>
            <CardDescription>Настройте получение уведомлений</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Email-уведомления</Label>
                <p className="text-sm text-muted-foreground">Получать уведомления на почту</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Push-уведомления</Label>
                <p className="text-sm text-muted-foreground">Уведомления в браузере</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Новые вакансии</Label>
                <p className="text-sm text-muted-foreground">Уведомления о подходящих вакансиях</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Сообщения</Label>
                <p className="text-sm text-muted-foreground">Уведомления о новых сообщениях</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Приватность
            </CardTitle>
            <CardDescription>Настройки видимости профиля</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Видимость резюме</Label>
                <p className="text-sm text-muted-foreground">Кто может видеть ваше резюме</p>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все работодатели</SelectItem>
                  <SelectItem value="invited">Только по приглашению</SelectItem>
                  <SelectItem value="hidden">Скрыто</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Скрыть контакты</Label>
                <p className="text-sm text-muted-foreground">Показывать контакты только после отклика</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Скрыть от текущего работодателя</Label>
                <p className="text-sm text-muted-foreground">Ваше резюме не будет видно указанным компаниям</p>
              </div>
              <Button variant="outline" size="sm">Настроить</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Безопасность
            </CardTitle>
            <CardDescription>Защита вашего аккаунта</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Изменить пароль</Label>
                <p className="text-sm text-muted-foreground">Обновите пароль для входа</p>
              </div>
              <Button variant="outline" size="sm">Изменить</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Двухфакторная аутентификация</Label>
                <p className="text-sm text-muted-foreground">Дополнительная защита аккаунта</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Активные сессии</Label>
                <p className="text-sm text-muted-foreground">Управление устройствами</p>
              </div>
              <Button variant="outline" size="sm">Просмотреть</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Внешний вид
            </CardTitle>
            <CardDescription>Персонализация интерфейса</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Тема</Label>
                <p className="text-sm text-muted-foreground">Выберите цветовую тему</p>
              </div>
              <Select defaultValue="system">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Светлая</SelectItem>
                  <SelectItem value="dark">Тёмная</SelectItem>
                  <SelectItem value="system">Системная</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Язык</Label>
                <p className="text-sm text-muted-foreground">Язык интерфейса</p>
              </div>
              <Select defaultValue="ru">
                <SelectTrigger className="w-48">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Опасная зона
            </CardTitle>
            <CardDescription>Необратимые действия</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Выйти из аккаунта</Label>
                <p className="text-sm text-muted-foreground">Выйти на всех устройствах</p>
              </div>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Выйти
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Удалить аккаунт</Label>
                <p className="text-sm text-muted-foreground">Удалить аккаунт и все данные навсегда</p>
              </div>
              <Button variant="destructive">Удалить</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
