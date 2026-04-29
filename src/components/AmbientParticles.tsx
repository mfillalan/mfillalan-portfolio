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

const COUNT = 135
const PERCEIVE = 55
const SEPARATE = 22
const FLEE_RADIUS = 130
const MAX_SPEED = 1.8
const MAX_FORCE = 0.045
// Always-alive floor: every boid keeps drifting. Without this, shelter
// boids would dampen to a halt and look dead.
const MIN_SPEED = 0.55

// Shelters: DOM elements with [data-boid-shelter] attract nearby boids.
// Boids slow down once they reach the rest band so they cluster instead
// of orbiting. The cursor's flee force naturally disperses them.
// Optional [data-boid-shelter-color="r, g, b"] tints boids that get close,
// so e.g. the shadcn chip glows white-gray and the Tailwind chip cyan.
const SHELTER_REACH = 230
const SHELTER_REST = 35
const W_SHELTER = 0.7
// Color tint kicks in only when very close (so the surrounding flock stays
// neutral and the tint reads as recognition of the chip).
const SHELTER_TINT_RADIUS = 95

// Orbital shelters: [data-boid-orbit] pulls boids into a constantly-moving
// ring around the element. Physics model: a radial spring keeps them on the
// ring while a tangential velocity setpoint keeps every orbiter moving at the
// SAME angular speed. Same angular speed = same relative spacing forever, so
// boids that arrive at different angles stay spread out organically instead
// of bunching at one or two spots.
const ORBIT_REACH = 220
const ORBIT_RADIUS = 62
const ORBIT_RADIAL_K = 0.025
const ORBIT_TANGENT_K = 0.09

