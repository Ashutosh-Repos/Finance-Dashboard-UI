"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { TrendingDownIcon, TrendingUpIcon, CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useFinanceStore } from "@/lib/store"
import { useAnimatedNumber } from "@/hooks/use-animated-number"
import { CATEGORIES, formatCurrency } from "@/lib/constants"
import { staggerContainer, fadeInUp, cardHover } from "@/lib/motion"
import { useReducedMotion } from "framer-motion"

function AnimatedCurrency({ value }: { value: number }) {
  const display = useAnimatedNumber({
    value,
    formatFn: (v) => formatCurrency(Math.round(v)),
  })
  return <motion.span>{display}</motion.span>
}

export function InsightCards() {
  const transactions = useFinanceStore((s) => s.transactions)
  const isHydrated = useFinanceStore((s) => s.isHydrated)
  const prefersReducedMotion = useReducedMotion()

  const insights = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense")
    const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0)

    // Highest spending category
    const catMap = new Map<string, number>()
    for (const tx of expenses) {
      catMap.set(tx.category, (catMap.get(tx.category) ?? 0) + tx.amount)
    }
    let highestCat = { id: "", amount: 0 }
    for (const [id, amount] of catMap) {
      if (amount > highestCat.amount) highestCat = { id, amount }
    }
    const highestCatDef = CATEGORIES.find((c) => c.id === highestCat.id)
    const highestCatPercent = totalExpenses > 0 ? (highestCat.amount / totalExpenses) * 100 : 0

    // Month-over-month (May vs June)
    const mayExpenses = expenses
      .filter((t) => t.date.startsWith("2026-05"))
      .reduce((s, t) => s + t.amount, 0)
    const junExpenses = expenses
      .filter((t) => t.date.startsWith("2026-06"))
      .reduce((s, t) => s + t.amount, 0)
    const momChange = mayExpenses > 0 ? ((junExpenses - mayExpenses) / mayExpenses) * 100 : 0

    // Average daily expenditure (6 months ≈ 182 days)
    const avgDaily = totalExpenses / 182

    return {
      highestCatLabel: highestCatDef?.label ?? highestCat.id,
      highestCatAmount: highestCat.amount,
      highestCatPercent,
      momChange,
      junExpenses,
      avgDaily,
    }
  }, [transactions])

  if (!isHydrated) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-36" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-28" />
              <Skeleton className="mt-2 h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-3"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeInUp} whileHover={prefersReducedMotion ? undefined : cardHover}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Highest Category
            </CardTitle>
            <TrendingUpIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.highestCatLabel}</div>
            <p className="mt-1 text-sm text-muted-foreground">
              <AnimatedCurrency value={insights.highestCatAmount} />{" "}
              ({insights.highestCatPercent.toFixed(1)}% of expenses)
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeInUp} whileHover={prefersReducedMotion ? undefined : cardHover}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Month-over-Month
            </CardTitle>
            {insights.momChange <= 0 ? (
              <TrendingDownIcon className="size-4 text-success" />
            ) : (
              <TrendingUpIcon className="size-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${insights.momChange <= 0 ? "text-success" : "text-destructive"}`}>
              {insights.momChange >= 0 ? "+" : ""}{insights.momChange.toFixed(1)}%
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              June expenses: <AnimatedCurrency value={insights.junExpenses} />
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeInUp} whileHover={prefersReducedMotion ? undefined : cardHover}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Daily Spend
            </CardTitle>
            <CalendarIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCurrency value={insights.avgDaily} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Across 6 months of tracked spending
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
