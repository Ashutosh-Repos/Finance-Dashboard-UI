import { SummaryCards } from "@/components/dashboard/summary-cards"
import { BalanceTrendChart } from "@/components/dashboard/balance-trend-chart"
import { SpendingBreakdownChart } from "@/components/dashboard/spending-breakdown-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your finances at a glance.
        </p>
      </div>

      <SummaryCards />

      <BalanceTrendChart />

      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingBreakdownChart />
        <RecentTransactions />
      </div>
    </div>
  )
}
