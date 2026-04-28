import { useEffect, useRef } from 'react'

/**
 * Boids flocking field.
 *
 * Each boid follows three classic Reynolds rules against its local neighbors:
 *  - separation: steer away from boids that are too close (avoid collision)
 *  - alignment:  steer toward the average heading of nearby boids
 *  - cohesion:   steer toward the average position of nearby boids
 *
 * The cursor acts as a predator: boids within the flee radius steer hard
 * away from it, producing a "parting of the school" effect.
 *
 * Canvas, not DOM, because hundreds of moving sprites at 60fps are exactly
 * what canvas was made for; React would re-render itself out of memory.
 */

interface Boid {
  x: number
  y: number
  vx: number
  vy: number
  /** Smoothed heading. Avoids jittery flips when velocity is near zero. */
  angle: number
}

const COUNT = 110
const PERCEIVE = 55
const SEPARATE = 22
const FLEE_RADIUS = 130
const MAX_SPEED = 1.8
const MAX_FORCE = 0.045
// Always-alive floor — every boid keeps drifting. Without this, shelter
// boids would dampen to a halt and look dead.
const MIN_SPEED = 0.55

// Shelters — DOM elements with [data-boid-shelter] attract nearby boids.
// Boids slow down once they reach the rest band so they cluster instead
// of orbiting. The cursor's flee force naturally disperses them.
const SHELTER_REACH = 230
const SHELTER_REST = 35
const W_SHELTER = 0.7

// Orbital shelters — [data-boid-orbit] pulls boids into a constantly-moving
// ring around the element. Physics model: a radial spring keeps them on the
// ring while a tangential velocity setpoint keeps every orbiter moving at the
// SAME angular speed. Same angular speed = same relative spacing forever, so
// boids that arrive at different angles stay spread out organically instead
// of bunching at one or two spots.
const ORBIT_REACH = 220
const ORBIT_RADIUS = 62
const ORBIT_RADIAL_K = 0.025
const ORBIT_TANGENT_K = 0.09

// Behavior weights — tuning knobs.
const W_SEPARATION = 1.4
const W_ALIGNMENT = 0.95
const W_COHESION = 0.85
const W_FLEE = 2.6

