"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { IndianRupeeIcon } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { RoleSwitcher } from "@/components/layout/role-switcher"
import { ResetDataButton } from "@/components/layout/reset-data-button"
import { ModeToggle } from "@/components/ui/theme-toggle"

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/transactions": "Transactions",
  "/insights": "Insights",
}

export function Header() {
  const pathname = usePathname()
  const pageTitle = PAGE_TITLES[pathname] ?? "Dashboard"
  const isHome = pathname === "/"

  return (
    <div className="shrink-0">
      {/* ─── Top Bar: Logo + Actions ─────────────────────────────────────── */}
      <header className="flex h-14 items-center gap-3 border-b border-border/50 px-4">
        {/* Zorvyn Logo */}
        <Link href="/" className="flex items-center gap-2.5 mr-auto">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <IndianRupeeIcon className="size-4" />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold leading-tight">Zorvyn</div>
            <div className="text-[11px] leading-tight text-muted-foreground">
              Finance Dashboard
            </div>
          </div>
        </Link>

        {/* Actions */}
        <ModeToggle />
        <ResetDataButton />
        <RoleSwitcher />
      </header>

      {/* ─── Breadcrumb Bar ──────────────────────────────────────────────── */}
      <div className="flex h-10 items-center border-b border-border/30 px-4">
        <Breadcrumb>
          <BreadcrumbList>
            {!isHome && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  )
}
