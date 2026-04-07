"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { FinanceStore, Filters, SortField } from "@/lib/types"
import { DEFAULT_FILTERS } from "@/lib/constants"
import { SEED_TRANSACTIONS } from "@/lib/data/seed-transactions"

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set, get) => ({
      // ─── State ──────────────────────────────────────────────────────────────
      transactions: SEED_TRANSACTIONS,
      filters: { ...DEFAULT_FILTERS },
      role: "admin",
      sortField: "date" as SortField,
      sortOrder: "desc",
      isHydrated: false,

      // ─── Actions ────────────────────────────────────────────────────────────

      setRole: (role) => set({ role }),

      setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),

      resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),

      setSort: (field) =>
        set((state) => ({
          sortField: field,
          sortOrder:
            state.sortField === field
              ? state.sortOrder === "desc"
                ? "asc"
                : "desc"
              : "desc",
        })),

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [tx, ...state.transactions],
        })),

      editTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates } : tx
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        })),

      resetToSeedData: () =>
        set({
          transactions: SEED_TRANSACTIONS,
          filters: { ...DEFAULT_FILTERS },
          sortField: "date",
          sortOrder: "desc",
        }),
    }),
    {
      name: "zorvyn-finance-v1",
      // Only persist transactions and role — filters/sort are session-only
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true
        }
      },
    }
  )
)
