import type { Transaction } from "@/lib/types"
import { CATEGORY_MAP } from "@/lib/constants"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MonthBucket {
  /** e.g. "2026-03" */
  key: string
  /** e.g. "Mar" */
  label: string
  income: number
  expenses: number
  balance: number
}

export interface CategoryBucket {
  id: string
  label: string
  amount: number
}

// ─── Month Utilities ──────────────────────────────────────────────────────────

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/**
 * Derive the most recent N months that have transaction data.
 * Returns month keys like "2026-03" in chronological order.
 */
export function getActiveMonths(transactions: Transaction[], count = 6): string[] {
  const monthSet = new Set<string>()
  for (const tx of transactions) {
    monthSet.add(tx.date.slice(0, 7))
  }
  return [...monthSet].sort().slice(-count)
}

/** Convert a month key like "2026-03" to a short label like "Mar" */
export function monthKeyToLabel(key: string): string {
  const monthIdx = parseInt(key.slice(5), 10) - 1
  return SHORT_MONTHS[monthIdx] ?? key
}

// ─── Aggregations ─────────────────────────────────────────────────────────────

/** Compute income, expenses, and running balance per month */
export function computeMonthlyBreakdown(transactions: Transaction[], monthKeys: string[]): MonthBucket[] {
  let runningBalance = 0
  return monthKeys.map((key) => {
    const monthTxs = transactions.filter((tx) => tx.date.startsWith(key))
    const income = monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0)
    const expenses = monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0)
    runningBalance += income - expenses
    return { key, label: monthKeyToLabel(key), income, expenses, balance: runningBalance }
  })
}

/** Compute expense totals per category, sorted descending */
export function computeCategoryBreakdown(transactions: Transaction[]): CategoryBucket[] {
  const catMap = new Map<string, number>()
  for (const tx of transactions) {
    if (tx.type === "expense") {
      catMap.set(tx.category, (catMap.get(tx.category) ?? 0) + tx.amount)
    }
  }
  return [...catMap.entries()]
    .sort(([, a], [, b]) => b - a)
    .map(([id, amount]) => ({
      id,
      label: CATEGORY_MAP[id]?.label ?? id,
      amount,
    }))
}

/** Get the latest month key from transactions */
export function getLatestMonth(transactions: Transaction[]): string | null {
  const months = getActiveMonths(transactions, 1)
  return months.length > 0 ? months[months.length - 1] : null
}

/** Compute month-over-month expense change percentage between last two active months */
export function computeMoMChange(transactions: Transaction[]): {
  previousExpenses: number
  currentExpenses: number
  change: number
} {
  const months = getActiveMonths(transactions, 2)
  if (months.length < 2) return { previousExpenses: 0, currentExpenses: 0, change: 0 }

  const prev = months[0]
  const curr = months[1]

  const prevExpenses = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(prev))
    .reduce((s, t) => s + t.amount, 0)
  const currExpenses = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(curr))
    .reduce((s, t) => s + t.amount, 0)

  const change = prevExpenses > 0 ? ((currExpenses - prevExpenses) / prevExpenses) * 100 : 0

  return { previousExpenses: prevExpenses, currentExpenses: currExpenses, change }
}

/** Compute real MoM changes for dashboard summary cards */
export function computeSummaryMoM(transactions: Transaction[]): {
  incomeChange: number
  expenseChange: number
  balanceChange: number
  savingsRateChange: number
} {
  const months = getActiveMonths(transactions, 2)
  if (months.length < 2) return { incomeChange: 0, expenseChange: 0, balanceChange: 0, savingsRateChange: 0 }

  const [prev, curr] = months.slice(-2)

  const prevIncome = transactions.filter((t) => t.type === "income" && t.date.startsWith(prev)).reduce((s, t) => s + t.amount, 0)
  const prevExpense = transactions.filter((t) => t.type === "expense" && t.date.startsWith(prev)).reduce((s, t) => s + t.amount, 0)
  const currIncome = transactions.filter((t) => t.type === "income" && t.date.startsWith(curr)).reduce((s, t) => s + t.amount, 0)
  const currExpense = transactions.filter((t) => t.type === "expense" && t.date.startsWith(curr)).reduce((s, t) => s + t.amount, 0)

  const pct = (curr: number, prev: number) => (prev > 0 ? ((curr - prev) / prev) * 100 : 0)

  const prevSavingsRate = prevIncome > 0 ? ((prevIncome - prevExpense) / prevIncome) * 100 : 0
  const currSavingsRate = currIncome > 0 ? ((currIncome - currExpense) / currIncome) * 100 : 0

  return {
    incomeChange: pct(currIncome, prevIncome),
    expenseChange: pct(currExpense, prevExpense),
    balanceChange: pct(currIncome - currExpense, prevIncome - prevExpense),
    savingsRateChange: currSavingsRate - prevSavingsRate,
  }
}

/** Compute actual day span from transactions for average daily calculations */
export function computeDaySpan(transactions: Transaction[]): number {
  if (transactions.length === 0) return 1
  const dates = transactions.map((t) => t.date).sort()
  const first = new Date(dates[0])
  const last = new Date(dates[dates.length - 1])
  const days = Math.max(1, Math.round((last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)) + 1)
  return days
}
