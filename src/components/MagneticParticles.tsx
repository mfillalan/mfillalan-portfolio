import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  life: number;
  type: 'stream' | 'burst';
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
}

const ACCENT = '255, 185, 60'; // warm amber — visible on both teal and cream

export default function MagneticParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    let mouseX = -2000;
    let mouseY = -2000;
    let particles: Particle[] = [];
    let animId: number;
    // Track which wraps the mouse is currently over
    const activeWraps = new Set<Element>();
    let spawnAccum = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Listen to actual hover events on each magnetic-wrap
    const enterListeners = new Map<Element, () => void>();
    const leaveListeners = new Map<Element, () => void>();

    function attachListeners() {
      document.querySelectorAll('.magnetic-wrap').forEach((btn) => {
        if (enterListeners.has(btn)) return;

        const onEnter = () => activeWraps.add(btn);
        const onLeave = () => {
          if (activeWraps.has(btn)) {
            activeWraps.delete(btn);
            // Burst — fire a small scatter from button center
            const rect = btn.getBoundingClientRect();
            const bx = rect.left + rect.width / 2;
            const by = rect.top + rect.height / 2;
            const count = 6;
            for (let i = 0; i < count; i++) {
              const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
              const speed = 0.8 + Math.random() * 1.4;
              particles.push({
                x: bx + (Math.random() - 0.5) * 10,
                y: by + (Math.random() - 0.5) * 10,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 0.7 + Math.random() * 0.3,
                type: 'burst',
                targetX: bx,
                targetY: by,
              });
            }
          }
        };

        btn.addEventListener('mouseenter', onEnter);
        btn.addEventListener('mouseleave', onLeave);
        enterListeners.set(btn, onEnter);
        leaveListeners.set(btn, onLeave);
      });
    }

    function spawnStream(bx: number, by: number) {
      // Spawn near cursor heading toward button
      const nx = bx - mouseX;
      const ny = by - mouseY;
      const len = Math.hypot(nx, ny) || 1;
      const perp = (Math.random() - 0.5) * 18;
      particles.push({
        x: mouseX + (Math.random() - 0.5) * 6,
        y: mouseY + (Math.random() - 0.5) * 6,
        vx: (nx / len) * 1.2 + (-ny / len) * perp * 0.04,
        vy: (ny / len) * 1.2 + ( nx / len) * perp * 0.04,
        life: 0.9 + Math.random() * 0.1,
        type: 'stream',
        targetX: bx,
        targetY: by,
      });
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Re-scan for newly mounted buttons (e.g. after scroll reveal)
      attachListeners();

      // Spawn stream particles for active (hovered) buttons
      if (activeWraps.size > 0) {
        spawnAccum += 0.12; // gentle trickle
        const whole = Math.floor(spawnAccum);
        spawnAccum -= whole;
        for (let i = 0; i < whole; i++) {
          activeWraps.forEach((btn) => {
            const rect = btn.getBoundingClientRect();
            spawnStream(rect.left + rect.width / 2, rect.top + rect.height / 2);
          });
        }
      }

      // Update + draw
      particles = particles.filter((p) => p.life > 0);

      for (const p of particles) {
        if (p.type === 'stream') {
          // Gently pull toward target
          p.vx += (p.targetX - p.x) * 0.012;
          p.vy += (p.targetY - p.y) * 0.012;
          p.vx *= 0.84;
          p.vy *= 0.84;
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.018;

          const alpha = Math.min(p.life * 1.6, 1) * 0.82;
          const r = 1.6 + p.life * 1.2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ACCENT}, ${alpha})`;
          ctx.fill();
        } else {
          // Burst — drift outward and fade
          p.vx *= 0.91;
          p.vy *= 0.91;
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.028;

          const alpha = p.life * 0.85;
          const r = Math.max(p.life * 2.8, 0.5);
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ACCENT}, ${alpha})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      enterListeners.forEach((fn, el) => el.removeEventListener('mouseenter', fn));
      leaveListeners.forEach((fn, el) => el.removeEventListener('mouseleave', fn));
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9998 }}
    />
  );
}

