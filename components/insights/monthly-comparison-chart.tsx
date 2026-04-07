"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart"
import { useFinanceStore } from "@/lib/store"
import { Skeleton } from "@/components/ui/skeleton"
import { fadeIn } from "@/lib/motion"
import { getActiveMonths, computeMonthlyBreakdown } from "@/lib/aggregates"

const chartConfig = {
  income: { label: "Income", color: "var(--color-chart-2)" },
  expenses: { label: "Expenses", color: "var(--color-chart-4)" },
} satisfies ChartConfig

export function MonthlyComparisonChart() {
  const transactions = useFinanceStore((s) => s.transactions)
  const isHydrated = useFinanceStore((s) => s.isHydrated)

  const { chartData, monthCount } = useMemo(() => {
    const months = getActiveMonths(transactions, 6)
    const breakdown = computeMonthlyBreakdown(transactions, months)
    const data = breakdown.map((b) => ({
      month: b.label,
      income: b.income,
      expenses: b.expenses,
    }))
    return { chartData: data, monthCount: months.length }
  }, [transactions])

  if (!isHydrated) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-5 w-52" /></CardHeader>
        <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
      </Card>
    )
  }

  return (
    <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Income vs Expenses</CardTitle>
          <CardDescription>Grouped comparison over {monthCount} months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="income" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
