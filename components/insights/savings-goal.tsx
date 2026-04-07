"use client"

import { useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useFinanceStore } from "@/lib/store"
import { SAVINGS_GOAL_MONTHLY, formatCurrency } from "@/lib/constants"
import { getLatestMonth, monthKeyToLabel } from "@/lib/aggregates"
import { fadeIn } from "@/lib/motion"

const SIZE = 180
const STROKE_WIDTH = 14
const RADIUS = (SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function SavingsGoal() {
  const transactions = useFinanceStore((s) => s.transactions)
  const isHydrated = useFinanceStore((s) => s.isHydrated)
  const prefersReducedMotion = useReducedMotion()

  const { currentSavings, percentage, isOnTrack, monthLabel } = useMemo(() => {
    // Use the latest month with data (dynamic instead of hardcoded)
    const latestMonth = getLatestMonth(transactions)
    if (!latestMonth) {
      return { currentSavings: 0, percentage: 0, isOnTrack: false, monthLabel: "this month" }
    }

    const monthTxs = transactions.filter((t) => t.date.startsWith(latestMonth))
    const income = monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0)
    const expenses = monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0)
    const savings = Math.max(0, income - expenses)
    const pct = Math.min((savings / SAVINGS_GOAL_MONTHLY) * 100, 100)
    return {
      currentSavings: savings,
      percentage: pct,
      isOnTrack: pct >= 80,
      monthLabel: monthKeyToLabel(latestMonth),
    }
  }, [transactions])

  if (!isHydrated) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
        <CardContent className="flex items-center justify-center">
          <Skeleton className="size-[180px] rounded-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <Card>
        <CardHeader>
          <CardTitle>Savings Goal</CardTitle>
          <CardDescription>
            Monthly target: {formatCurrency(SAVINGS_GOAL_MONTHLY)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="relative" style={{ width: SIZE, height: SIZE }}>
            <svg
              width={SIZE}
              height={SIZE}
              className="-rotate-90"
              role="img"
              aria-label={`Savings progress: ${percentage.toFixed(0)}% of monthly goal`}
            >
              <title>Savings progress: {percentage.toFixed(0)}%</title>
              {/* Background ring */}
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth={STROKE_WIDTH}
                className="text-muted/30"
              />
              {/* Progress ring */}
              <motion.circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                className={isOnTrack ? "text-success" : "text-primary"}
                strokeDasharray={CIRCUMFERENCE}
                initial={{ strokeDashoffset: prefersReducedMotion ? CIRCUMFERENCE * (1 - percentage / 100) : CIRCUMFERENCE }}
                whileInView={{
                  strokeDashoffset: CIRCUMFERENCE * (1 - percentage / 100),
                }}
                viewport={{ once: true }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 1.5,
                  ease: "easeOut",
                }}
              />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{percentage.toFixed(0)}%</span>
              <span className="text-xs text-muted-foreground">of goal</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium">
              {formatCurrency(currentSavings)} saved in {monthLabel}
            </p>
            <p className="text-xs text-muted-foreground">
              {percentage >= 100
                ? "🎉 Goal achieved!"
                : percentage >= 80
                  ? "Almost there! Keep going."
                  : percentage > 0
                    ? "You're making progress."
                    : "Start saving to see progress."}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