export default function AmbientParticles() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const mouse = { x: -9999, y: -9999, active: false }
    let boids: Boid[] = []
    let raf = 0

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    const seed = () => {
      boids = Array.from({ length: COUNT }, () => {
        const angle = Math.random() * Math.PI * 2
        const speed = 0.5 + Math.random() * 1.0
        return {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          angle,
        }
      })
    }

    const onResize = () => {
      resize()
      seed()
    }

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.active = true
    }
    const onLeave = () => {
      mouse.active = false
    }

    const limit = (vx: number, vy: number, max: number) => {
      const speed = Math.hypot(vx, vy)
      if (speed > max) {
        return [(vx / speed) * max, (vy / speed) * max]
      }
      return [vx, vy]
    }

    const isDark = () => document.documentElement.classList.contains('dark')

    const tick = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      const fill = isDark() ? 'rgba(200, 210, 240, 0.7)' : 'rgba(40, 50, 90, 0.65)'
      const fleeFill = isDark() ? 'rgba(180, 160, 255, 0.95)' : 'rgba(110, 80, 230, 0.9)'

      // Snapshot active shelters this frame. Cheap for a handful of elements
      // and ensures positions track through scroll, magnetic pull, layout shifts.
      const shelterEls = document.querySelectorAll<HTMLElement>('[data-boid-shelter]')
      const shelters: Array<{ x: number; y: number }> = []
      shelterEls.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.bottom < 0 || r.top > h || r.right < 0 || r.left > w) return
        shelters.push({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
      })

      const orbitEls = document.querySelectorAll<HTMLElement>('[data-boid-orbit]')
      const orbits: Array<{ x: number; y: number }> = []
      orbitEls.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.bottom < 0 || r.top > h || r.right < 0 || r.left > w) return
        orbits.push({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
      })

      // Compute new accelerations from neighbor interactions
      const next: Array<{ ax: number; ay: number; alarm: number; orbiting: number }> = []
      for (let i = 0; i < boids.length; i++) {
        const b = boids[i]

        // Orbital influence first — orbiting boids skip cohesion (otherwise
        // the ring collapses into a knot). Two forces:
        //   - Radial spring drives them onto the orbit ring.
        //   - Tangential setpoint forces every orbiter to share the SAME
        //     angular speed → constant relative spacing forever.
        let orbiting = 0
        let orbitAx = 0
        let orbitAy = 0
        if (orbits.length > 0) {
          let oCx = 0, oCy = 0, oD = Infinity
          for (const o of orbits) {
            const dx = o.x - b.x
            const dy = o.y - b.y
            const d = Math.hypot(dx, dy)
            if (d < oD) {
              oD = d
              oCx = o.x
              oCy = o.y
            }
          }
          if (oD < ORBIT_REACH && oD > 0.5) {
            // Unit vector from boid → orbit center
            const rdx = (oCx - b.x) / oD
            const rdy = (oCy - b.y) / oD
            // Tangent (counterclockwise) is radial rotated 90° CCW
            const tdx = -rdy
            const tdy = rdx
            // Radial: error positive when too far from center, pulls inward
            const radialErr = oD - ORBIT_RADIUS
            orbitAx += rdx * radialErr * ORBIT_RADIAL_K
            orbitAy += rdy * radialErr * ORBIT_RADIAL_K
            // Tangent: drive current tangent-velocity component toward
            // MAX_SPEED. Boids at any angle end up sharing the same
            // angular velocity, which preserves spacing.
            const currentTangent = b.vx * tdx + b.vy * tdy
            const tangentDelta = MAX_SPEED - currentTangent
            orbitAx += tdx * tangentDelta * ORBIT_TANGENT_K
            orbitAy += tdy * tangentDelta * ORBIT_TANGENT_K
            orbiting = Math.max(0, 1 - oD / ORBIT_REACH)
          }
        }

        let sepX = 0, sepY = 0, sepN = 0
        let aliX = 0, aliY = 0, aliN = 0
        let cohX = 0, cohY = 0, cohN = 0

        for (let j = 0; j < boids.length; j++) {
          if (i === j) continue
          const o = boids[j]
          const dx = o.x - b.x
          const dy = o.y - b.y
          const d = Math.hypot(dx, dy)
          if (d > 0 && d < PERCEIVE) {
            // Alignment & cohesion use all perceived neighbors
            aliX += o.vx; aliY += o.vy; aliN++
            cohX += o.x; cohY += o.y; cohN++
            // Separation: weighted away from very close ones
            if (d < SEPARATE) {
              sepX -= dx / d
              sepY -= dy / d
              sepN++
            }
          }
        }

        let ax = orbitAx
        let ay = orbitAy

        // When fully orbiting, suppress cohesion (it would pull the ring
        // into a knot) and dampen alignment a touch. Separation stays full.
        const cohScale = 1 - orbiting
        const aliScale = 1 - orbiting * 0.5

        if (sepN > 0) {
          let [vx, vy] = [sepX / sepN, sepY / sepN]
          ;[vx, vy] = limit(vx * MAX_SPEED, vy * MAX_SPEED, MAX_SPEED)
          const fx = vx - b.vx
          const fy = vy - b.vy
          const [lx, ly] = limit(fx, fy, MAX_FORCE)
          ax += lx * W_SEPARATION
          ay += ly * W_SEPARATION
        }
        if (aliN > 0) {
          let vx = aliX / aliN
          let vy = aliY / aliN
          ;[vx, vy] = limit(vx, vy, MAX_SPEED)
          const fx = vx - b.vx
          const fy = vy - b.vy
          const [lx, ly] = limit(fx, fy, MAX_FORCE)
          ax += lx * W_ALIGNMENT * aliScale
          ay += ly * W_ALIGNMENT * aliScale
        }
        if (cohN > 0) {
          const cx = cohX / cohN
          const cy = cohY / cohN
          let vx = cx - b.x
          let vy = cy - b.y
          ;[vx, vy] = limit(vx, vy, MAX_SPEED)
          const fx = vx - b.vx
          const fy = vy - b.vy
          const [lx, ly] = limit(fx, fy, MAX_FORCE)
          ax += lx * W_COHESION * cohScale
          ay += ly * W_COHESION * cohScale
        }

        // Shelter attraction — soft pull toward the nearest in-viewport
        // shelter. Beyond SHELTER_REACH there's no influence at all.
        if (shelters.length > 0) {
          let nearestDx = 0
          let nearestDy = 0
          let nearestD = Infinity
          for (const s of shelters) {
            const dx = s.x - b.x
            const dy = s.y - b.y
            const d = Math.hypot(dx, dy)
            if (d < nearestD) {
              nearestD = d
              nearestDx = dx
              nearestDy = dy
            }
          }
          // Pull toward shelter, but never to a full stop — once near, the
          // attraction softens. Combined with MIN_SPEED enforcement below,
          // boids drift gently around the button instead of going still.
          if (nearestD < SHELTER_REACH && nearestD > SHELTER_REST) {
            const desiredX = (nearestDx / nearestD) * MAX_SPEED
            const desiredY = (nearestDy / nearestD) * MAX_SPEED
            const fx = desiredX - b.vx
            const fy = desiredY - b.vy
            const [lx, ly] = limit(fx, fy, MAX_FORCE)
            const pull = 1 - nearestD / SHELTER_REACH
            ax += lx * W_SHELTER * pull
            ay += ly * W_SHELTER * pull
          }
        }

        // Predator flee — strong steer away from cursor
        let alarm = 0
        if (mouse.active) {
          const dx = b.x - mouse.x
          const dy = b.y - mouse.y
          const d = Math.hypot(dx, dy)
          if (d < FLEE_RADIUS && d > 0) {
            const closeness = 1 - d / FLEE_RADIUS
            alarm = closeness
            const desiredX = (dx / d) * MAX_SPEED
            const desiredY = (dy / d) * MAX_SPEED
            const fx = desiredX - b.vx
            const fy = desiredY - b.vy
            const [lx, ly] = limit(fx, fy, MAX_FORCE * 4)
            ax += lx * W_FLEE * closeness
            ay += ly * W_FLEE * closeness
          }
        }

        next.push({ ax, ay, alarm, orbiting })
      }

      // Apply accelerations, integrate, draw
      for (let i = 0; i < boids.length; i++) {
        const b = boids[i]
        const n = next[i]
        b.vx += n.ax
        b.vy += n.ay
        ;[b.vx, b.vy] = limit(b.vx, b.vy, MAX_SPEED)

        // Always-alive: enforce a minimum speed. Without this, boids that
        // settle at shelters (or escape all forces near zero) just float in
        // place looking dead. With this they always drift like real fish.
        const liveSpd = Math.hypot(b.vx, b.vy)
        if (liveSpd < MIN_SPEED) {
          if (liveSpd < 0.001) {
            // Truly stalled — kick in a random direction
            const a = Math.random() * Math.PI * 2
            b.vx = Math.cos(a) * MIN_SPEED
            b.vy = Math.sin(a) * MIN_SPEED
          } else {
            const scale = MIN_SPEED / liveSpd
            b.vx *= scale
            b.vy *= scale
          }
        }

        b.x += b.vx
        b.y += b.vy

        // Wrap edges so the flock orbits forever — UNLESS this boid is
        // actively orbiting a shelter that sits near a screen edge. Wrapping
        // would teleport it out of orbit reach and break the ring; instead,
        // let it swing briefly off-screen and the radial spring pulls it back.
        if (n.orbiting < 0.05) {
          if (b.x < -10) b.x = w + 10
          else if (b.x > w + 10) b.x = -10
          if (b.y < -10) b.y = h + 10
          else if (b.y > h + 10) b.y = -10
        }

        // Update heading. Atan2 is unstable when velocity is near zero — tiny
        // numerical noise spins boids randomly. So: only retarget when moving
        // meaningfully, and always interpolate (shortest-arc) toward the target
        // so direction changes look like a turn, not a teleport.
        const speed = Math.hypot(b.vx, b.vy)
        if (speed > 0.18) {
          const target = Math.atan2(b.vy, b.vx)
          let diff = target - b.angle
          // Normalize to (-π, π] so we always rotate the short way.
          while (diff > Math.PI) diff -= Math.PI * 2
          while (diff < -Math.PI) diff += Math.PI * 2
          b.angle += diff * 0.18
        }

        // Draw arrowhead in current heading. Orbiting boids get a green glow.
        const size = 4 + n.alarm * 1.5
        ctx.save()
        ctx.translate(b.x, b.y)
        ctx.rotate(b.angle)
        if (n.orbiting > 0.15) {
          ctx.shadowColor = 'rgba(0, 255, 102, 0.95)'
          ctx.shadowBlur = 8 + n.orbiting * 8
          ctx.fillStyle = `rgba(80, 255, 140, ${0.55 + n.orbiting * 0.4})`
        } else {
          ctx.fillStyle = n.alarm > 0.05 ? fleeFill : fill
        }
        ctx.beginPath()
        ctx.moveTo(size, 0)
        ctx.lineTo(-size * 0.7, size * 0.55)
        ctx.lineTo(-size * 0.4, 0)
        ctx.lineTo(-size * 0.7, -size * 0.55)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }

      raf = requestAnimationFrame(tick)
    }

    onResize()
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  )
}
