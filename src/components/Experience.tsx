import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

interface Job {
  company: string
  role: string
  period: string
  bullets: string[]
}

const experience: Job[] = [
  {
    company: 'Serco',
    role: 'Software Engineer',
    period: 'May 2022 – Present',
    bullets: [
      'Core engineer on WILD, a mission-critical naval inventory system used across U.S. Navy programs.',
      'Leading the ground-up rebuild (WILD 2.0), moving the legacy VB.NET / Web Forms / Oracle stack to React, TypeScript, ASP.NET Core, and MSSQL.',
      'Designed the front-end structure, API contracts, and data-migration plan for WILD 2.0.',
      'Brought AI-native practices into the team, weaving AI tooling into our workflow to ship faster with better code.',
    ],
  },
  {
    company: 'Valiant Integrated Services',
    role: 'Software Engineer',
    period: 'Sep 2021 – May 2022',
    bullets: [
      'Kept building and maintaining the WILD inventory system under contract.',
      'Shipped new features and fixes across the ASP.NET Web Forms / Oracle stack.',
    ],
  },
  {
    company: 'Alliance Technical Services, Inc.',
    role: 'Software Engineer',
    period: 'Feb 2019 – Sep 2021',
    bullets: [
      'Maintained and improved WILD, supporting day-to-day naval inventory operations.',
      'Worked with stakeholders to turn their requirements into working features.',
    ],
  },
  {
    company: 'Serco',
    role: 'Programmer I',
    period: 'Feb 2013 – Nov 2017',
    bullets: [
      'Built new functionality for the WILD inventory system.',
      'Maintained and extended core modules on ASP.NET Web Forms and a VB.NET back end.',
    ],
  },
  {
    company: 'L-3 Communications',
    role: 'Programmer',
    period: '2009 – 2011',
    bullets: [
      'Built new features for SABER, a naval inventory system on ASP.NET with a VB.NET back end.',
      'Cleaned up and maintained SQL Server data to improve data integrity.',
    ],
  },
]

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null)
  // useScroll tracks how far the timeline section has progressed through viewport.
  // offset describes when 0% and 100% should fire: here as the element top hits
  // viewport center until the element bottom leaves viewport top.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 60%', 'end 50%'],
  })
  // useTransform maps an input range → output range. Here progress 0→1 stretches
  // the line's vertical scaleY 0→1, so it grows in sync with scroll position.
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="experience" className="py-32 px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">
            04 / Experience
          </p>
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight text-balance">
            14 years of shipping.
          </h2>
        </motion.div>

        <div ref={containerRef} className="relative">
          {/* Track */}
          <div className="absolute left-3 sm:left-4 top-2 bottom-2 w-px bg-border" />
          {/* Filled progress, animated via useScroll. */}
          <motion.div
            style={{ scaleY: lineScale, transformOrigin: 'top' }}
            className="absolute left-3 sm:left-4 top-2 bottom-2 w-px bg-primary"
          />

          <div className="space-y-12">
            {experience.map((job, i) => (
              <motion.article
                key={job.company + job.role}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative pl-12 sm:pl-16"
              >
                <div className="absolute left-0 top-1.5 w-7 h-7 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                  <h3 className="text-xl font-medium">{job.role}</h3>
                  <Badge variant="outline" className="font-mono w-fit">
                    {job.period}
                  </Badge>
                </div>
                <p className="text-primary font-medium mb-4">{job.company}</p>
                <ul className="space-y-2 text-muted-foreground">
                  {job.bullets.map((b, j) => (
                    <li key={j} className="flex gap-3 leading-relaxed">
                      <span className="text-primary/60 mt-2 size-1 rounded-full bg-current shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
