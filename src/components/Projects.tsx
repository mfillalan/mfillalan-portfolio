import { useState } from 'react';
import ProjectModal, { type ProjectDetail } from './ProjectModal';

const projects: ProjectDetail[] = [
  {
    title: 'DendriteMCP',
    summary:
      'Built a local long-term memory system for coding agents so they can retain project context, strategy, and reusable knowledge across sessions.',
    role:
      'Creator and lead engineer. I designed the product direction, memory model, and runtime architecture, and I am implementing the MCP server, CLI flow, and agent integration patterns end-to-end.',
    details:
      'Most coding agents reset between sessions, which causes repeated context loss and rework. DendriteMCP addresses that by giving agents a shared local memory layer backed by graph-linked relationships and durable workflow primitives.\n\nThe system tracks project Charter goals, long-running Pillars, quests/tasks, and reusable artifacts so agent decisions remain aligned over time. I also introduced an Ollama-backed background layer for memory consolidation, drift detection, and doc-sync to keep knowledge fresh without manual overhead.\n\nDendriteMCP is designed to work with modern coding-agent workflows across GitHub Copilot, Cursor, Claude Code, and Codex.',
    impact:
      'Transforms AI-assisted coding from short-lived chat interactions into a persistent engineering workflow with continuity, traceability, and reusable project intelligence.',
    tags: ['MCP', 'AI', 'TypeScript', 'Node.js', 'Knowledge Graph', 'Ollama', 'LLM'],
    screenshots: [],
  },
  {
    title: 'WILD 2.0',
    summary:
      'Leading a full modernization of a mission-critical naval inventory platform from legacy Web Forms to a modern React + TypeScript + ASP.NET Core architecture.',
    role:
      'Lead engineer for the modernization effort. I own architecture direction, implementation strategy, and core feature delivery while balancing migration risk against live operational requirements.',
    details:
      'WILD supports real naval inventory operations, but the legacy stack (VB.NET, ASP.NET 3.5 Web Forms, Oracle) was limiting maintainability and long-term growth.\n\nI am leading WILD 2.0 as a ground-up rebuild to a modern stack: React + TypeScript front end, ASP.NET Core API, and MSSQL data layer. The work includes new API contracts, updated data modeling, and incremental migration planning so delivery can continue without disrupting operational users.\n\nBecause this is an active government-adjacent system, public details are intentionally limited, but the core engineering challenge is large-scale modernization under production constraints.',
    impact:
      'Improves maintainability, developer velocity, and long-term scalability while reducing technical risk in a mission-critical operational platform.',
    tags: ['React', 'TypeScript', 'ASP.NET Core', 'MSSQL', 'C#', '.NET'],
    screenshots: [],
  },
];

export default function Projects() {
  const [selected, setSelected] = useState<ProjectDetail | null>(null);

  return (
    <section id="projects" className="section section-alt">
      <div className="container">
        <h2 className="section-title">Projects</h2>
        <div className="projects-grid">
          {projects.map((project) => (
            <div
              key={project.title}
              className="card clickable"
              onClick={() => setSelected(project)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelected(project)}
            >
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <div className="tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <div className="card-links">
                <span className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
                  Learn More
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
