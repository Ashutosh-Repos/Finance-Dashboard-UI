import { InsightCardsSkeleton, ChartSkeleton } from "@/components/skeletons"

export default function InsightsLoading() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div>
        <div className="h-8 w-28 rounded bg-muted animate-pulse" />
        <div className="mt-2 h-4 w-72 rounded bg-muted animate-pulse" />
      </div>
      <InsightCardsSkeleton />
      <ChartSkeleton />
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  )
}
