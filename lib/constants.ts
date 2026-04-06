import {
  HomeIcon,
  UtensilsIcon,
  CarIcon,
  ShoppingBagIcon,
  FilmIcon,
  ZapIcon,
  HeartPulseIcon,
  BanknoteIcon,
  BriefcaseIcon,
  TrendingUpIcon,
} from "lucide-react"
import type { CategoryDef, Filters } from "@/lib/types"

// ─── Categories ───────────────────────────────────────────────────────────────

export const CATEGORIES = [
  { id: "housing", label: "Housing", icon: HomeIcon },
  { id: "food", label: "Food & Dining", icon: UtensilsIcon },
  { id: "transport", label: "Transportation", icon: CarIcon },
  { id: "shopping", label: "Shopping", icon: ShoppingBagIcon },
  { id: "entertainment", label: "Entertainment", icon: FilmIcon },
  { id: "utilities", label: "Utilities", icon: ZapIcon },
  { id: "healthcare", label: "Healthcare", icon: HeartPulseIcon },
  { id: "salary", label: "Salary", icon: BanknoteIcon },
  { id: "freelance", label: "Freelance", icon: BriefcaseIcon },
  { id: "investment", label: "Investment", icon: TrendingUpIcon },
] as const satisfies readonly CategoryDef[]

export type CategoryId = (typeof CATEGORIES)[number]["id"]

// ─── Formatters ───────────────────────────────────────────────────────────────

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount)
}

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

export function formatDate(isoString: string): string {
  return dateFormatter.format(new Date(isoString))
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_FILTERS: Filters = {
  search: "",
  type: "all",
  category: "all",
  dateFrom: null,
  dateTo: null,
} as const

export const SAVINGS_GOAL_MONTHLY = 50_000

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getCategoryById(id: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.id === id)
}
