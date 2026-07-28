import { motion } from 'framer-motion'
import { Code2, Layers, Target } from 'lucide-react'

const principles = [
  {
    icon: Code2,
    title: 'Craft over completion',
    body: 'I do not stop at "it works." I keep going until the result is clear, maintainable, and something I would stand behind.',
  },
  {
    icon: Layers,
    title: 'Systems that last',
    body: 'Good software should stay operable under real constraints: legacy cutovers, offline field work, and long-lived product ownership.',
  },
  {
    icon: Target,
    title: 'AI with fundamentals',
    body: '14 years of full-stack delivery, now applied to durable agent workflows and tooling that teams can actually adopt.',
  },
]

export default function About() {
  return (
    <section id="about" className="relative py-28 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-14"
        >
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
            About
          </p>
          <h2 className="font-display text-3xl sm:text-5xl tracking-tight text-balance">
            Fourteen years building software people depend on.
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="lg:col-span-7 space-y-5 text-base sm:text-lg leading-relaxed text-muted-foreground"
          >
            <p>
              <span className="text-foreground">What started as curiosity</span> at age 11 became a
              long career shipping production systems. I work hard, and I still care about the
              craft.
            </p>
            <p>
              Most of my career has been spent building and modernizing operational platforms.
              I like finding the practical path through hard technical problems, especially when
              the old system has to keep running while the new one earns the cutover.
            </p>
            <p>
              <span className="text-foreground">Right now I am looking</span> for teams that value
              clear thinking and durable delivery. I have gone deep on AI-native development this
              past year, and I want to put that alongside strong full-stack fundamentals on work
              that matters.
            </p>
          </motion.div>

          <div className="lg:col-span-5 space-y-3">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.45, delay: 0.08 + i * 0.06 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-md bg-primary/10 text-primary p-2 shrink-0">
                    <p.icon className="size-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-base mb-1">{p.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
