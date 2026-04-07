"use client"

import { useMemo } from "react"
import { useFinanceStore } from "@/lib/store"

interface TransactionTotals {
  totalIncome: number
  totalExpenses: number
  totalBalance: number
}

/**
 * Lightweight hook for all-time totals — independent of filters/sort.
 * Use this on Dashboard instead of useFilteredTransactions to avoid
 * unnecessary recomputation when filter state changes.
 */
export function useTransactionTotals(): TransactionTotals {
  const transactions = useFinanceStore((s) => s.transactions)

  return useMemo(() => {
    let income = 0
    let expenses = 0
    for (const tx of transactions) {
      if (tx.type === "income") income += tx.amount
      else expenses += tx.amount
    }
    return { totalIncome: income, totalExpenses: expenses, totalBalance: income - expenses }
  }, [transactions])
}
