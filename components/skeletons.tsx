import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/** 4 summary stat card skeletons */
export function CardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="relative overflow-hidden">
          <div className="animate-shimmer absolute inset-0" />
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="mt-2 h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/** Single chart card skeleton */
export function ChartSkeleton() {
  return (
    <Card className="relative overflow-hidden">
      <div className="animate-shimmer absolute inset-0" />
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-60" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}

/** Two-column grid skeleton for bottom charts */
export function GridSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
  )
}

/** 3 insight stat card skeletons */
export function InsightCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="relative overflow-hidden">
          <div className="animate-shimmer absolute inset-0" />
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-36" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-28" />
            <Skeleton className="mt-2 h-3 w-40" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/** Transaction table skeleton */
export function TransactionsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Action bar */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-36" />
      </div>
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-10 w-52" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      {/* Table rows */}
      <Card className="relative overflow-hidden">
        <div className="animate-shimmer absolute inset-0" />
        <CardContent className="p-0">
          <div className="space-y-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b border-border/50 px-4 py-3"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-48 flex-1" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/** Full-page loading skeleton */
export function PageSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <CardsSkeleton />
      <ChartSkeleton />
    </div>
  )
}
