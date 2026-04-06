import { type Variants, type Transition } from "framer-motion"

// ─── Transitions ──────────────────────────────────────────────────────────────

export const springTransition: Transition = {
  type: "spring",
  stiffness: 350,
  damping: 30,
}

export const easeTransition: Transition = {
  type: "tween",
  ease: [0.25, 0.46, 0.45, 0.94],
  duration: 0.4,
}

// ─── Reusable Variants ────────────────────────────────────────────────────────

/** Fade in with upward slide — cards, sections, pages */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: easeTransition },
}

/** Parent container that staggers children reveals */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

/** Scale in from slightly smaller — dialogs, badges, popovers */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: springTransition },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
}

/** Slide in from left — table rows */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: easeTransition },
  exit: { opacity: 0, x: 16, transition: { duration: 0.2 } },
}

/** Simple opacity fade — charts, overlays */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

/** Card hover lift effect */
export const cardHover = {
  y: -2,
  transition: springTransition,
} as const
