import { TransactionsSkeleton } from "@/components/skeletons"

export default function TransactionsLoading() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div>
        <div className="h-8 w-40 rounded bg-muted animate-pulse" />
        <div className="mt-2 h-4 w-72 rounded bg-muted animate-pulse" />
      </div>
      <TransactionsSkeleton />
    </div>
  )
}
