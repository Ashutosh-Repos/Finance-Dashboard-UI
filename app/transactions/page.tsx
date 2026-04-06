"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFinanceStore } from "@/lib/store"
import { useFilteredTransactions } from "@/hooks/use-filtered-transactions"
import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { TransactionTable } from "@/components/transactions/transaction-table"
import { TransactionDialog } from "@/components/transactions/transaction-dialog"
import { ExportButton } from "@/components/transactions/export-button"

export default function TransactionsPage() {
  const role = useFinanceStore((s) => s.role)
  const {
    filteredTransactions,
    filteredCount,
    totalCount,
    activeFilterCount,
    isEmpty,
  } = useFilteredTransactions()

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const isAdmin = role === "admin"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground">
            Manage and explore your financial transactions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton transactions={filteredTransactions} />
          {isAdmin && (
            <Button onClick={() => setAddDialogOpen(true)}>
              <PlusIcon data-icon="inline-start" />
              Add Transaction
            </Button>
          )}
        </div>
      </div>

      <TransactionFilters activeFilterCount={activeFilterCount} />

      <TransactionTable
        transactions={filteredTransactions}
        filteredCount={filteredCount}
        totalCount={totalCount}
        isEmpty={isEmpty}
      />

      {isAdmin && (
        <TransactionDialog
          mode="add"
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
        />
      )}
    </div>
  )
}
