"use client"

import { motion, useReducedMotion } from "framer-motion"
import {
  WalletIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PiggyBankIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useFinanceStore } from "@/lib/store"
import { useFilteredTransactions } from "@/hooks/use-filtered-transactions"
import { useAnimatedNumber } from "@/hooks/use-animated-number"
import { formatCurrency } from "@/lib/constants"
import { staggerContainer, fadeInUp, cardHover } from "@/lib/motion"

function AnimatedCurrencyValue({ value }: { value: number }) {
  const display = useAnimatedNumber({
    value,
    formatFn: (v) => formatCurrency(Math.round(v)),
  })
  return <motion.span>{display}</motion.span>
}

function AnimatedPercentValue({ value }: { value: number }) {
  const display = useAnimatedNumber({
    value,
    formatFn: (v) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`,
  })
  return <motion.span>{display}</motion.span>
}

interface StatCardProps {
  title: string
  icon: React.ComponentType<{ className?: string }>
  value: number
  change: number
  isCurrency?: boolean
}

function StatCard({ title, icon: Icon, value, change, isCurrency = true }: StatCardProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={prefersReducedMotion ? undefined : cardHover}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isCurrency ? (
              <AnimatedCurrencyValue value={value} />
            ) : (
              <AnimatedPercentValue value={value} />
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            <span className={change >= 0 ? "text-success" : "text-destructive"}>
              {change >= 0 ? "+" : ""}{change.toFixed(1)}%
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function SummaryCards() {
  const isHydrated = useFinanceStore((s) => s.isHydrated)
  const { totalIncome, totalExpenses, totalBalance } = useFilteredTransactions()

  const savingsRate = totalIncome > 0
    ? ((totalIncome - totalExpenses) / totalIncome) * 100
    : 0

  if (!isHydrated) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="mt-2 h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <StatCard
        title="Total Balance"
        icon={WalletIcon}
        value={totalBalance}
        change={8.2}
      />
      <StatCard
        title="Total Income"
        icon={ArrowUpIcon}
        value={totalIncome}
        change={12.5}
      />
      <StatCard
        title="Total Expenses"
        icon={ArrowDownIcon}
        value={totalExpenses}
        change={-3.1}
      />
      <StatCard
        title="Savings Rate"
        icon={PiggyBankIcon}
        value={savingsRate}
        change={4.3}
        isCurrency={false}
      />
    </motion.div>
  )
}
