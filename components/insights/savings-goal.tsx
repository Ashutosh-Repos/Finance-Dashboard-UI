"use client"

import { useMemo } from "react"
import { motion, useReducedMotion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useFinanceStore } from "@/lib/store"
import { useAnimatedNumber } from "@/hooks/use-animated-number"
import { SAVINGS_GOAL_MONTHLY, formatCurrency } from "@/lib/constants"
import { getLatestMonth, monthKeyToLabel } from "@/lib/aggregates"
import { fadeInScale, springBouncy } from "@/lib/motion"

const SIZE = 180
const STROKE_WIDTH = 14
const RADIUS = (SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function AnimatedPercentage({ value }: { value: number }) {
  const display = useAnimatedNumber({
    value,
    duration: 1.5,
    formatFn: (v) => `${Math.round(v)}%`,
  })
  return <motion.span className="text-3xl font-bold">{display}</motion.span>
}

export function SavingsGoal() {
  const transactions = useFinanceStore((s) => s.transactions)
  const isHydrated = useFinanceStore((s) => s.isHydrated)
  const prefersReducedMotion = useReducedMotion()

  const { currentSavings, percentage, isOnTrack, isComplete, monthLabel } = useMemo(() => {
    const latestMonth = getLatestMonth(transactions)
    if (!latestMonth) {
      return { currentSavings: 0, percentage: 0, isOnTrack: false, isComplete: false, monthLabel: "this month" }
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
      isComplete: pct >= 100,
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
    <motion.div variants={fadeInScale} initial="hidden" whileInView="visible" viewport={{ once: true }} className="w-full min-w-0">
      <Card className="card-hover-effect overflow-hidden">
        <CardHeader>
          <CardTitle>Savings Goal</CardTitle>
          <CardDescription>
            Monthly target: {formatCurrency(SAVINGS_GOAL_MONTHLY)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="relative" style={{ width: SIZE, height: SIZE }}>
            {/* Glow effect behind ring when goal is achieved */}
            <AnimatePresence>
              {isComplete && !prefersReducedMotion && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={springBouncy}
                  className="absolute inset-[-8px] rounded-full bg-success/20 animate-glow"
                />
              )}
            </AnimatePresence>

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
                  duration: prefersReducedMotion ? 0 : 1.8,
                  ease: [0.25, 1, 0.5, 1],
                  delay: 0.3,
                }}
              />
            </svg>

            {/* Center text — animated counter */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatedPercentage value={percentage} />
              <span className="text-xs text-muted-foreground">of goal</span>
            </div>
          </div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <p className="text-sm font-medium">
              {formatCurrency(currentSavings)} saved in {monthLabel}
            </p>
            <p className="text-xs text-muted-foreground">
              {isComplete
                ? "🎉 Goal achieved!"
                : isOnTrack
                  ? "Almost there! Keep going."
                  : percentage > 0
                    ? "You're making progress."
                    : "Start saving to see progress."}
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
