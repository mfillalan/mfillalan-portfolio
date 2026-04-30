import { motion } from 'framer-motion'
import { ArrowDown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Magnetic } from './Magnetic'

// "variants" let a parent orchestrate child animations.
// The parent fires "show", children inherit it and stagger via staggerChildren.
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-24"
    >
      {/* Animated radial gradient backdrop */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary)_0%,_transparent_45%)] opacity-20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_70%,var(--color-background))]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          }}
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container mx-auto max-w-5xl px-6 text-center"
      >
        <motion.div variants={item} className="flex justify-center mb-6">
          <div
            className="relative"
            data-boid-shelter
            data-boid-shelter-color="180, 140, 255"
          >
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary via-fuchsia-500/60 to-cyan-500/60 blur-md opacity-70" />
            <img
              src="/mfillalan-portfolio/profile-photo.jpeg"
              alt="Michael Fillalan"
              className="relative size-24 rounded-full object-cover border-2 border-background"
            />
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur px-3 py-1 text-xs text-muted-foreground mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Available for new opportunities
        </motion.div>

        <motion.h1
          variants={item}
          className="text-balance font-display text-[clamp(2.75rem,9vw,6.5rem)] leading-[0.95] tracking-tight"
        >
          Software that feels{' '}
          <em className="italic text-primary">alive.</em>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 mx-auto max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl"
        >
          I'm <span className="text-foreground font-medium">Michael Fillalan</span>, a software
          engineer with 14 years of production experience, now fully committed to AI-native
          development. I build systems that work, and interfaces that feel good using them.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex items-center justify-center gap-3">
          <Magnetic shelter shelterTight shelterColor="180, 140, 255">
            <Button asChild size="lg" className="rounded-full">
              <a href="#projects">
                <Sparkles className="size-4" />
                See my work
              </a>
            </Button>
          </Magnetic>
          <Magnetic shelter shelterTight shelterColor="200, 200, 220">
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <a href="#contact">Get in touch</a>
            </Button>
          </Magnetic>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-20 flex flex-col items-center gap-2 text-xs text-muted-foreground"
        >
          <span className="font-mono uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="size-4" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
