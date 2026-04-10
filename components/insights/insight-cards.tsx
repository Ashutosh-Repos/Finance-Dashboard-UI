"use client"

import { useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { TrendingDownIcon, TrendingUpIcon, CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useFinanceStore } from "@/lib/store"
import { useAnimatedNumber } from "@/hooks/use-animated-number"
import { formatCurrency } from "@/lib/constants"
import { computeMoMChange, computeCategoryBreakdown, computeDaySpan, getActiveMonths, monthKeyToLabel } from "@/lib/aggregates"
import { staggerContainer, fadeInUp, cardHover, cardTap, iconHover } from "@/lib/motion"

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

    const categories = computeCategoryBreakdown(transactions)
    const highest = categories[0] ?? { id: "", label: "N/A", amount: 0 }
    const highestCatPercent = totalExpenses > 0 ? (highest.amount / totalExpenses) * 100 : 0

    const mom = computeMoMChange(transactions)

    const activeMonths = getActiveMonths(transactions, 2)
    const latestMonthLabel = activeMonths.length > 0 ? monthKeyToLabel(activeMonths[activeMonths.length - 1]) : "—"

    const daySpan = computeDaySpan(transactions)
    const avgDaily = totalExpenses / daySpan

    return {
      highestCatLabel: highest.label,
      highestCatAmount: highest.amount,
      highestCatPercent,
      momChange: mom.change,
      latestMonthExpenses: mom.currentExpenses,
      latestMonthLabel,
      avgDaily,
      daySpan,
    }
  }, [transactions])

  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="animate-shimmer absolute inset-0" />
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
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={fadeInUp}
        whileHover={prefersReducedMotion ? undefined : cardHover}
        whileTap={prefersReducedMotion ? undefined : cardTap}
        className="card-hover-effect"
      >
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Highest Category
            </CardTitle>
            <motion.div whileHover={iconHover}>
              <TrendingUpIcon className="size-4 text-muted-foreground" />
            </motion.div>
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

      <motion.div
        variants={fadeInUp}
        whileHover={prefersReducedMotion ? undefined : cardHover}
        whileTap={prefersReducedMotion ? undefined : cardTap}
        className="card-hover-effect"
      >
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Month-over-Month
            </CardTitle>
            <motion.div whileHover={iconHover}>
              {insights.momChange <= 0 ? (
                <TrendingDownIcon className="size-4 text-success" />
              ) : (
                <TrendingUpIcon className="size-4 text-destructive" />
              )}
            </motion.div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${insights.momChange <= 0 ? "text-success" : "text-destructive"}`}>
              {insights.momChange >= 0 ? "+" : ""}{insights.momChange.toFixed(1)}%
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {insights.latestMonthLabel} expenses: <AnimatedCurrency value={insights.latestMonthExpenses} />
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        whileHover={prefersReducedMotion ? undefined : cardHover}
        whileTap={prefersReducedMotion ? undefined : cardTap}
        className="card-hover-effect"
      >
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Daily Spend
            </CardTitle>
            <motion.div whileHover={iconHover}>
              <CalendarIcon className="size-4 text-muted-foreground" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCurrency value={insights.avgDaily} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Across {insights.daySpan} days of tracked spending
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
