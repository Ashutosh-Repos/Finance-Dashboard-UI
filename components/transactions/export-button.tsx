"use client"

import { FileSpreadsheetIcon, FileJsonIcon, DownloadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useExport } from "@/hooks/use-export"
import { toast } from "sonner"
import type { Transaction } from "@/lib/types"

interface ExportButtonProps {
  transactions: Transaction[]
}

export function ExportButton({ transactions }: ExportButtonProps) {
  const { exportCSV, exportJSON } = useExport()

  function handleCSV() {
    exportCSV(transactions)
    toast.success(`Exported ${transactions.length} transactions as CSV`)
  }

  function handleJSON() {
    exportJSON(transactions)
    toast.success(`Exported ${transactions.length} transactions as JSON`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <DownloadIcon data-icon="inline-start" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleCSV}>
            <FileSpreadsheetIcon />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleJSON}>
            <FileJsonIcon />
            Export as JSON
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
