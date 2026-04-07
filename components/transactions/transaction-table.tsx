"use client"

import { useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowUpDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
  SearchIcon,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { useFinanceStore } from "@/lib/store"
import { formatCurrency, formatDate, getCategoryById } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { slideInRight } from "@/lib/motion"
import type { Transaction, SortField } from "@/lib/types"
import { TransactionDialog } from "@/components/transactions/transaction-dialog"
import { removeTransaction } from "@/lib/api/finance"
import { toast } from "sonner"

interface TransactionTableProps {
  transactions: Transaction[]
  filteredCount: number
  totalCount: number
  isEmpty: boolean
}

function SortIcon({ field, currentField, currentOrder }: { field: SortField; currentField: SortField; currentOrder: "asc" | "desc" }) {
  if (field !== currentField) return <ArrowUpDownIcon className="size-3 text-muted-foreground" />
  return currentOrder === "desc"
    ? <ArrowDownIcon className="size-3" />
    : <ArrowUpIcon className="size-3" />
}

export function TransactionTable({ transactions, filteredCount, totalCount, isEmpty }: TransactionTableProps) {
  const role = useFinanceStore((s) => s.role)
  const sortField = useFinanceStore((s) => s.sortField)
  const sortOrder = useFinanceStore((s) => s.sortOrder)
  const setSort = useFinanceStore((s) => s.setSort)
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction)
  const resetFilters = useFinanceStore((s) => s.resetFilters)

  const [editingTx, setEditingTx] = useState<Transaction | null>(null)
  const isAdmin = role === "admin"

  const handleSort = useCallback((field: SortField) => {
    setSort(field)
  }, [setSort])

  const handleDelete = useCallback(async (tx: Transaction) => {
    const result = await removeTransaction(tx.id)
    if (result.success) {
      deleteTransaction(tx.id)
      toast.success(`Deleted "${tx.description}"`)
    } else {
      toast.error("Failed to delete transaction")
    }
  }, [deleteTransaction])

  if (isEmpty) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon"><SearchIcon /></EmptyMedia>
          <EmptyTitle>No transactions found</EmptyTitle>
          <EmptyDescription>Try adjusting your filters or search query.</EmptyDescription>
        </EmptyHeader>
        <Button variant="outline" onClick={resetFilters}>Clear filters</Button>
      </Empty>
    )
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("date")} className="-ml-3 gap-1">
                  Date <SortIcon field="date" currentField={sortField} currentOrder={sortOrder} />
                </Button>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("amount")} className="-ml-3 gap-1">
                  Amount <SortIcon field="amount" currentField={sortField} currentOrder={sortOrder} />
                </Button>
              </TableHead>
              <TableHead>Type</TableHead>
              {isAdmin && <TableHead className="w-12">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {transactions.map((tx) => {
                const cat = getCategoryById(tx.category)
                return (
                  <motion.tr
                    key={tx.id}
                    role="row"
                    variants={slideInRight}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="text-muted-foreground">{formatDate(tx.date)}</TableCell>
                    <TableCell className="font-medium truncate max-w-[250px]">{tx.description}</TableCell>
                    <TableCell><Badge variant="secondary">{cat?.label ?? tx.category}</Badge></TableCell>
                    <TableCell className={cn("font-medium", tx.type === "income" ? "text-success" : "text-destructive")}>
                      {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={tx.type === "income" ? "default" : "secondary"}>
                        {tx.type === "income" ? "Income" : "Expense"}
                      </Badge>
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontalIcon />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuItem onClick={() => setEditingTx(tx)}>
                                <PencilIcon /> Edit
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                    <TrashIcon /> Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete &ldquo;{tx.description}&rdquo;. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(tx)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        Showing {filteredCount} of {totalCount} transactions
      </p>

      {editingTx && (
        <TransactionDialog
          mode="edit"
          transaction={editingTx}
          open={!!editingTx}
          onOpenChange={(open) => !open && setEditingTx(null)}
        />
      )}
    </>
  )
}
