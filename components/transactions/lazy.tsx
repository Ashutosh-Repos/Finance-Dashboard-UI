"use client"

import dynamic from "next/dynamic"
import { TransactionsSkeleton } from "@/components/skeletons"

export const LazyTransactionsContent = dynamic(
  () =>
    import("@/components/transactions/transactions-content").then((m) => ({
      default: m.TransactionsContent,
    })),
  { ssr: false, loading: () => <TransactionsSkeleton /> }
)
