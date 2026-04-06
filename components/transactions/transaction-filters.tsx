"use client"

import { useEffect, useState } from "react"
import { SearchIcon, XIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useFinanceStore } from "@/lib/store"
import { CATEGORIES } from "@/lib/constants"
import { AnimatePresence, motion } from "framer-motion"
import { scaleIn } from "@/lib/motion"

interface TransactionFiltersProps {
  activeFilterCount: number
}

export function TransactionFilters({ activeFilterCount }: TransactionFiltersProps) {
  const filters = useFinanceStore((s) => s.filters)
  const setFilter = useFinanceStore((s) => s.setFilter)
  const resetFilters = useFinanceStore((s) => s.resetFilters)

  // Debounced search
  const [searchInput, setSearchInput] = useState(filters.search)
  useEffect(() => {
    const timer = setTimeout(() => setFilter("search", searchInput), 300)
    return () => clearTimeout(timer)
  }, [searchInput, setFilter])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-64">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.category}
          onValueChange={(v) => setFilter("category", v)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={filters.type}
          onValueChange={(v) => setFilter("type", v as "all" | "income" | "expense")}
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={filters.dateFrom ?? ""}
          onChange={(e) => setFilter("dateFrom", e.target.value || null)}
          className="w-full sm:w-40"
          placeholder="From"
        />

        <Input
          type="date"
          value={filters.dateTo ?? ""}
          onChange={(e) => setFilter("dateTo", e.target.value || null)}
          className="w-full sm:w-40"
          placeholder="To"
        />
      </div>

      <div className="flex items-center gap-2">
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-center gap-2"
            >
              <Badge variant="secondary">
                {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
              </Badge>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <XIcon data-icon="inline-start" />
                Clear all
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
