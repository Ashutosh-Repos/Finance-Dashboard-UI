import { InsightCards } from "@/components/insights/insight-cards"
import { MonthlyComparisonChart } from "@/components/insights/monthly-comparison-chart"
import { TopCategoriesChart } from "@/components/insights/top-categories-chart"
import { SavingsGoal } from "@/components/insights/savings-goal"

export default function InsightsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Insights</h1>
        <p className="text-sm text-muted-foreground">
          Analyze your spending patterns and financial health.
        </p>
      </div>

      <InsightCards />

      <MonthlyComparisonChart />

      <div className="grid gap-6 lg:grid-cols-2">
        <TopCategoriesChart />
        <SavingsGoal />
      </div>
    </div>
  )
}
