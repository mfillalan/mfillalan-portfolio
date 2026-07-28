import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Sparkles, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GithubIcon } from './icons'
import ProjectGallery, { type Screenshot } from './ProjectGallery'

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
  /** "r, g, b" tint applied to fish that shelter at the title card. */
  shelterColor: string
  screenshots?: Screenshot[]
  /** Spans the grid full-width and shows a "Latest project" badge. */
  featured?: boolean
}

const BASE = import.meta.env.BASE_URL

const projects: Project[] = [
  {
    title: 'Tendrite',
    featured: true,
    summary:
      'A local-first coding command center. Tendrite turns projects, agents, memory, source control, and decisions into one native desktop workspace so you can ship work that matters — not babysit chat tabs.',
    role:
      'Creator and sole engineer. I design and build the full product: the native desktop workspace, the memory substrate, mission and campaign orchestration, git-native review, multi-provider model routing, the phone companion (Tendrite Codec), and the open-core product surface at tendrite.dev.',
    details:
      "Tendrite is a local-first command center for agentic coding. Open a project and you get one operating surface for the file tree, editor, agent console, source control, memory, skills, and mission board — so the work stays inspectable from the first plan to the final review instead of scattered across a terminal, browser, and chat tabs.\n\nIt is not a chat wrapper. You set a bounded objective, assign focused agent roles, and watch a live campaign board show where the team is, what is blocked, and which decision needs you next. Agents capture facts, lessons, warnings, and handoffs as they go; each new task gets a focused brief drawn from keyword, semantic, and relationship signals rather than a dump of the whole archive. You stay in control: pin what matters, consolidate or retire stale knowledge, and keep archived memories recoverable.\n\nModel independence is built in. Connect the subscriptions, API keys, or local models you already trust — the workspace does not force one provider. Git-native review keeps impact and diffs beside the agent work. When you step away, the Tendrite Codec phone companion lets you follow live runs, answer agent questions, switch projects, and steer the next move over your own network path or an optional managed Cloud relay.\n\nThe product is open core and ships as a desktop beta for Windows and Linux (macOS when a signed Apple build is ready). Free covers the full local workspace; Pro unlocks connected multi-project and phone capabilities. Your code and project brain stay on your machine. Same test as the rest of my work: the useful state should outlive the app.\n\nTendrite grew out of the Dendrite line of experiments (memory daemon, wiki MCP, early studio prototype). The through-line was always the same: agents that remember, work you can steer, and less friction between intent and shipped change.",
    impact:
      'Turns agentic coding from tab-juggling into an operable workflow: missions with a real board, memory that survives the next session, git review in the same surface, and a phone companion when you step away. It is the project that best shows where my energy is right now — local-first systems, multi-agent orchestration, and software that feels good to direct.',
    tags: [
      'Desktop App',
      'Local-First',
      'Multi-Agent',
      'Memory Substrate',
      'Orchestration',
      'Git-Native Review',
      'Model Routing',
      'Phone Companion',
      'Open Core',
    ],
    repoUrl: 'https://github.com/mfillalan/tendrite',
    liveUrl: 'https://tendrite.dev',
    accent: 'from-violet-500/30 via-fuchsia-500/15 to-transparent',
    shelterColor: '180, 140, 255',
    screenshots: [
      {
        src: `${BASE}projects/tendrite/01-workspace.webp`,
        caption:
          'Workspace: projects, agents, editor, and context in one native operating surface.',
      },
      {
        src: `${BASE}projects/tendrite/02-memory.webp`,
        caption:
          'Memory substrate: a living map of what the project knows, how it connects, and what needs attention.',
      },
      {
        src: `${BASE}projects/tendrite/03-command-center.webp`,
        caption:
          'Live agent command center: see the work, inspect its context, and steer the run without leaving the project.',
      },
      {
        src: `${BASE}projects/tendrite/04-mission-work.webp`,
        caption:
          'Mission execution: follow work in progress and intervene with the right context.',
      },
      {
        src: `${BASE}projects/tendrite/05-campaign-map.webp`,
        caption:
          'Campaign map: give long-running work a shape you can scan — objectives, squad, and blockers.',
      },
      {
        src: `${BASE}projects/tendrite/06-source-control.webp`,
        caption:
          'Git-native review: impact and changes beside the agent work, not in a separate tool.',
      },
      {
        src: `${BASE}projects/tendrite/07-accounts.webp`,
        caption:
          'Bring your models: route work through the subscriptions and providers you already use.',
      },
      {
        src: `${BASE}projects/tendrite/08-phone-relay.webp`,
        caption:
          'Phone companion: follow live work, answer questions, and steer from Tendrite Codec.',
      },
    ],
  },
  {
    title: 'WILD 2.0',
    summary:
      "Lead engineer on the ground-up rebuild of a mission-critical naval inventory platform. It is a full rewrite of the legacy VB.NET / ASP.NET 3.5 Web Forms / Oracle stack onto .NET 8, EF Core, React 19, and an offline-first PWA built with Vite. It is in testing now, ahead of the full cutover.",
    role:
      "Lead engineer. I own the architecture direction, the rebuild plan, and core feature delivery. A lot of the job is balancing the ideal engineering choice against a hard reality: the old system has to keep running in production until the new one is fully ready.",
    details:
      "WILD runs real naval inventory operations, and it was sitting on a stack well past its prime: VB.NET on ASP.NET 3.5 Web Forms talking to Oracle. It was getting harder to maintain, harder to secure, harder to hire for, and harder to integrate with. Since the old system has to keep running until the new one is ready, patching it further didn't make sense. The new build had to be a clean replacement good enough to earn the switch on its own.\n\nBecause it is a ground-up rebuild, the design isn't tied to the old system's choices. A new ASP.NET Core API on .NET 8 sits behind a generic repository layer over Entity Framework Core 8 on MSSQL, with a Dapper data project for the hand-tuned SQL where an ORM gets in the way. Multitenancy is handled at the query layer: a runtime DbContext factory resolves each user's schema, with TTL caching and semaphore-guarded concurrency.\n\nThe front end is React 19 and TypeScript 5 on Vite, with Material-UI and Kendo for components, Zustand for client state, and TanStack Query for server state. Field work sometimes happens with little or no connectivity, so it is an offline-first PWA: Dexie/IndexedDB stores data locally, a delta queue holds outgoing writes, and a Workbox service worker caches by asset type and uses Background Sync to reconcile writes once the connection is back.\n\nOn the operations side: structured Serilog logging with correlation IDs for tracing requests across services, a custom AppException and middleware pattern that maps domain errors to clean HTTP responses, real-time SignalR hubs (backed by hosted background services) for status and notifications, built-in Swagger, and a Docusaurus docs site served from the API. It is in testing ahead of cutover. This is an active, government-adjacent system, so I keep public detail light, but the short version is a full modern rewrite under live operational constraints.",
    impact:
      "Replaces the legacy stack completely at cutover. It makes hiring viable again on a modern platform, clears the old security and integration debt, and adds things the old stack couldn't realistically do: offline operation, real-time status, and modern auth.",
    tags: ['.NET 8', 'C#', 'ASP.NET Core', 'EF Core', 'React 19', 'TypeScript', 'MSSQL', 'Dapper', 'Vite', 'PWA', 'SignalR'],
    accent: 'from-cyan-500/30 via-blue-500/15 to-transparent',
    shelterColor: '90, 180, 230',
    screenshots: [
      {
        src: `${BASE}projects/wild2/01-dashboard.png`,
        caption: 'Dashboard: operational overview at a glance.',
      },
      {
        src: `${BASE}projects/wild2/02-warehouse-editor.png`,
        caption: 'Warehouse editor: configure storage layout and zones.',
      },
      {
        src: `${BASE}projects/wild2/03-location-selector.png`,
        caption: 'Location selector: drill into specific warehouse positions.',
      },
    ],
  },
  {
    title: 'Dendrite Wiki',
    summary:
      'A local-first MCP server that gives AI coding agents a living `docs/wiki/` knowledge base, project memory, and a few good habits. One command, `npx -y dendrite-wiki`, installs it into any agent client. It is on npm and works out of the box with Claude Code, Codex, Cursor, Copilot, Continue, Grok, Windsurf, and Antigravity.',
    role:
      'Creator and sole engineer. I build all of it: the TypeScript MCP server, the TUI installer that handles nine agent clients (down to Windows quirks like `npx.cmd` and `HOME`), the capsule profile that keeps token use low, the tree-sitter doc generators for sixteen languages, the local benchmark harness, and the opt-in telemetry contract.',
    details:
      "DendriteMCP proved that giving AI agents durable project context works, but its Rust core, local LLM, and built-in dashboard are a lot to run if you just want your coding agent to stop forgetting things. Dendrite Wiki is the same idea in a single npm install: no daemon, no Ollama, no separate database. The agent's memory is just a `docs/wiki/` folder of markdown files. VitePress can render it, and you can read, edit, and version-control it like any other code.\n\nSetup is one command. `npx -y dendrite-wiki` opens a TUI installer that detects your project, picks the right agent client, writes the MCP config in the right place, and seeds some starter wiki pages and guidance hooks. It supports Claude Code, Codex, Cursor, GitHub Copilot in VS Code, Continue, Grok Build CLI, Windsurf, Antigravity, and a workspace-local `all` profile.\n\nBy default it exposes just three tools: `dendrite_prepare`, `dendrite_read`, and `dendrite_execute`. That 'capsule' profile drops startup cost from about 5,300 tokens (the full 45-tool catalog) to around 540, and a typical workflow result from ~29k tokens to ~16k. The full toolset is still there when an agent actually needs it. Those savings add up fast across the hundreds of calls a heavy user makes in a day.\n\nIt is more than storage. The server nudges the agent into good habits: read the relevant wiki pages before starting, write down lessons as it learns them, flag stale or drifting pages on a maintenance board, and leave handoff notes when work isn't finished. A separate tree-sitter generator writes API docs straight into the wiki for sixteen languages: TypeScript, Python, Rust, Go, Java, Ruby, C/C++, PHP, C#, Swift, Lua, Scala, Elixir, OCaml, Kotlin, and Bash.\n\nEverything stays local by default. No account, no upload, no telemetry unless you opt in, and even then it only sends sanitized, aggregate counts with a local audit trail. Same test as ever: remove Dendrite tomorrow and `docs/wiki/` is still a working markdown knowledge base.",
    impact:
      "Takes the persistent-context idea from DendriteMCP and makes it something anyone can adopt in one command. It is on npm as `dendrite-wiki`, works with nine agent clients out of the box, and its token savings cut the cost of every agent call.",
    tags: ['TypeScript', 'MCP', 'Node.js', 'npm', 'VitePress', 'Markdown', 'Tree-sitter', 'Local-First', 'CLI'],
    repoUrl: 'https://github.com/mfillalan/dendrite-wiki-mcp',
    liveUrl: 'https://www.npmjs.com/package/dendrite-wiki',
    accent: 'from-emerald-500/30 via-teal-500/15 to-transparent',
    shelterColor: '90, 210, 170',
    screenshots: [
      {
        src: `${BASE}projects/dendrite-wiki/01-wiki-page.png`,
        caption: 'Wiki page: backlinks, source-backed claims, lifecycle metadata, generated table of contents.',
      },
      {
        src: `${BASE}projects/dendrite-wiki/02-review-board.png`,
        caption: 'Review board: stale pages, promotion candidates, memory hygiene, drift findings.',
      },
      {
        src: `${BASE}projects/dendrite-wiki/03-item-detail.png`,
        caption: 'Item detail: a memory entry with reasons and source-backed claims.',
      },
    ],
  }
]

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null)

  // Pause the ambient boid simulation while a project modal is open. The
  // layoutId card→dialog morph is layout-measurement-heavy and the boid
  // canvas competes with it for main-thread time.
  useEffect(() => {
    if (!selected) return
    const root = document.documentElement
    root.dataset.boidsPaused = '1'
    return () => {
      delete root.dataset.boidsPaused
    }
  }, [selected])

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
            02 / Projects
          </p>
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight text-balance">
            Selected work.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <motion.button
              key={p.title}
              // layoutId: when this element shares an id with another animating
              // element (the dialog below), Framer Motion morphs between them.
              layoutId={`project-${p.title}`}
              onClick={() => setSelected(p)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`group text-left relative overflow-hidden rounded-2xl border bg-card p-7 transition-colors ${
                p.featured
                  ? 'md:col-span-2 border-primary/40 hover:border-primary/60'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              {/* Gradient wash specific to project */}
              <div
                className={`absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br ${p.accent} blur-3xl opacity-60 pointer-events-none`}
              />
              {/* Mirror canvas so wandering fish are visible inside the
                  project card (without it, the card's bg-card occludes them
                  on the global background canvas). */}
              <canvas
                data-boid-mirror
                aria-hidden
                className="pointer-events-none absolute inset-0 size-full"
                style={{ zIndex: 1 }}
              />
              <div className="relative" style={{ zIndex: 10 }}>
                {p.featured && (
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      <Sparkles className="size-3.5" /> Latest project
                    </span>
                  </div>
                )}
                {/* Title "paper" — the actual shelter. Inline-block so it
                    hugs the title text and reads as a small floating card
                    that the fish hide behind. */}
                <div className="mb-4">
                  <div
                    className="inline-block rounded-lg bg-card border border-border px-4 py-1.5 shadow-lg shadow-black/20"
                    data-boid-shelter
                    data-boid-shelter-color={p.shelterColor}
                  >
                    <h3 className="font-display text-3xl tracking-tight">
                      {p.title}
                    </h3>
                  </div>
                </div>
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
          from the React tree, required for layoutId morph-out on close. */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Plain backdrop. No backdrop-blur during the morph (huge GPU
                cost stacked on top of layoutId scaling). */}
            <motion.div
              className="absolute inset-0 bg-black/80"
              onClick={() => setSelected(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              layoutId={`project-${selected.title}`}
              // will-change hints GPU promotion; prevents repaint thrash on
              // every frame of the layout animation.
              style={{ willChange: 'transform' }}
              // Snappier morph; the default spring overshoots and runs long.
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-xl"
            >
              {/* Gradient halo deferred until the morph is finished. blur-3xl
                  on a 384px element is ~64px backdrop blur, and recompositing
                  that 60×/sec while scaling is the dominant lag source. */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className={`absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br ${selected.accent} blur-2xl pointer-events-none`}
              />
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-full p-2 hover:bg-accent transition-colors z-10"
              >
                <X className="size-5" />
              </button>
              <div className="relative">
                {/* Title fades in instead of layoutId-morphing, so there's
                    one less shared-element animation running concurrently. */}
                <motion.h3
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
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
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.3 }}
                  className="space-y-7"
                >
                  {selected.screenshots && selected.screenshots.length > 0 && (
                    <ProjectGallery screenshots={selected.screenshots} />
                  )}
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