// Behavior weights (tuning knobs).
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
      // Mobile browsers (esp. Android Chrome) fire `resize` on every URL bar
      // show/hide during scroll. Reseeding on those events would teleport the
      // entire flock on every scroll. So: just resize the canvas; leave boids
      // alone. Any boids now outside the new bounds will wrap on the next
      // tick, so no visible glitch.
      resize()
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
      // Pause when the tab is hidden (battery / CPU) and when something on
      // the page (e.g. an opening modal) sets the pause flag. The Projects
      // dialog uses this so the layoutId morph isn't competing with 18k+
      // neighbor checks per frame and noticeably stuttering.
      if (document.hidden || document.documentElement.dataset.boidsPaused === '1') {
        raf = requestAnimationFrame(tick)
        return
      }

      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      const fill = isDark() ? 'rgba(200, 210, 240, 0.7)' : 'rgba(40, 50, 90, 0.65)'
      const fleeFill = isDark() ? 'rgba(180, 160, 255, 0.95)' : 'rgba(110, 80, 230, 0.9)'

      // Snapshot active shelters this frame. Cheap for a handful of elements
      // and ensures positions track through scroll, magnetic pull, layout shifts.
      const shelterEls = document.querySelectorAll<HTMLElement>('[data-boid-shelter]')
      const shelters: Array<{ x: number; y: number; color?: string }> = []
      shelterEls.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.bottom < 0 || r.top > h || r.right < 0 || r.left > w) return
        shelters.push({
          x: r.left + r.width / 2,
          y: r.top + r.height / 2,
          color: el.dataset.boidShelterColor,
        })
      })

      // Each orbit element can specify its own color + radius via data attrs:
      //   data-boid-orbit-color="r, g, b"  (default green Konami palette)
      //   data-boid-orbit-radius="78"      (default ORBIT_RADIUS)
      const orbitEls = document.querySelectorAll<HTMLElement>('[data-boid-orbit]')
      const orbits: Array<{ x: number; y: number; radius: number; color: string }> = []
      orbitEls.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.bottom < 0 || r.top > h || r.right < 0 || r.left > w) return
        const color = el.dataset.boidOrbitColor ?? '80, 255, 140'
        const radius = Number(el.dataset.boidOrbitRadius) || ORBIT_RADIUS
        orbits.push({ x: r.left + r.width / 2, y: r.top + r.height / 2, radius, color })
      })

      // Compute new accelerations from neighbor interactions
      const next: Array<{
        ax: number
        ay: number
        alarm: number
        orbiting: number
        orbitColor: string
        shelterTint?: string
        shelterTintProx: number
      }> = []
      for (let i = 0; i < boids.length; i++) {
        const b = boids[i]

        // Orbital influence first; orbiting boids skip cohesion (otherwise
        // the ring collapses into a knot). Two forces:
        //   - Radial spring drives them onto the orbit ring.
        //   - Tangential setpoint forces every orbiter to share the SAME
        //     angular speed → constant relative spacing forever.
        let orbiting = 0
        let orbitColor = '80, 255, 140'
        let orbitAx = 0
        let orbitAy = 0
        if (orbits.length > 0) {
          let oCx = 0, oCy = 0, oD = Infinity, oR = ORBIT_RADIUS, oColor = orbitColor
          for (const o of orbits) {
            const dx = o.x - b.x
            const dy = o.y - b.y
            const d = Math.hypot(dx, dy)
            if (d < oD) {
              oD = d
              oCx = o.x
              oCy = o.y
              oR = o.radius
              oColor = o.color
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
            const radialErr = oD - oR
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
            orbitColor = oColor
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

        // Shelter attraction: soft pull toward the nearest in-viewport
        // shelter. Beyond SHELTER_REACH there's no influence at all.
        // Also tracks the nearest shelter's color so the boid can be tinted
        // when it gets close to a labeled chip (shadcn/ui, Tailwind, etc.).
        let shelterTint: string | undefined
        let shelterTintProx = 0
        if (shelters.length > 0) {
          let nearestDx = 0
          let nearestDy = 0
          let nearestD = Infinity
          let nearestColor: string | undefined
          for (const s of shelters) {
            const dx = s.x - b.x
            const dy = s.y - b.y
            const d = Math.hypot(dx, dy)
            if (d < nearestD) {
              nearestD = d
              nearestDx = dx
              nearestDy = dy
              nearestColor = s.color
            }
          }
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
          // Tint independently of pull, only when truly close to a colored
          // shelter, so the rest of the flock stays neutral.
          if (nearestColor && nearestD < SHELTER_TINT_RADIUS) {
            shelterTint = nearestColor
            shelterTintProx = 1 - nearestD / SHELTER_TINT_RADIUS
          }
        }

        // Predator flee: strong steer away from cursor.
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

        next.push({ ax, ay, alarm, orbiting, orbitColor, shelterTint, shelterTintProx })
      }

      // Integrate physics + update headings (no drawing here so we can render
      // the same simulation onto multiple canvases below).
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

        if (n.orbiting < 0.05) {
          if (b.x < -10) b.x = w + 10
          else if (b.x > w + 10) b.x = -10
          if (b.y < -10) b.y = h + 10
          else if (b.y > h + 10) b.y = -10
        }

        // Update heading with shortest-arc interpolation. Atan2 is unstable
        // near zero velocity (tiny noise spins boids randomly), so only
        // retarget when moving meaningfully.
        const speed = Math.hypot(b.vx, b.vy)
        if (speed > 0.18) {
          const target = Math.atan2(b.vy, b.vx)
          let diff = target - b.angle
          while (diff > Math.PI) diff -= Math.PI * 2
          while (diff < -Math.PI) diff += Math.PI * 2
          b.angle += diff * 0.18
        }
      }

      // Per-boid draw. Position is in screen coordinates; pass an offset to
      // render into a card-local canvas's coordinate system.
      const drawBoid = (
        targetCtx: CanvasRenderingContext2D,
        b: Boid,
        n: (typeof next)[number],
        offsetX: number,
        offsetY: number,
      ) => {
        const size = 4 + n.alarm * 1.5
        targetCtx.save()
        targetCtx.translate(b.x - offsetX, b.y - offsetY)
        targetCtx.rotate(b.angle)
        if (n.orbiting > 0.15) {
          targetCtx.shadowColor = `rgba(${n.orbitColor}, 0.95)`
          targetCtx.shadowBlur = 8 + n.orbiting * 8
          targetCtx.fillStyle = `rgba(${n.orbitColor}, ${0.55 + n.orbiting * 0.4})`
        } else if (n.alarm > 0.05) {
          targetCtx.fillStyle = fleeFill
        } else if (n.shelterTint && n.shelterTintProx > 0.05) {
          targetCtx.shadowColor = `rgba(${n.shelterTint}, 0.9)`
          targetCtx.shadowBlur = 4 + n.shelterTintProx * 6
          targetCtx.fillStyle = `rgba(${n.shelterTint}, ${0.6 + n.shelterTintProx * 0.35})`
        } else {
          targetCtx.fillStyle = fill
        }
        targetCtx.beginPath()
        targetCtx.moveTo(size, 0)
        targetCtx.lineTo(-size * 0.7, size * 0.55)
        targetCtx.lineTo(-size * 0.4, 0)
        targetCtx.lineTo(-size * 0.7, -size * 0.55)
        targetCtx.closePath()
        targetCtx.fill()
        targetCtx.restore()
      }

      // 1) Background canvas, full viewport, behind everything. Boids inside
      //    opaque cards are hidden by those cards' bg-card.
      for (let i = 0; i < boids.length; i++) {
        drawBoid(ctx, boids[i], next[i], 0, 0)
      }

      // 2) Per-card mirror canvases. Same simulation, but rendered INSIDE
      //    each marked card's stacking context, so chips sitting at higher
      //    z-index inside the card hide the boids passing behind them. This
      //    is what makes boids visually "fly above the card": the card body
      //    is below the local canvas, but card content is above it.
      const mirrors = document.querySelectorAll<HTMLCanvasElement>('canvas[data-boid-mirror]')
      mirrors.forEach((mc) => {
        const r = mc.getBoundingClientRect()
        if (r.bottom < 0 || r.top > h || r.right < 0 || r.left > w) return
        const mctx = mc.getContext('2d')
        if (!mctx) return
        // Resize on demand (reflows, theme switches, etc.)
        const cssW = Math.round(r.width)
        const cssH = Math.round(r.height)
        const targetW = cssW * dpr
        const targetH = cssH * dpr
        if (mc.width !== targetW || mc.height !== targetH) {
          mc.width = targetW
          mc.height = targetH
          mctx.setTransform(1, 0, 0, 1, 0, 0)
          mctx.scale(dpr, dpr)
        }
        mctx.clearRect(0, 0, cssW, cssH)
        // Only draw boids whose screen position falls inside this card.
        for (let i = 0; i < boids.length; i++) {
          const b = boids[i]
          if (b.x < r.left - 8 || b.x > r.right + 8 || b.y < r.top - 8 || b.y > r.bottom + 8) continue
          drawBoid(mctx, b, next[i], r.left, r.top)
        }
      })

      raf = requestAnimationFrame(tick)
    }

    onResize()
    seed()
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
