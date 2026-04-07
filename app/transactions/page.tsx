import type { Metadata } from "next"
import { PageTransition, AnimatedSection } from "@/components/motion/page-transition"
import { LazyTransactionsContent } from "@/components/transactions/lazy"

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Transactions",
  description:
    "Browse, filter, sort, and manage all your income and expense transactions. Export to CSV.",
  openGraph: {
    title: "Transactions | Zorvyn Finance",
    description: "Manage and explore your financial transactions.",
    type: "website",
  },
}

// ─── Server Component Page ────────────────────────────────────────────────────

export default function TransactionsPage() {
  return (
    <PageTransition>
      {/* Server-rendered heading — zero JS, instant HTML */}
      <AnimatedSection>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-sm text-muted-foreground">
          Manage and explore your financial transactions.
        </p>
      </AnimatedSection>

      <LazyTransactionsContent />
    </PageTransition>
  )
}
