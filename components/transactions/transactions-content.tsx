"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useFinanceStore } from "@/lib/store"
import { useFilteredTransactions } from "@/hooks/use-filtered-transactions"
import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { TransactionTable } from "@/components/transactions/transaction-table"
import { TransactionDialog } from "@/components/transactions/transaction-dialog"
import { ExportButton } from "@/components/transactions/export-button"
import { fadeInUp } from "@/lib/motion"

export function TransactionsContent() {
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
    <>
      <motion.div variants={fadeInUp} className="flex items-center gap-2 justify-end">
        <ExportButton transactions={filteredTransactions} />
        {isAdmin && (
          <Button onClick={() => setAddDialogOpen(true)}>
            <PlusIcon data-icon="inline-start" />
            Add Transaction
          </Button>
        )}
      </motion.div>

      <motion.div variants={fadeInUp}>
        <TransactionFilters activeFilterCount={activeFilterCount} />
      </motion.div>

      <motion.div variants={fadeInUp}>
        <TransactionTable
          transactions={filteredTransactions}
          filteredCount={filteredCount}
          totalCount={totalCount}
          isEmpty={isEmpty}
        />
      </motion.div>

      {isAdmin && (
        <TransactionDialog
          mode="add"
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
        />
      )}
    </>
  )
}
