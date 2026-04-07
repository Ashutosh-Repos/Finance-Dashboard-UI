"use client"

import { useEffect } from "react"
import { AlertCircleIcon, RefreshCwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[Zorvyn Error]", error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8">
          <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircleIcon className="size-7 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Something went wrong</h2>
            <p className="text-sm text-muted-foreground">
              An unexpected error occurred. Your data is safe —
              try refreshing the page.
            </p>
            {error.digest && (
              <p className="font-mono text-xs text-muted-foreground/60">
                Error ID: {error.digest}
              </p>
            )}
          </div>
          <Button onClick={reset} variant="outline" className="gap-2">
            <RefreshCwIcon className="size-4" />
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
