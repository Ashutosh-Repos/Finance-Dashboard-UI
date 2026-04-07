"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import {
  LayoutDashboardIcon,
  ArrowLeftRightIcon,
  TrendingUpIcon,
  ArrowLeftIcon,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { springSmooth } from "@/lib/motion"

// ─── Nav Config ───────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { title: "Dashboard", href: "/", icon: LayoutDashboardIcon },
  { title: "Transactions", href: "/transactions", icon: ArrowLeftRightIcon },
  { title: "Insights", href: "/insights", icon: TrendingUpIcon },
] as const

// ─── Dock ─────────────────────────────────────────────────────────────────────

export function NavigationDock() {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()

  return (
    <aside
      className={cn(
        // Shared
        "fixed z-50 flex items-center bg-background/80 backdrop-blur-xl border-border/10",
        // Mobile (default): horizontal bar at the bottom
        "bottom-0 left-0 right-0 h-14 flex-row justify-center border-t",
        // iPhone safe area
        "pb-[env(safe-area-inset-bottom)]",
        // Desktop (sm+): vertical strip on the left
        "sm:top-0 sm:bottom-0 sm:right-auto sm:h-screen sm:w-16 sm:flex-col sm:justify-center sm:border-t-0 sm:border-r sm:py-6 sm:pb-0"
      )}
    >
      <nav className="flex w-full items-center justify-evenly gap-1 sm:flex-col sm:justify-start sm:gap-2 sm:px-2">
        {NAV_LINKS.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center justify-center rounded-xl transition-all duration-300",
                    "size-10 sm:size-11",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <motion.div
                    whileHover={
                      prefersReducedMotion
                        ? undefined
                        : { scale: 1.15 }
                    }
                    whileTap={
                      prefersReducedMotion
                        ? undefined
                        : { scale: 0.92 }
                    }
                    transition={springSmooth}
                  >
                    <Icon className={cn("size-[18px]", isActive && "stroke-[2.5px]")} />
                  </motion.div>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={16}
                className="px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase shadow-xl max-sm:hidden"
              >
                {item.title}
              </TooltipContent>
            </Tooltip>
          )
        })}

        {/* Back button — hidden on home */}
        <BackButton />
      </nav>
    </aside>
  )
}

// ─── Back Button ──────────────────────────────────────────────────────────────

function BackButton() {
  const router = useRouter()
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()

  if (pathname === "/") return null

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleBack}
          className="flex items-center justify-center rounded-xl text-muted-foreground/60 transition-all hover:bg-muted hover:text-foreground size-10 sm:size-11 sm:mt-1"
        >
          <motion.div
            whileHover={
              prefersReducedMotion ? undefined : { x: -2, scale: 1.1 }
            }
            whileTap={
              prefersReducedMotion ? undefined : { scale: 0.9 }
            }
            transition={springSmooth}
          >
            <ArrowLeftIcon className="size-[18px]" />
          </motion.div>
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={16}
        className="px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase shadow-xl max-sm:hidden"
      >
        Go Back
      </TooltipContent>
    </Tooltip>
  )
}
