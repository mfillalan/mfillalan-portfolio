import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Moon, Sun, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  isResumeRoute: boolean
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar({ isResumeRoute, theme, onToggleTheme }: NavbarProps) {
  const [active, setActive] = useState('hero')
  const { scrollYProgress } = useScroll()
  // Spring smooths the progress bar — direct scroll values are jittery.
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    if (isResumeRoute) return
    const onScroll = () => {
      let current = 'hero'
      for (const s of sections) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= 140) current = s.id
      }
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [isResumeRoute])

  return (
    <>
      {/* Top scroll progress bar — Framer Motion's useScroll + useSpring */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] origin-left bg-primary z-[60]"
        style={{ scaleX: progress }}
      />

      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(960px,calc(100%-1.5rem))]">
        <nav className="flex items-center justify-between gap-3 rounded-full border border-border bg-background/70 px-4 py-2 backdrop-blur-xl shadow-lg shadow-black/5">
          <a
            href="#/"
            className="font-display text-base italic tracking-tight pl-2 pr-1 hover:text-primary transition-colors whitespace-nowrap"
          >
            Michael Fillalan
          </a>

          {!isResumeRoute && (
            <ul className="hidden md:flex items-center gap-1 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={cn(
                      'relative px-3 py-1.5 rounded-full transition-colors',
                      active === s.id
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {/* layoutId animates a single pill between active items */}
                    {active === s.id && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-primary rounded-full -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className="rounded-full"
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-full hidden sm:inline-flex">
              <a href="#/resume">
                <FileText className="size-3.5" />
                Resume
              </a>
            </Button>
          </div>
        </nav>
      </header>
    </>
  )
}
