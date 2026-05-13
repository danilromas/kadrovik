import { Skeleton } from '@/shared/ui/skeleton'

export function PageLoader() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-4">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
}
