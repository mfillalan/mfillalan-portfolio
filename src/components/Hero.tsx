import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-28 pb-16"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary)_0%,_transparent_50%)] opacity-[0.08]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,var(--color-background))]" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container mx-auto max-w-4xl px-6 text-center"
      >
        <motion.div variants={item} className="flex justify-center mb-8">
          <img
            src="/mfillalan-portfolio/profile-photo.jpeg"
            alt="Michael Fillalan"
            className="size-20 sm:size-24 rounded-full object-cover border border-border shadow-sm"
          />
        </motion.div>

        <motion.p
          variants={item}
          className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
        >
          Software Engineer · Open to remote
        </motion.p>

        <motion.h1
          variants={item}
          className="text-balance font-display text-[clamp(2.5rem,7vw,4.75rem)] leading-[1.05] tracking-tight"
        >
          Building reliable software with clear craft.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 mx-auto max-w-2xl text-pretty text-base sm:text-lg leading-relaxed text-muted-foreground"
        >
          I&apos;m <span className="text-foreground font-medium">Michael Fillalan</span>, a
          software engineer with 14 years shipping production systems. I modernize complex
          platforms, design practical full-stack architecture, and build AI-native tooling that
          stays useful after the demo ends.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button asChild size="lg" className="rounded-full min-w-40">
            <a href="#projects">
              View projects
              <ArrowRight className="size-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full min-w-40">
            <a href="#contact">Get in touch</a>
          </Button>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-20 flex flex-col items-center gap-2 text-xs text-muted-foreground"
        >
          <span className="uppercase tracking-[0.2em]">Scroll</span>
          <ArrowDown className="size-4 opacity-70" />
        </motion.div>
      </motion.div>
    </section>
  )
}
