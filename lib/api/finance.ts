import type { Transaction } from "@/lib/types"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

interface ApiResponse<T = void> {
  success: boolean
  data?: T
  error?: string
}

// ─── Mock API Functions ───────────────────────────────────────────────────────

export async function fetchTransactions(
  transactions: Transaction[]
): Promise<ApiResponse<Transaction[]>> {
  await delay(400)
  return { success: true, data: transactions }
}

export async function createTransaction(
  tx: Omit<Transaction, "id">,
  addFn: (tx: Omit<Transaction, "id">) => void
): Promise<ApiResponse> {
  await delay(300)

  if (!tx.description.trim()) {
    return { success: false, error: "Description is required" }
  }
  if (tx.amount <= 0) {
    return { success: false, error: "Amount must be positive" }
  }

  addFn(tx)
  return { success: true }
}

export async function updateTransaction(
  id: string,
  updates: Partial<Omit<Transaction, "id">>,
  editFn: (id: string, updates: Partial<Omit<Transaction, "id">>) => void
): Promise<ApiResponse> {
  await delay(300)
  editFn(id, updates)
  return { success: true }
}

export async function removeTransaction(
  id: string,
  deleteFn: (id: string) => void
): Promise<ApiResponse> {
  await delay(200)
  deleteFn(id)
  return { success: true }
}
