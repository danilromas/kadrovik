import { useMemo, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { GripVertical, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import { mockApplications } from '@/shared/mocks/applications'
import { mockUsers } from '@/shared/mocks/users'
import { PIPELINE_STAGES } from '@/shared/constants'
import type { Application, PipelineStage } from '@/shared/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { cn, formatDistanceToNow } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Separator } from '@/shared/ui/separator'

const STAGES = Object.keys(PIPELINE_STAGES) as PipelineStage[]

const hrUsers = mockUsers.filter((u) => u.role === 'employer' || u.role === 'recruiter')

function PipelineCard({
  app,
  expanded,
  onToggle,
  onAssign,
}: {
  app: Application
  expanded: boolean
  onToggle: () => void
  onAssign: (userId: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: app.id })
  const style = transform
    ? { transform: `translate3d(${transform.x}px,${transform.y}px,0)` }
    : undefined
  const name = app.candidate ? `${app.candidate.firstName} ${app.candidate.lastName}` : 'Кандидат'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-lg border bg-card text-sm shadow-sm',
        isDragging && 'opacity-60 ring-2 ring-primary'
      )}
    >
      <div className="flex gap-1 p-2">
        <button
          type="button"
          className="mt-0.5 cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-muted"
          {...listeners}
          {...attributes}
          aria-label="Перетащить"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground truncate">{app.vacancy?.title}</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-1 h-7 px-2 text-xs text-muted-foreground"
            onClick={onToggle}
          >
            {expanded ? (
              <>
                Скрыть детали <ChevronUp className="h-3 w-3 ml-1" />
              </>
            ) : (
              <>
                HR, таймлайн <ChevronDown className="h-3 w-3 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="border-t bg-muted/20 px-3 py-2 space-y-3 text-xs">
          <div>
            <p className="font-medium text-foreground mb-1">Ответственный</p>
            <Select
              value={app.assignedTo || '__none__'}
              onValueChange={(v) => onAssign(v === '__none__' ? '' : v)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Назначить" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Не назначен</SelectItem>
                {hrUsers.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.firstName} {u.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {app.notes && app.notes.length > 0 && (
            <div>
              <p className="font-medium text-foreground mb-1">Комментарии HR</p>
              <ul className="space-y-1 text-muted-foreground">
                {app.notes.map((n) => (
                  <li key={n.id}>
                    {n.content}
                    <span className="block text-[10px]">{formatDistanceToNow(new Date(n.createdAt))}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {app.timeline && app.timeline.length > 0 && (
            <div>
              <p className="font-medium text-foreground mb-1">Таймлайн</p>
              <ol className="space-y-1 border-l border-primary/30 pl-2">
                {app.timeline.slice(-5).map((ev) => (
                  <li key={ev.id}>
                    <span className="text-foreground">{ev.description}</span>
                    <span className="block text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(ev.createdAt))}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function PipelineColumn({
  stage,
  apps,
  expandedId,
  setExpandedId,
  onAssign,
}: {
  stage: PipelineStage
  apps: Application[]
  expandedId: string | null
  setExpandedId: (id: string | null) => void
  onAssign: (appId: string, userId: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `col-${stage}` })
  const meta = PIPELINE_STAGES[stage]
  return (
    <div className="min-w-[240px] flex-1">
      <div className="mb-2 flex items-center gap-2">
        <span className={cn('size-2 rounded-full', meta.color)} />
        <span className="text-sm font-medium">{meta.label}</span>
        <span className="text-xs text-muted-foreground">({apps.length})</span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          'rounded-xl border bg-muted/30 p-2 min-h-[280px] space-y-2 transition-colors',
          isOver && 'ring-2 ring-primary/40 bg-primary/5'
        )}
      >
        {apps.map((app) => (
          <PipelineCard
            key={app.id}
            app={app}
            expanded={expandedId === app.id}
            onToggle={() => setExpandedId(expandedId === app.id ? null : app.id)}
            onAssign={(userId) => onAssign(app.id, userId)}
          />
        ))}
      </div>
    </div>
  )
}

export function EmployerPipelinePage() {
  const [apps, setApps] = useState<Application[]>(() => [...mockApplications])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const byStage = useMemo(() => {
    const map = new Map<PipelineStage, Application[]>()
    STAGES.forEach((s) => map.set(s, []))
    apps.forEach((a) => {
      const list = map.get(a.pipelineStage) ?? []
      list.push(a)
      map.set(a.pipelineStage, list)
    })
    return map
  }, [apps])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    const appId = String(active.id)
    const overId = String(over.id)
    let newStage: PipelineStage | null = null
    if (overId.startsWith('col-')) {
      newStage = overId.replace('col-', '') as PipelineStage
    } else {
      const target = apps.find((a) => a.id === overId)
      if (target) newStage = target.pipelineStage
    }
    if (!newStage || !PIPELINE_STAGES[newStage]) return
    setApps((prev) => prev.map((a) => (a.id === appId ? { ...a, pipelineStage: newStage! } : a)))
  }

  const handleAssign = (appId: string, userId: string) => {
    setApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, assignedTo: userId || undefined } : a))
    )
    toast.success('Ответственный обновлён (демо)')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pipeline</h1>
        <p className="text-muted-foreground">
          Kanban, drag-and-drop, комментарии HR, таймлайн и ответственный (демо)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Воронка откликов</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto pb-4">
          <Separator className="mb-4 lg:hidden" />
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 min-w-max">
              {STAGES.map((stage) => (
                <PipelineColumn
                  key={stage}
                  stage={stage}
                  apps={byStage.get(stage) ?? []}
                  expandedId={expandedId}
                  setExpandedId={setExpandedId}
                  onAssign={handleAssign}
                />
              ))}
            </div>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  )
}
