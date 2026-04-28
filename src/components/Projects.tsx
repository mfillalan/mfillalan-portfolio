import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GithubIcon } from './icons'

interface Project {
  title: string
  summary: string
  role: string
  details: string
  impact?: string
  tags: string[]
  repoUrl?: string
  liveUrl?: string
  accent: string
}

const projects: Project[] = [
  {
    title: 'DendriteMCP',
    summary:
      'A local long-term memory system for coding agents — they retain project context, strategy, and reusable knowledge across sessions.',
    role:
      'Creator and lead engineer. Designed product direction, memory model, and runtime architecture. Implementing the MCP server, CLI flow, and agent integration patterns end-to-end.',
    details:
      'Most coding agents reset between sessions, which causes repeated context loss and rework. DendriteMCP addresses that by giving agents a shared local memory layer backed by graph-linked relationships and durable workflow primitives.\n\nThe system tracks project Charter goals, long-running Pillars, quests/tasks, and reusable artifacts so agent decisions remain aligned over time. I also introduced an Ollama-backed background layer for memory consolidation, drift detection, and doc-sync to keep knowledge fresh without manual overhead.\n\nDesigned to work with modern coding-agent workflows across GitHub Copilot, Cursor, Claude Code, and Codex.',
    impact:
      'Transforms AI-assisted coding from short-lived chat into a persistent engineering workflow with continuity, traceability, and reusable project intelligence.',
    tags: ['MCP', 'AI', 'TypeScript', 'Node.js', 'Knowledge Graph', 'Ollama', 'LLM'],
    accent: 'from-violet-500/30 via-fuchsia-500/15 to-transparent',
  },
  {
    title: 'WILD 2.0',
    summary:
      'Leading a full modernization of a mission-critical naval inventory platform — legacy Web Forms to React + TypeScript + ASP.NET Core.',
    role:
      'Lead engineer for the modernization effort. I own architecture direction, implementation strategy, and core feature delivery while balancing migration risk against live operational requirements.',
    details:
      'WILD supports real naval inventory operations, but the legacy stack (VB.NET, ASP.NET 3.5 Web Forms, Oracle) was limiting maintainability and long-term growth.\n\nI am leading WILD 2.0 as a ground-up rebuild to a modern stack: React + TypeScript front end, ASP.NET Core API, and MSSQL data layer. The work includes new API contracts, updated data modeling, and incremental migration planning so delivery can continue without disrupting operational users.\n\nBecause this is an active government-adjacent system, public details are intentionally limited, but the core engineering challenge is large-scale modernization under production constraints.',
    impact:
      'Improves maintainability, developer velocity, and long-term scalability while reducing technical risk in a mission-critical operational platform.',
    tags: ['React', 'TypeScript', 'ASP.NET Core', 'MSSQL', 'C#', '.NET'],
    accent: 'from-cyan-500/30 via-blue-500/15 to-transparent',
  },
]

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null)

  return (
    <section id="projects" className="py-32 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">
            02 — Projects
          </p>
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight text-balance">
            Selected work.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <motion.button
              key={p.title}
              // layoutId — when this element shares an id with another animating
              // element (the dialog below), Framer Motion morphs between them.
              layoutId={`project-${p.title}`}
              onClick={() => setSelected(p)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group text-left relative overflow-hidden rounded-2xl border border-border bg-card p-7 hover:border-primary/40 transition-colors"
            >
              {/* Gradient wash specific to project */}
              <div
                className={`absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br ${p.accent} blur-3xl opacity-60 pointer-events-none`}
              />
              <div className="relative">
                <motion.h3
                  layoutId={`project-title-${p.title}`}
                  className="font-display text-3xl tracking-tight mb-3"
                >
                  {p.title}
                </motion.h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{p.summary}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {p.tags.slice(0, 5).map((t) => (
                    <Badge key={t} variant="secondary" className="font-normal">
                      {t}
                    </Badge>
                  ))}
                  {p.tags.length > 5 && (
                    <Badge variant="outline" className="font-normal">
                      +{p.tags.length - 5}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  Read the case study
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* AnimatePresence handles enter/exit animations for elements added/removed
          from the React tree — required for layoutId morph-out on close. */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelected(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              layoutId={`project-${selected.title}`}
              className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-2xl"
            >
              <div
                className={`absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br ${selected.accent} blur-3xl opacity-50 pointer-events-none`}
              />
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-full p-2 hover:bg-accent transition-colors z-10"
              >
                <X className="size-5" />
              </button>
              <div className="relative">
                <motion.h3
                  layoutId={`project-title-${selected.title}`}
                  className="font-display text-4xl sm:text-5xl tracking-tight mb-4"
                >
                  {selected.title}
                </motion.h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {selected.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="font-normal">
                      {t}
                    </Badge>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="space-y-7"
                >
                  <Section title="My Role">{selected.role}</Section>
                  <Section title="What I Built" preserveBreaks>
                    {selected.details}
                  </Section>
                  {selected.impact && <Section title="Impact">{selected.impact}</Section>}

                  {(selected.repoUrl || selected.liveUrl) && (
                    <div className="flex gap-3 pt-4">
                      {selected.repoUrl && (
                        <Button asChild variant="outline">
                          <a href={selected.repoUrl} target="_blank" rel="noreferrer">
                            <GithubIcon className="size-4" /> GitHub
                          </a>
                        </Button>
                      )}
                      {selected.liveUrl && (
                        <Button asChild>
                          <a href={selected.liveUrl} target="_blank" rel="noreferrer">
                            Live demo <ArrowUpRight className="size-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function Section({
  title,
  children,
  preserveBreaks = false,
}: {
  title: string
  children: string
  preserveBreaks?: boolean
}) {
  return (
    <div>
      <h4 className="font-mono text-xs uppercase tracking-[0.18em] text-primary mb-3">
        {title}
      </h4>
      <p
        className={`text-muted-foreground leading-relaxed ${
          preserveBreaks ? 'whitespace-pre-line' : ''
        }`}
      >
        {children}
      </p>
    </div>
  )
}
