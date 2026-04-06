"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { useFinanceStore } from "@/lib/store"
import { CATEGORIES } from "@/lib/constants"
import { Skeleton } from "@/components/ui/skeleton"
import { fadeIn } from "@/lib/motion"

const chartConfig = {
  amount: { label: "Amount", color: "var(--color-chart-1)" },
} satisfies ChartConfig

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
]

export function TopCategoriesChart() {
  const transactions = useFinanceStore((s) => s.transactions)
  const isHydrated = useFinanceStore((s) => s.isHydrated)

  const chartData = useMemo(() => {
    const catMap = new Map<string, number>()
    for (const tx of transactions) {
      if (tx.type === "expense") {
        catMap.set(tx.category, (catMap.get(tx.category) ?? 0) + tx.amount)
      }
    }
    return [...catMap.entries()]
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, amount], idx) => {
        const cat = CATEGORIES.find((c) => c.id === id)
        return { name: cat?.label ?? id, amount, fill: CHART_COLORS[idx % CHART_COLORS.length] }
      })
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
    <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <Card>
        <CardHeader>
          <CardTitle>Top Spending Categories</CardTitle>
          <CardDescription>Expenses by category, sorted by total</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" width={110} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
