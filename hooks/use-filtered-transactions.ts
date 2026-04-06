"use client"

import { useMemo } from "react"
import { useFinanceStore } from "@/lib/store"
import type { Transaction } from "@/lib/types"
import { DEFAULT_FILTERS } from "@/lib/constants"

interface FilteredTransactionsReturn {
  filteredTransactions: Transaction[]
  totalIncome: number
  totalExpenses: number
  totalBalance: number
  filteredCount: number
  totalCount: number
  activeFilterCount: number
  isEmpty: boolean
}

export function useFilteredTransactions(): FilteredTransactionsReturn {
  const transactions = useFinanceStore((s) => s.transactions)
  const filters = useFinanceStore((s) => s.filters)
  const sortField = useFinanceStore((s) => s.sortField)
  const sortOrder = useFinanceStore((s) => s.sortOrder)

  // Aggregates from ALL transactions (unfiltered)
  const { totalIncome, totalExpenses, totalBalance } = useMemo(() => {
    let income = 0
    let expenses = 0
    for (const tx of transactions) {
      if (tx.type === "income") income += tx.amount
      else expenses += tx.amount
    }
    return { totalIncome: income, totalExpenses: expenses, totalBalance: income - expenses }
  }, [transactions])

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.search !== DEFAULT_FILTERS.search) count++
    if (filters.type !== DEFAULT_FILTERS.type) count++
    if (filters.category !== DEFAULT_FILTERS.category) count++
    if (filters.dateFrom !== DEFAULT_FILTERS.dateFrom) count++
    if (filters.dateTo !== DEFAULT_FILTERS.dateTo) count++
    return count
  }, [filters])

  // Filtered + sorted transactions
  const filteredTransactions = useMemo(() => {
    let result = [...transactions]

    // Search filter (description)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter((tx) =>
        tx.description.toLowerCase().includes(searchLower)
      )
    }

    // Type filter
    if (filters.type !== "all") {
      result = result.filter((tx) => tx.type === filters.type)
    }

    // Category filter
    if (filters.category !== "all") {
      result = result.filter((tx) => tx.category === filters.category)
    }

    // Date range
    if (filters.dateFrom) {
      result = result.filter((tx) => tx.date >= filters.dateFrom!)
    }
    if (filters.dateTo) {
      result = result.filter((tx) => tx.date <= filters.dateTo!)
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "date":
          comparison = a.date.localeCompare(b.date)
          // Secondary sort: by amount when dates equal
          if (comparison === 0) comparison = a.amount - b.amount
          break
        case "amount":
          comparison = a.amount - b.amount
          break
        case "category":
          comparison = a.category.localeCompare(b.category)
          break
      }
      return sortOrder === "desc" ? -comparison : comparison
    })

    return result
  }, [transactions, filters, sortField, sortOrder])

  return {
    filteredTransactions,
    totalIncome,
    totalExpenses,
    totalBalance,
    filteredCount: filteredTransactions.length,
    totalCount: transactions.length,
    activeFilterCount,
    isEmpty: filteredTransactions.length === 0,
  }
}
