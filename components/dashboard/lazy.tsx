"use client"

import dynamic from "next/dynamic"
import {
  CardsSkeleton,
  ChartSkeleton,
} from "@/components/skeletons"

// ─── Lazy-load chart components for parallel rendering ────────────────────────
// Each dynamic() creates an independent JS chunk. The browser loads them in
// parallel, and each resolves independently with its own skeleton fallback.

export const LazySummaryCards = dynamic(
  () =>
    import("@/components/dashboard/summary-cards").then((m) => ({
      default: m.SummaryCards,
    })),
  { ssr: false, loading: () => <CardsSkeleton /> }
)

export const LazyBalanceTrendChart = dynamic(
  () =>
    import("@/components/dashboard/balance-trend-chart").then((m) => ({
      default: m.BalanceTrendChart,
    })),
  { ssr: false, loading: () => <ChartSkeleton /> }
)

export const LazySpendingBreakdownChart = dynamic(
  () =>
    import("@/components/dashboard/spending-breakdown-chart").then((m) => ({
      default: m.SpendingBreakdownChart,
    })),
  { ssr: false, loading: () => <ChartSkeleton /> }
)

export const LazyRecentTransactions = dynamic(
  () =>
    import("@/components/dashboard/recent-transactions").then((m) => ({
      default: m.RecentTransactions,
    })),
  { ssr: false, loading: () => <ChartSkeleton /> }
)
