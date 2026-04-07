"use client"

import { useCallback, useState } from "react"
import type { Transaction } from "@/lib/types"
import { CATEGORY_MAP } from "@/lib/constants"

function getDownloadFilename(format: "csv" | "json"): string {
  const date = new Date().toISOString().slice(0, 10)
  return `zorvyn-transactions-${date}.${format}`
}

function generateCSV(transactions: Transaction[]): string {
  const headers = ["Date", "Description", "Amount", "Type", "Category"]
  const rows = transactions.map((tx) => {
    const cat = CATEGORY_MAP[tx.category]
    return [
      tx.date,
      `"${tx.description.replace(/"/g, '""')}"`, // Escape quotes
      tx.type === "expense" ? -tx.amount : tx.amount,
      tx.type,
      cat?.label ?? tx.category,
    ].join(",")
  })

  // BOM for Excel UTF-8 compatibility
  return "\uFEFF" + [headers.join(","), ...rows].join("\n")
}

function generateJSON(transactions: Transaction[]): string {
  const enriched = transactions.map((tx) => {
    const cat = CATEGORY_MAP[tx.category]
    return {
      ...tx,
      categoryLabel: cat?.label ?? tx.category,
      signedAmount: tx.type === "expense" ? -tx.amount : tx.amount,
    }
  })
  return JSON.stringify(enriched, null, 2)
}

function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

interface UseExportReturn {
  exportCSV: (transactions: Transaction[]) => void
  exportJSON: (transactions: Transaction[]) => void
  isExporting: boolean
}

export function useExport(): UseExportReturn {
  const [isExporting, setIsExporting] = useState(false)

  const exportCSV = useCallback((transactions: Transaction[]) => {
    setIsExporting(true)
    try {
      const csv = generateCSV(transactions)
      triggerDownload(csv, getDownloadFilename("csv"), "text/csv;charset=utf-8;")
    } finally {
      setIsExporting(false)
    }
  }, [])

  const exportJSON = useCallback((transactions: Transaction[]) => {
    setIsExporting(true)
    try {
      const json = generateJSON(transactions)
      triggerDownload(json, getDownloadFilename("json"), "application/json")
    } finally {
      setIsExporting(false)
    }
  }, [])

  return { exportCSV, exportJSON, isExporting }
}
