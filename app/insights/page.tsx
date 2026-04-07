import type { Metadata } from "next"
import { PageTransition, AnimatedSection } from "@/components/motion/page-transition"
import {
  LazyInsightCards,
  LazyMonthlyComparisonChart,
  LazyTopCategoriesChart,
  LazySavingsGoal,
} from "@/components/insights/lazy"

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Analyze spending patterns, compare monthly income vs expenses, track top categories, and monitor savings goal progress.",
  openGraph: {
    title: "Insights | Zorvyn Finance",
    description: "Deep-dive into your financial health with visual analytics.",
    type: "website",
  },
}

// ─── Server Component Page ────────────────────────────────────────────────────

export default function InsightsPage() {
  return (
    <PageTransition>
      <AnimatedSection>
        <h1 className="text-2xl font-bold tracking-tight">Insights</h1>
        <p className="text-sm text-muted-foreground">
          Analyze your spending patterns and financial health.
        </p>
      </AnimatedSection>

      {/* 4 independent chunks — parallel rendering */}
      <LazyInsightCards />
      <LazyMonthlyComparisonChart />

      <div className="grid gap-6 lg:grid-cols-2">
        <LazyTopCategoriesChart />
        <LazySavingsGoal />
      </div>
    </PageTransition>
  )
}
