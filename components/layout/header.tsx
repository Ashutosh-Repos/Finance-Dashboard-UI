"use client"

import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { RoleSwitcher } from "@/components/layout/role-switcher"

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
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb className="flex-1">
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
      <RoleSwitcher />
    </header>
  )
}
