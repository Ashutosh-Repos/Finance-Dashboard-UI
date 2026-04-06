"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { useFinanceStore } from "@/lib/store"
import { Skeleton } from "@/components/ui/skeleton"
import { fadeIn } from "@/lib/motion"

const chartConfig = {
  balance: { label: "Balance", color: "var(--color-chart-1)" },
  income: { label: "Income", color: "var(--color-chart-2)" },
  expenses: { label: "Expenses", color: "var(--color-chart-4)" },
} satisfies ChartConfig

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

export function BalanceTrendChart() {
  const transactions = useFinanceStore((s) => s.transactions)
  const isHydrated = useFinanceStore((s) => s.isHydrated)

  const chartData = useMemo(() => {
    let runningBalance = 0
    return MONTHS.map((month, idx) => {
      const monthStr = `2026-${String(idx + 1).padStart(2, "0")}`
      const monthTxs = transactions.filter((tx) => tx.date.startsWith(monthStr))
      const income = monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0)
      const expenses = monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0)
      runningBalance += income - expenses
      return { month, income, expenses, balance: runningBalance }
    })
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
    <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <Card>
        <CardHeader>
          <CardTitle>Balance Trend</CardTitle>
          <CardDescription>Running balance over January – June 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="var(--color-chart-1)"
                fill="url(#balanceGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
