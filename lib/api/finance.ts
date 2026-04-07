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
  tx: Omit<Transaction, "id">
): Promise<ApiResponse<Transaction>> {
  await delay(300)

  if (!tx.description.trim()) {
    return { success: false, error: "Description is required" }
  }
  if (tx.amount <= 0) {
    return { success: false, error: "Amount must be positive" }
  }

  // Simulate server-side ID generation
  const created: Transaction = { ...tx, id: crypto.randomUUID() }
  return { success: true, data: created }
}

export async function updateTransaction(
  id: string,
  updates: Partial<Omit<Transaction, "id">>
): Promise<ApiResponse<Partial<Omit<Transaction, "id">>>> {
  await delay(300)
  return { success: true, data: updates }
}

export async function removeTransaction(
  id: string
): Promise<ApiResponse> {
  await delay(200)
  return { success: true }
}
