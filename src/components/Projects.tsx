import { useState } from 'react';
import ProjectModal, { type ProjectDetail } from './ProjectModal';

const projects: ProjectDetail[] = [
  {
    title: 'DendriteMCP',
    summary:
      'Local long-term memory and workflow intelligence for coding agents — giving AI a durable, structured memory that persists across every session.',
    details:
      'DendriteMCP is a Model Context Protocol (MCP) server that solves one of the most frustrating limitations of AI coding agents: they forget everything between sessions.\n\nRather than starting from scratch every time, DendriteMCP gives agents a shared local memory layer backed by a knowledge graph. It tracks a project Charter and long-running Pillars to keep work strategically anchored, manages quests and durable task tracking with automatic skill retrospectives, and stores reusable artifacts so the agent builds project-specific intelligence over time.\n\nUnder the hood a "subconscious caste system" runs Ollama-backed background processes for memory consolidation, drift detection, and doc-sync — essentially a second brain running quietly alongside the primary agent workflow.\n\nThe server targets Codex, Claude Code, GitHub Copilot, and Cursor, and is the successor to an earlier experiment called rpg-memory. Currently under active development toward a BUSL-licensed release as @mfillalan/dendrite-mcp.',
    tags: ['MCP', 'AI', 'TypeScript', 'Node.js', 'Knowledge Graph', 'Ollama', 'LLM'],
    screenshots: [],
  },
  {
    title: 'WILD 2.0',
    summary:
      'Led the ground-up modernisation of a mission-critical U.S. Navy web-based inventory management system — migrating from a legacy VB.NET / ASP.NET 3.5 Web Forms + Oracle stack to React, TypeScript, ASP.NET Core, and MSSQL.',
    details:
      'WILD (Web-based Inventory and Logistics Dashboard) is the primary inventory management platform used across U.S. Navy programs. After years of maintaining the legacy codebase — VB.NET, ASP.NET 3.5 Web Forms, Oracle database — it became clear the platform needed a full ground-up rebuild to stay maintainable and scalable.\n\nI led the architecture and development of WILD 2.0, making all major technical decisions: React + TypeScript for the front end, ASP.NET Core for the API layer, and MSSQL as the new database. The migration involved re-designing the data model, establishing a component library, defining API contracts, and building out the new system in parallel with the live production application.\n\nThe project is ongoing and is the most technically complex work of my career — balancing the demands of a live production system used by real naval operations while incrementally replacing it from the ground up.',
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
