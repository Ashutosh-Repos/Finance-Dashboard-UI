import { type Variants, type Transition } from "framer-motion"

// ─── Transitions ──────────────────────────────────────────────────────────────

/** Snappy spring — buttons, badges, quick interactions */
export const springSnap: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
  mass: 0.8,
}

/** Smooth spring — cards, panels, larger elements */
export const springSmooth: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 24,
  mass: 1,
}

/** Bouncy spring — celebratory elements, completion states */
export const springBouncy: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 15,
  mass: 0.8,
}

/** Ease out quart — polished deceleration for reveals */
export const easeOutQuart: Transition = {
  type: "tween",
  ease: [0.25, 1, 0.5, 1],
  duration: 0.5,
}


// ─── Page Transitions ─────────────────────────────────────────────────────────

/** Full page entrance — wraps page content */
export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      ...easeOutQuart,
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
}

// ─── Reusable Variants ────────────────────────────────────────────────────────

/** Fade in with upward slide + blur — cards, sections */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      ...easeOutQuart,
      duration: 0.55,
    },
  },
}

/** Parent container that staggers children reveals */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

/** Scale in from slightly smaller + blur — dialogs, popovers */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: springSmooth,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(2px)",
    transition: { duration: 0.18 },
  },
}

/** Slide in from left — table rows */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: -20, filter: "blur(2px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: easeOutQuart,
  },
  exit: {
    opacity: 0,
    x: 20,
    filter: "blur(2px)",
    transition: { duration: 0.2 },
  },
}

/** Simple opacity fade + blur — charts, overlays */
export const fadeIn: Variants = {
  hidden: { opacity: 0, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
  },
}

/** Fade in from below with scale — chart cards */
export const fadeInScale: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...easeOutQuart,
      duration: 0.55,
    },
  },
}

// ─── Hover Effects ────────────────────────────────────────────────────────────

/** Card hover — lift + subtle scale */
export const cardHover = {
  y: -4,
  scale: 1.015,
  transition: springSmooth,
} as const

/** Card tap — press feedback */
export const cardTap = {
  scale: 0.985,
  transition: { duration: 0.1 },
} as const

/** Icon hover — rotate + scale spring (used on stat card icons) */
export const iconHover = {
  rotate: 12,
  scale: 1.2,
  transition: { type: "spring" as const, stiffness: 300, damping: 15 },
} as const

// ─── Chart Animations ─────────────────────────────────────────────────────────

/** Recharts animation config for Area/Bar/Pie */
export const chartAnimationProps = {
  animationBegin: 200,
  animationDuration: 1200,
  animationEasing: "ease-out" as const,
}

/** Pie chart specific animation */
export const pieAnimationProps = {
  animationBegin: 300,
  animationDuration: 1000,
  animationEasing: "ease-out" as const,
}
