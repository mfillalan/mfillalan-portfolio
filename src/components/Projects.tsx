interface Project {
  title: string;
  description: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
}

const projects: Project[] = [
  {
    title: 'Dendrite MCP Server',
    description:
      'An AI memory and knowledge-graph project built as a Model Context Protocol (MCP) server. Dendrite gives AI agents structured, persistent memory — enabling more coherent long-running workflows and context-aware reasoning across sessions.',
    tags: ['MCP', 'AI', 'TypeScript', 'Node.js', 'Knowledge Graph'],
  },
  {
    title: 'WILD 2.0',
    description:
      'Led the ground-up modernisation of a mission-critical U.S. Navy web-based inventory management system. Migrated the platform from a legacy VB.NET / ASP.NET 3.5 Web Forms + Oracle stack to a fully modern architecture — React + TypeScript front end, ASP.NET Core API, and MSSQL database.',
    tags: ['React', 'TypeScript', 'ASP.NET Core', 'MSSQL', 'C#'],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="section section-alt">
      <div className="container">
        <h2 className="section-title">Projects</h2>
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.title} className="card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <div className="card-links">
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noreferrer">GitHub</a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer">Live Demo</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
