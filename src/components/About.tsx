import { motion } from 'framer-motion'
import { Code2, Sparkles, Target } from 'lucide-react'

const principles = [
  {
    icon: Code2,
    title: 'Craft over completion',
    body: "I don't stop at \"it works.\" I keep going until it's something I'm proud of.",
  },
  {
    icon: Sparkles,
    title: 'Software that feels alive',
    body: 'Good UIs feel less like forms and more like worlds. Intuitive, responsive, fun to use.',
    aboveBoids: true,
    iconShelter: true,
    iconColor: '255, 200, 80',
  },
  {
    icon: Target,
    title: 'AI-native fundamentals',
    body: '14 years of full-stack experience, now aimed at durable agent workflows and tooling.',
  },
]

export default function About() {
  return (
    <section id="about" className="relative py-32 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">
            01 / About
          </p>
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight text-balance">
            Coding since I was 11. Still obsessed.
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-7 space-y-6 text-lg leading-relaxed text-muted-foreground"
          >
            <p>
              <span className="text-foreground">What started as obsessive curiosity</span> at age
              11 grew into a 14-year career. I work hard, and I genuinely love the craft.
            </p>
            <p>
              I've spent my career building and modernizing production systems. What I enjoy
              most is finding the creative angle in a technical problem. I'm drawn to software
              that feels alive, and I think the best software has the same pull as a great game.
            </p>
            <p>
              <span className="text-foreground">Right now I'm looking</span> for projects that
              push boundaries, with people who think differently about what software can be. I've
              gone deep on AI-native development this past year, and I want to put it to work next
              to solid full-stack fundamentals, somewhere a motivated team is building something
              that matters.
            </p>
          </motion.div>

          <div className="lg:col-span-5 space-y-3">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -2 }}
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 hover:border-primary/40 transition-colors"
              >
                {p.aboveBoids && (
                  <canvas
                    data-boid-mirror
                    aria-hidden
                    className="pointer-events-none absolute inset-0 size-full"
                    style={{ zIndex: 1 }}
                  />
                )}
                <div className="relative flex items-start gap-4" style={{ zIndex: 10 }}>
                  <div
                    className={
                      p.iconShelter
                        ? 'relative overflow-hidden rounded-lg text-primary p-2 shrink-0'
                        : 'rounded-lg bg-primary/10 text-primary p-2 shrink-0'
                    }
                    {...(p.iconShelter
                      ? {
                          'data-boid-shelter': '',
                          'data-boid-shelter-color': p.iconColor ?? '255, 200, 80',
                          // Tuck boids just inside the box edge so the box
                          // hides their bodies and only their heads peek past.
                          'data-boid-shelter-rest': '-4',
                          'data-boid-shelter-peek': '3',
                        }
                      : {})}
                  >
                    {p.iconShelter && (
                      <>
                        {/* Opaque mask so sheltered boids on the mirror canvas
                            below are actually hidden by the box (the original
                            bg-primary/10 alone is too transparent to occlude). */}
                        <div className="absolute inset-0 bg-card" />
                        <div className="absolute inset-0 bg-primary/10" />
                      </>
                    )}
                    <p.icon className={p.iconShelter ? 'relative size-4' : 'size-4'} />
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
