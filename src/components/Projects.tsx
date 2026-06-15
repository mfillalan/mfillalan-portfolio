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
    title: 'Dendrite Studio',
    featured: true,
    summary:
      'A native desktop app (Rust + egui, Obsidian-style) for running AI coding agents on your own machine. You give it a goal; a built-in Conductor turns that into a plan, splits it into smaller missions, and runs the ready ones in parallel. Each agent works in its own git worktree, and they all share a memory and skills store that sticks around between sessions.',
    role:
      "Creator and sole engineer. I build the whole Rust stack: the egui desktop UI (file tree, editor, agent chat, and substrate sidebar), the Conductor that plans and schedules missions, the parallel git-worktree runner that merges work back one change at a time, the in-process loop that drives the Grok agent over OAuth, the dendrite-core crate behind it all (memory, skills, missions, campaigns), and the localhost MCP server that hands the substrate back to the agents.",
    details:
      "Dendrite Studio is a command center for AI coding work. Open a project folder and you get a native window with a file tree, a markdown editor, an agent chat panel, and sidebar tabs for the project's memory, skills, and mission board. You hand it a goal, watch the agents work in the chat, check the result, and go again. Each project keeps its own `.dendrite/` store on disk, so its memory travels with the code.\n\nUnder the hood it's a Cargo workspace with two crates. `dendrite-core` is the engine: memory, skills, missions, campaigns, git, and the agent loop. `dendrite-studio` is the egui desktop app around it. Agents sign in with your existing Grok auth (Studio's OAuth or the `grok` CLI's saved session), so you never paste API keys into the app. The store runs in-process for speed and also exposes a localhost MCP server, so agents reach memory and skills through a standard interface.\n\nThe Conductor is the heart of it. Hand it a goal and it writes a plan, breaks the work into missions, and links them by what depends on what. It then runs them in the right order, with a verification step before anything counts as done. Turn parallel mode on and every mission that's ready runs at once, each in its own git worktree on a `dendrite/<slug>` branch, so two agents never edit the same files at the same time. Finished work merges back into the main branch one mission at a time. If a merge hits a conflict, the app stops, marks that mission blocked, and shows you the files instead of guessing or losing work. Once everything passes, the Conductor writes a report.\n\nThe store is the part I care about most. Memory holds lessons, facts, warnings, and handoff notes that survive between sessions, and every recall can explain why it surfaced. The mission board is a kanban the agents drive themselves, with todos, claim leases so two agents don't grab the same work, and missions you can pause and resume. Skills are reusable, versioned recipes agents can find and run. It's all local and private. The test I hold it to: delete Studio tomorrow and your `.dendrite/` memory and skills are still plain, useful files on disk.\n\nDendrite Studio is pre-alpha, built from the ground up in Rust. It started as an Electron and React prototype, which I cut once the native direction was clear; that version is saved at the `electron-final` git tag. CI builds and tests it on Windows on every push.",
    impact:
      "Takes the Dendrite memory-and-skills idea and turns it into a desktop app where you set a goal and the Conductor runs a whole graph of coding missions in parallel, each safely sandboxed in its own git worktree. It's early, but it's the project that best shows where my energy is right now: native speed, agents that remember, and parallel work that stays safe with a human steering.",
    tags: ['Rust', 'egui / eframe', 'Desktop App', 'Multi-Agent', 'Orchestration', 'Git Worktrees', 'MCP', 'Grok / xAI', 'Local-First'],
    repoUrl: 'https://github.com/mfillalan/dendrite-studio',
    accent: 'from-amber-500/30 via-orange-500/15 to-transparent',
    shelterColor: '245, 180, 90',
    screenshots: [
      {
        src: `${BASE}projects/dendrite-studio/01-workspace.png`,
        caption:
          'Workspace: file tree, markdown editor, agent chat, and memory / skills / mission-board tabs in one native window.',
      },
      {
        src: `${BASE}projects/dendrite-studio/02-agent-chat.png`,
        caption: 'Agent chat: an in-process Grok agent streaming its tool calls as it works a mission.',
      },
      {
        src: `${BASE}projects/dendrite-studio/03-mission-board.png`,
        caption: 'Mission board: an agent-driven kanban of missions with dependencies, claim leases, and resumable, parallel runs.',
      },
      {
        src: `${BASE}projects/dendrite-studio/04-memory-skills.png`,
        caption: 'Memory & skills: durable, explainable recall and versioned workflow recipes stored under .dendrite/.',
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
  },
  {
    title: 'DendriteMCP',
    summary:
      'A Rust memory daemon that gives coding agents durable, searchable context across sessions. It is built on SQLite with vector search and a relationship graph, plus a background scheduler that cleans up and consolidates memories on its own using a local LLM.',
    role:
      'Creator and sole engineer. I designed the architecture and built every layer: the Rust core daemon, the MCP stdio bridge, the SQLite schema with vector indexes, the React dashboard, and the Ollama integration. Right now I am building out the memory-decay, drift-detection, and assumption-checking pieces.',
    details:
      "Most coding agents forget everything between sessions. Context and past decisions get rebuilt from scratch every run, which means drift, a lot of repeated explaining, and wasted tool calls. DendriteMCP fixes that with one local daemon that agents can write to and read back from over standard MCP.\n\nThe core is a Rust service on Axum and tokio. All state lives behind an r2d2-pooled SQLite database that uses sqlite-vec for 384-dimensional vector search and FTS5 for full-text, plus a relationship graph (a `node_edges` table) where different edge types fade at different rates. A small TypeScript bridge passes JSON-RPC traffic from agents like Claude Code, Cursor, Copilot, and Codex to the daemon's HTTP endpoints, and handles auto-restart and finding the binary.\n\nMemory comes in three tiers: working (just this session), episodic (a time-ordered log), and semantic (consolidated facts), each with its own decay and embedding rules. Recall happens in two passes: keyword and embedding search pull candidates, then an LLM reranks them. A physarum-inspired (slime-mold) path-flux algorithm walks the graph to surface related work and memories that aren't directly linked.\n\nA background 'subconscious' runs every few minutes on the same tokio runtime. It replays related memories, looks for contradictions, and rolls episodic logs up into semantic facts using a local Ollama model. If Ollama isn't available, it falls back to keyword and embedding scoring so it still works offline.\n\nThe daemon also serves a React + Vite dashboard at /dashboard, styled like a starship bridge, with quests, skills, a knowledge graph, and a live activity feed over SSE. It makes the engineering easy to see at a glance instead of buried in logs.",
    impact:
      "Gives AI-assisted coding real continuity: context that carries over, decisions you can trace back, and a growing store of reusable project knowledge.",
    tags: ['Rust', 'Tokio', 'Axum', 'SQLite', 'Vector Search', 'React', 'TypeScript', 'MCP', 'Ollama', 'Knowledge Graph'],
    accent: 'from-violet-500/30 via-fuchsia-500/15 to-transparent',
    shelterColor: '200, 130, 240',
    screenshots: [
      {
        src: `${BASE}projects/dendritemcp/01-bridge.png`,
        caption: 'Bridge: the Constellation view shows the active mission spread.',
      },
      {
        src: `${BASE}projects/dendritemcp/02-skill-tree.png`,
        caption: 'Skill Tree: weekly progression heatmap across capability areas.',
      },
      {
        src: `${BASE}projects/dendritemcp/03-knowledge-graph.png`,
        caption: 'Knowledge Graph: skills as nodes, relationships as edges.',
      },
      {
        src: `${BASE}projects/dendritemcp/04-quest-beat.png`,
        caption: 'Quest Heat: heatmap grouping quests by recent activity.',
      },
      {
        src: `${BASE}projects/dendritemcp/05-throughput.png`,
        caption: 'Throughput: quest velocity with projected completion.',
      },
      {
        src: `${BASE}projects/dendritemcp/06-library.png`,
        caption: 'Library: captured artifacts, patterns, and runbooks.',
      },
      {
        src: `${BASE}projects/dendritemcp/07-article.png`,
        caption: 'Article: full-text drill-down with chunked sections.',
      },
      {
        src: `${BASE}projects/dendritemcp/08-skill-detail.png`,
        caption: 'Skill detail: observations gathered from real work over time.',
      },
      {
        src: `${BASE}projects/dendritemcp/09-chronicle.png`,
        caption: 'Chronicle: the live activity stream of completed quests.',
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
