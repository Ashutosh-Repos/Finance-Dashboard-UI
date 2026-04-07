import Link from "next/link"
import { HomeIcon, SearchXIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
            <SearchXIcon className="size-7 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter">404</h1>
            <h2 className="text-lg font-medium">Page not found</h2>
            <p className="text-sm text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>
          <Button asChild>
            <Link href="/" className="gap-2">
              <HomeIcon className="size-4" />
              Back to Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
