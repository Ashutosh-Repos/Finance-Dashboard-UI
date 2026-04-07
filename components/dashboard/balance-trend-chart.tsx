"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { useFinanceStore } from "@/lib/store"
import { Skeleton } from "@/components/ui/skeleton"
import { fadeInScale, chartAnimationProps } from "@/lib/motion"
import { getActiveMonths, computeMonthlyBreakdown, monthKeyToLabel } from "@/lib/aggregates"

const chartConfig = {
  balance: { label: "Balance", color: "var(--color-chart-1)" },
  income: { label: "Income", color: "var(--color-chart-2)" },
  expenses: { label: "Expenses", color: "var(--color-chart-4)" },
} satisfies ChartConfig

export function BalanceTrendChart() {
  const transactions = useFinanceStore((s) => s.transactions)
  const isHydrated = useFinanceStore((s) => s.isHydrated)

  const { chartData, dateLabel } = useMemo(() => {
    const months = getActiveMonths(transactions, 6)
    const breakdown = computeMonthlyBreakdown(transactions, months)
    const data = breakdown.map((b) => ({
      month: b.label,
      income: b.income,
      expenses: b.expenses,
      balance: b.balance,
    }))
    const first = months[0] ? monthKeyToLabel(months[0]) : ""
    const last = months[months.length - 1] ? monthKeyToLabel(months[months.length - 1]) : ""
    return { chartData: data, dateLabel: `Running balance over ${first} – ${last}` }
  }, [transactions])

  if (!isHydrated) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div variants={fadeInScale} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
      <Card className="card-hover-effect overflow-hidden">
        <CardHeader>
          <CardTitle>Balance Trend</CardTitle>
          <CardDescription>{dateLabel}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                  <stop offset="50%" stopColor="var(--color-chart-1)" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="var(--color-chart-1)"
                fill="url(#balanceGradient)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "var(--color-chart-1)", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "var(--color-chart-1)", stroke: "var(--background)", strokeWidth: 2 }}
                {...chartAnimationProps}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
