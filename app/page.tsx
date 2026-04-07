import type { Metadata } from "next"
import { PageTransition, AnimatedSection } from "@/components/motion/page-transition"
import {
  LazySummaryCards,
  LazyBalanceTrendChart,
  LazySpendingBreakdownChart,
  LazyRecentTransactions,
} from "@/components/dashboard/lazy"

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "View your financial overview — total balance, income, expenses, savings rate, and spending trends at a glance.",
  openGraph: {
    title: "Dashboard | Zorvyn Finance",
    description: "Your finances at a glance — balance, income, expenses, and trends.",
    type: "website",
  },
}

// ─── Server Component Page ────────────────────────────────────────────────────
// The heading is server-rendered HTML (zero JS). Chart components load in
// parallel as independent client chunks with skeleton fallbacks.

export default function DashboardPage() {
  return (
    <PageTransition>
      {/* Server-rendered heading — instant HTML, no JS needed */}
      <AnimatedSection>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your finances at a glance.
        </p>
      </AnimatedSection>

      {/* Each component loads as its own parallel chunk */}
      <LazySummaryCards />
      <LazyBalanceTrendChart />

      <div className="grid gap-6 lg:grid-cols-2">
        <LazySpendingBreakdownChart />
        <LazyRecentTransactions />
      </div>
    </PageTransition>
  )
}
