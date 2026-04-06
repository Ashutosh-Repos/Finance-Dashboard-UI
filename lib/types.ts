export type Role = "admin" | "viewer"
export type TransactionType = "income" | "expense"
export type SortField = "date" | "amount" | "category"
export type SortOrder = "asc" | "desc"

export interface Transaction {
  id: string
  date: string // ISO 8601 date string (YYYY-MM-DD)
  description: string
  amount: number // always positive — type determines sign
  type: TransactionType
  category: string // matches CategoryDef.id
}

export interface CategoryDef {
  id: string
  label: string
  icon: React.ComponentType
}

export interface Filters {
  search: string
  type: TransactionType | "all"
  category: string | "all"
  dateFrom: string | null
  dateTo: string | null
}

export interface FinanceStore {
  // --- State ---
  transactions: Transaction[]
  filters: Filters
  role: Role
  sortField: SortField
  sortOrder: SortOrder
  isHydrated: boolean

  // --- Actions ---
  setRole: (role: Role) => void
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void
  resetFilters: () => void
  setSort: (field: SortField) => void
  addTransaction: (tx: Omit<Transaction, "id">) => void
  editTransaction: (id: string, updates: Partial<Omit<Transaction, "id">>) => void
  deleteTransaction: (id: string) => void
  resetToSeedData: () => void
}

// --- Component Props ---

export interface TransactionDialogProps {
  mode: "add" | "edit"
  transaction?: Transaction
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface TransactionFiltersProps {
  activeFilterCount: number
}

export interface ExportButtonProps {
  transactions: Transaction[]
}
