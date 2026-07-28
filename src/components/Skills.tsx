import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Braces, Database, Layers, Sparkles, Wrench } from 'lucide-react'

const groups = [
  {
    icon: Braces,
    category: 'Languages',
    skills: ['TypeScript', 'JavaScript', 'C#', 'VB.NET', 'HTML', 'CSS'],
    span: 'md:col-span-2',
  },
  {
    icon: Layers,
    category: 'Frameworks',
    skills: ['React', 'ASP.NET Core', 'Next.js', 'Vue', 'Knockout.js', 'Vite'],
  },
  {
    icon: Database,
    category: 'Data',
    skills: ['MSSQL', 'Oracle', 'SQL Server'],
  },
  {
    icon: Wrench,
    category: 'UI & Tooling',
    skills: ['shadcn/ui', 'Tailwind CSS', 'Framer Motion', 'VS Code', 'Git', 'GitHub', 'REST', 'MVC'],
    span: 'md:col-span-2',
  },
  {
    icon: Sparkles,
    category: 'AI & Emerging',
    skills: [
      'AI-Native Development',
      'MCP (Model Context Protocol)',
      'LLM Integration',
      'Prompt Engineering',
      'Claude Code',
      'Codex',
      'GitHub Copilot',
    ],
    span: 'md:col-span-3',
    accent: true,
  },
]

export default function Skills() {
  return (
    <section id="skills" className="py-28 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-14"
        >
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
            Toolkit
          </p>
          <h2 className="font-display text-3xl sm:text-5xl tracking-tight text-balance">
            What I reach for.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {groups.map((g) => (
            <motion.div
              key={g.category}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className={`${g.span ?? ''} rounded-xl border border-border bg-card p-6 ${
                g.accent ? 'border-primary/25 bg-primary/[0.03]' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-md bg-primary/10 text-primary p-2">
                  <g.icon className="size-4" />
                </div>
                <h3 className="font-medium text-base">{g.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {g.skills.map((s) => (
                  <Badge key={s} variant="secondary" className="font-normal">
                    {s}
                  </Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
