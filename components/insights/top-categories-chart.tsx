"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { useFinanceStore } from "@/lib/store"
import { CHART_COLORS } from "@/lib/constants"
import { computeCategoryBreakdown } from "@/lib/aggregates"
import { Skeleton } from "@/components/ui/skeleton"
import { fadeInScale, chartAnimationProps } from "@/lib/motion"

const chartConfig = {
  amount: { label: "Amount", color: "var(--color-chart-1)" },
} satisfies ChartConfig

export function TopCategoriesChart() {
  const transactions = useFinanceStore((s) => s.transactions)
  const isHydrated = useFinanceStore((s) => s.isHydrated)

  const chartData = useMemo(() => {
    return computeCategoryBreakdown(transactions)
      .slice(0, 5)
      .map((cat, idx) => ({
        name: cat.label,
        amount: cat.amount,
        fill: CHART_COLORS[idx % CHART_COLORS.length],
      }))
  }, [transactions])

  if (!isHydrated) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-5 w-48" /></CardHeader>
        <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
      </Card>
    )
  }

  return (
    <motion.div variants={fadeInScale} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
      <Card className="card-hover-effect overflow-hidden">
        <CardHeader>
          <CardTitle>Top Spending Categories</CardTitle>
          <CardDescription>Expenses by category, sorted by total</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis type="number" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" width={110} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="amount"
                radius={[0, 6, 6, 0]}
                {...chartAnimationProps}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
