"use client"

import { motion } from "framer-motion"
import { pageEnter, fadeInUp } from "@/lib/motion"

/**
 * Client-side page transition wrapper.
 * Server Components can be passed as children — they'll
 * still be server-rendered and streamed as HTML.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={pageEnter}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}

/** Animated section within a page transition */
export function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div variants={fadeInUp} className={className}>
      {children}
    </motion.div>
  )
}
