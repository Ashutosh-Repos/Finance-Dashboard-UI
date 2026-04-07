"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { LoaderIcon } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { useFinanceStore } from "@/lib/store"
import { CATEGORIES } from "@/lib/constants"
import type { TransactionDialogProps, TransactionType } from "@/lib/types"
import { createTransaction, updateTransaction } from "@/lib/api/finance"

export function TransactionDialog({ mode, transaction, open, onOpenChange }: TransactionDialogProps) {
  const isEdit = mode === "edit"

  const addTransaction = useFinanceStore((s) => s.addTransaction)
  const editTransaction = useFinanceStore((s) => s.editTransaction)

  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<TransactionType>("expense")
  const [category, setCategory] = useState("food")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  // Reset form state when dialog opens or transaction changes
  useEffect(() => {
    if (open) {
      const initial = isEdit ? transaction : null
      setDescription(initial?.description ?? "")
      setAmount(initial?.amount?.toString() ?? "")
      setType(initial?.type ?? "expense")
      setCategory(initial?.category ?? "food")
      setDate(initial?.date ?? new Date().toISOString().slice(0, 10))
      setErrors({})
      setIsSubmitting(false)
    }
  }, [open, transaction, isEdit])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const newErrors: Record<string, boolean> = {}
    if (!description.trim()) newErrors.description = true
    if (!amount || Number(amount) <= 0) newErrors.amount = true
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    const txData = {
      description: description.trim(),
      amount: Number(amount),
      type,
      category,
      date,
    }

    if (isEdit && transaction) {
      const result = await updateTransaction(transaction.id, txData)
      if (result.success) {
        editTransaction(transaction.id, txData)
        toast.success("Transaction updated")
        onOpenChange(false)
      }
    } else {
      const result = await createTransaction(txData)
      if (result.success && result.data) {
        addTransaction(txData)
        toast.success("Transaction added")
        onOpenChange(false)
      } else {
        toast.error(result.error ?? "Failed to add transaction")
      }
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the details below." : "Enter the transaction details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field data-invalid={errors.description || undefined}>
              <FieldLabel htmlFor="tx-description">Description</FieldLabel>
              <Input
                id="tx-description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  setErrors((prev) => ({ ...prev, description: false }))
                }}
                aria-invalid={errors.description || undefined}
                placeholder="e.g., Monthly Rent"
                disabled={isSubmitting}
              />
            </Field>

            <Field data-invalid={errors.amount || undefined}>
              <FieldLabel htmlFor="tx-amount">Amount (₹)</FieldLabel>
              <Input
                id="tx-amount"
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value)
                  setErrors((prev) => ({ ...prev, amount: false }))
                }}
                aria-invalid={errors.amount || undefined}
                placeholder="e.g., 15000"
                disabled={isSubmitting}
              />
            </Field>

            <Field>
              <FieldLabel>Type</FieldLabel>
              <ToggleGroup
                type="single"
                value={type}
                onValueChange={(v) => v && setType(v as TransactionType)}
                className="justify-start"
                disabled={isSubmitting}
              >
                <ToggleGroupItem value="expense">Expense</ToggleGroupItem>
                <ToggleGroupItem value="income">Income</ToggleGroupItem>
              </ToggleGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="tx-category">Category</FieldLabel>
              <Select value={category} onValueChange={setCategory} disabled={isSubmitting}>
                <SelectTrigger id="tx-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="tx-date">Date</FieldLabel>
              <Input
                id="tx-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isSubmitting}
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <LoaderIcon className="animate-spin" />}
              {isSubmitting ? "Saving..." : isEdit ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
