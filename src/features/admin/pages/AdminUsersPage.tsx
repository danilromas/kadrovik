import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { mockApi } from '@/shared/api/mockApi'
import { USER_ROLES } from '@/shared/constants'
import type { User, UserRole } from '@/shared/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

const ROLE_OPTIONS: UserRole[] = ['candidate', 'employer', 'recruiter', 'moderator', 'admin']

export function AdminUsersPage() {
  const { data: users = [], isLoading } = useQuery({ queryKey: ['admin-users'], queryFn: () => mockApi.getUsers() })

  const toggleBlock = (u: User) => {
    toast.success(u.isBlocked ? 'Пользователь разблокирован (демо)' : 'Пользователь заблокирован (демо)')
  }

  const changeRole = (_u: User, role: UserRole) => {
    toast.success(`Роль изменена на «${USER_ROLES[role]}» (демо)`)
  }

  const rows = useMemo(() => users, [users])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Пользователи</h1>
        <p className="text-muted-foreground">Блокировка и смена роли (демо, без сохранения)</p>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Загрузка…</p>
      ) : (
        <div className="space-y-2">
          {rows.map((u) => (
            <Card key={u.id}>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 py-3">
                <CardTitle className="text-base font-medium">
                  {u.firstName} {u.lastName}
                </CardTitle>
                <Badge variant="outline">{USER_ROLES[u.role]}</Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 pb-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>{u.email}</span>
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={u.role}
                    onValueChange={(v) => changeRole(u, v as UserRole)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Роль" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {USER_ROLES[r]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant={u.isBlocked ? 'outline' : 'destructive'} onClick={() => toggleBlock(u)}>
                    {u.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
