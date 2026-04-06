"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Cell, Label, Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { useFinanceStore } from "@/lib/store"
import { CATEGORIES, formatCurrency } from "@/lib/constants"
import { Skeleton } from "@/components/ui/skeleton"
import { fadeIn } from "@/lib/motion"

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
]

export function SpendingBreakdownChart() {
  const transactions = useFinanceStore((s) => s.transactions)
  const isHydrated = useFinanceStore((s) => s.isHydrated)

  const { chartData, chartConfig, totalExpenses } = useMemo(() => {
    const expensesByCategory = new Map<string, number>()
    let total = 0

    for (const tx of transactions) {
      if (tx.type === "expense") {
        expensesByCategory.set(
          tx.category,
          (expensesByCategory.get(tx.category) ?? 0) + tx.amount
        )
        total += tx.amount
      }
    }

    const sorted = [...expensesByCategory.entries()]
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    const data = sorted.map(([categoryId, amount], idx) => {
      const cat = CATEGORIES.find((c) => c.id === categoryId)
      return {
        name: cat?.label ?? categoryId,
        value: amount,
        fill: CHART_COLORS[idx % CHART_COLORS.length],
      }
    })

    const config: ChartConfig = {}
    data.forEach((d, idx) => {
      config[d.name] = { label: d.name, color: CHART_COLORS[idx % CHART_COLORS.length] }
    })

    return { chartData: data, chartConfig: config, totalExpenses: total }
  }, [transactions])

  if (!isHydrated) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="mx-auto size-[250px] rounded-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <Card>
        <CardHeader>
          <CardTitle>Spending Breakdown</CardTitle>
          <CardDescription>Top 5 expense categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={120}
                strokeWidth={2}
              >
                {chartData.map((entry, idx) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-xl font-bold">
                            {formatCurrency(totalExpenses)}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 20} className="fill-muted-foreground text-xs">
                            Total Expenses
                          </tspan>
                        </text>
                      )
                    }
                    return null
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
