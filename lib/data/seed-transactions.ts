import type { Transaction } from "@/lib/types"

/**
 * ~35 realistic mock transactions spanning Jan–Jun 2026.
 * Designed to produce meaningful charts:
 * - Every category has 2+ transactions
 * - Income concentrated in salary + freelance
 * - Expense distribution shows clear patterns
 * - March has higher spending, April has freelance income spike
 */
export const SEED_TRANSACTIONS: Transaction[] = [
  // ─── January 2026 ─────────────────────────────────────────────────────────
  { id: "tx-001", date: "2026-01-05", description: "Salary - January", amount: 85000, type: "income", category: "salary" },
  { id: "tx-002", date: "2026-01-07", description: "Monthly Rent", amount: 15000, type: "expense", category: "housing" },
  { id: "tx-003", date: "2026-01-10", description: "Grocery - BigBasket", amount: 3200, type: "expense", category: "food" },
  { id: "tx-004", date: "2026-01-14", description: "Electricity Bill", amount: 1800, type: "expense", category: "utilities" },
  { id: "tx-005", date: "2026-01-18", description: "Uber Rides", amount: 1200, type: "expense", category: "transport" },
  { id: "tx-006", date: "2026-01-22", description: "Netflix Subscription", amount: 649, type: "expense", category: "entertainment" },

  // ─── February 2026 ────────────────────────────────────────────────────────
  { id: "tx-007", date: "2026-02-05", description: "Salary - February", amount: 85000, type: "income", category: "salary" },
  { id: "tx-008", date: "2026-02-07", description: "Monthly Rent", amount: 15000, type: "expense", category: "housing" },
  { id: "tx-009", date: "2026-02-09", description: "Swiggy Orders", amount: 2800, type: "expense", category: "food" },
  { id: "tx-010", date: "2026-02-12", description: "Amazon Purchase - Headphones", amount: 4500, type: "expense", category: "shopping" },
  { id: "tx-011", date: "2026-02-15", description: "Health Checkup", amount: 2500, type: "expense", category: "healthcare" },
  { id: "tx-012", date: "2026-02-20", description: "Metro Card Recharge", amount: 800, type: "expense", category: "transport" },

  // ─── March 2026 (higher spending month) ───────────────────────────────────
  { id: "tx-013", date: "2026-03-05", description: "Salary - March", amount: 85000, type: "income", category: "salary" },
  { id: "tx-014", date: "2026-03-07", description: "Monthly Rent", amount: 15000, type: "expense", category: "housing" },
  { id: "tx-015", date: "2026-03-08", description: "Grocery - DMart", amount: 4100, type: "expense", category: "food" },
  { id: "tx-016", date: "2026-03-11", description: "Flipkart - New Phone Case", amount: 1200, type: "expense", category: "shopping" },
  { id: "tx-017", date: "2026-03-14", description: "Movie Tickets - PVR", amount: 800, type: "expense", category: "entertainment" },
  { id: "tx-018", date: "2026-03-18", description: "Dentist Appointment", amount: 3500, type: "expense", category: "healthcare" },
  { id: "tx-019", date: "2026-03-22", description: "Ola Cab to Airport", amount: 1800, type: "expense", category: "transport" },
  { id: "tx-020", date: "2026-03-25", description: "Weekend Dining Out", amount: 3200, type: "expense", category: "food" },
  { id: "tx-021", date: "2026-03-28", description: "Internet Bill", amount: 999, type: "expense", category: "utilities" },

  // ─── April 2026 (freelance income spike) ──────────────────────────────────
  { id: "tx-022", date: "2026-04-05", description: "Salary - April", amount: 85000, type: "income", category: "salary" },
  { id: "tx-023", date: "2026-04-06", description: "Freelance - Web Project", amount: 35000, type: "income", category: "freelance" },
  { id: "tx-024", date: "2026-04-07", description: "Monthly Rent", amount: 15000, type: "expense", category: "housing" },
  { id: "tx-025", date: "2026-04-10", description: "Grocery - Zepto", amount: 2600, type: "expense", category: "food" },
  { id: "tx-026", date: "2026-04-15", description: "Electricity + Water Bill", amount: 2200, type: "expense", category: "utilities" },
  { id: "tx-027", date: "2026-04-20", description: "Spotify Annual Plan", amount: 1189, type: "expense", category: "entertainment" },

  // ─── May 2026 ─────────────────────────────────────────────────────────────
  { id: "tx-028", date: "2026-05-05", description: "Salary - May", amount: 85000, type: "income", category: "salary" },
  { id: "tx-029", date: "2026-05-07", description: "Monthly Rent", amount: 15000, type: "expense", category: "housing" },
  { id: "tx-030", date: "2026-05-10", description: "Myntra - Clothes", amount: 5800, type: "expense", category: "shopping" },
  { id: "tx-031", date: "2026-05-14", description: "Grocery - BigBasket", amount: 3400, type: "expense", category: "food" },
  { id: "tx-032", date: "2026-05-18", description: "Cab Rides - Weekly", amount: 1500, type: "expense", category: "transport" },
  { id: "tx-033", date: "2026-05-25", description: "Mutual Fund Returns", amount: 12000, type: "income", category: "investment" },

  // ─── June 2026 ────────────────────────────────────────────────────────────
  { id: "tx-034", date: "2026-06-05", description: "Salary - June", amount: 85000, type: "income", category: "salary" },
  { id: "tx-035", date: "2026-06-07", description: "Monthly Rent", amount: 15000, type: "expense", category: "housing" },
  { id: "tx-036", date: "2026-06-10", description: "Grocery - Blinkit", amount: 2900, type: "expense", category: "food" },
  { id: "tx-037", date: "2026-06-15", description: "Freelance - Logo Design", amount: 15000, type: "income", category: "freelance" },
  { id: "tx-038", date: "2026-06-20", description: "Gas Bill", amount: 750, type: "expense", category: "utilities" },
]
