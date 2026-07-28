import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface MagneticProps {
  children: ReactNode
  /** How strongly the button pulls toward the cursor (0–1). */
  strength?: number
  /** Invisible padding around the button that acts as the sensing area. */
  range?: number
  className?: string
}

/**
 * Wraps any element so it pulls toward the cursor when nearby.
 *
 * Pattern:
 *  - useMotionValue holds reactive numbers WITHOUT triggering re-renders
 *    (a normal useState here would re-render on every mousemove, ~60fps).
 *  - useSpring smooths those raw values into physical motion.
 *  - An invisible padded wrapper is the actual mousemove sensor; the inner
 *    motion.div is what visually translates. That's why the magnet "reaches"
 *    out past the button's visible bounds.
 */
export function Magnetic({
  children,
  strength = 0.28,
  range = 24,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 20, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 20, mass: 0.4 })

  return (
    <div
      ref={ref}
      className={className}
      style={{ padding: range, margin: -range, display: 'inline-block' }}
      onMouseMove={(e) => {
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        x.set((e.clientX - cx) * strength)
        y.set((e.clientY - cy) * strength)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      <motion.div style={{ x: sx, y: sy, display: 'inline-block' }}>{children}</motion.div>
    </div>
  )
}
