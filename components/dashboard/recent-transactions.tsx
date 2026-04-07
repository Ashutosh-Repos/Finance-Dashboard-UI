"use client"

import { useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRightIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useFinanceStore } from "@/lib/store"
import { formatCurrency, formatDate, getCategoryById } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { fadeIn, staggerContainer, fadeInUp } from "@/lib/motion"

export function RecentTransactions() {
  const transactions = useFinanceStore((s) => s.transactions)
  const isHydrated = useFinanceStore((s) => s.isHydrated)

  const recent = useMemo(() => {
    return [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5)
  }, [transactions])

  if (!isHydrated) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-44" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/transactions">
              View all
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No transactions yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <motion.tbody role="rowgroup" variants={staggerContainer} initial="hidden" animate="visible">
                {recent.map((tx) => {
                  const cat = getCategoryById(tx.category)
                  return (
                    <motion.tr
                      key={tx.id}
                      role="row"
                      variants={fadeInUp}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="text-muted-foreground">
                        {formatDate(tx.date)}
                      </TableCell>
                      <TableCell className="font-medium truncate max-w-[200px]">
                        {tx.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{cat?.label ?? tx.category}</Badge>
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-medium",
                          tx.type === "income" ? "text-success" : "text-destructive"
                        )}
                      >
                        {tx.type === "income" ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </TableCell>
                    </motion.tr>
                  )
                })}
              </motion.tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
