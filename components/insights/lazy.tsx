"use client"

import dynamic from "next/dynamic"
import {
  InsightCardsSkeleton,
  ChartSkeleton,
} from "@/components/skeletons"

export const LazyInsightCards = dynamic(
  () =>
    import("@/components/insights/insight-cards").then((m) => ({
      default: m.InsightCards,
    })),
  { ssr: false, loading: () => <InsightCardsSkeleton /> }
)

export const LazyMonthlyComparisonChart = dynamic(
  () =>
    import("@/components/insights/monthly-comparison-chart").then((m) => ({
      default: m.MonthlyComparisonChart,
    })),
  { ssr: false, loading: () => <ChartSkeleton /> }
)

export const LazyTopCategoriesChart = dynamic(
  () =>
    import("@/components/insights/top-categories-chart").then((m) => ({
      default: m.TopCategoriesChart,
    })),
  { ssr: false, loading: () => <ChartSkeleton /> }
)

export const LazySavingsGoal = dynamic(
  () =>
    import("@/components/insights/savings-goal").then((m) => ({
      default: m.SavingsGoal,
    })),
  { ssr: false, loading: () => <ChartSkeleton /> }
)
