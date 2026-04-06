"use client"

import { useEffect, useRef } from "react"
import {
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion"

interface UseAnimatedNumberOptions {
  value: number
  duration?: number
  formatFn?: (value: number) => string
}

/**
 * Smoothly animates a number from 0 to target using Framer Motion springs.
 * Returns a MotionValue<string> for use with motion.span.
 * Respects prefers-reduced-motion for accessibility.
 */
export function useAnimatedNumber({
  value,
  duration = 1.2,
  formatFn = (v) => Math.round(v).toLocaleString("en-IN"),
}: UseAnimatedNumberOptions): MotionValue<string> {
  const prefersReducedMotion = useReducedMotion()
  const prevValue = useRef(0)

  const spring = useSpring(prefersReducedMotion ? value : 0, {
    stiffness: 75,
    damping: 30,
    duration: prefersReducedMotion ? 0 : duration,
  })

  const display = useTransform(spring, (current) => formatFn(current))

  useEffect(() => {
    spring.set(value)
    prevValue.current = value
  }, [spring, value])

  return display
}
