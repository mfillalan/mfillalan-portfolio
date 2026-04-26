interface Project {
  title: string;
  description: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
}

const projects: Project[] = [
  {
    title: 'Project One',
    description: 'A brief description of what this project does and the problem it solves.',
    tags: ['React', 'TypeScript', 'Node.js'],
    repoUrl: 'https://github.com/mfillalan',
  },
  {
    title: 'Project Two',
    description: 'A brief description of what this project does and the problem it solves.',
    tags: ['Python', 'FastAPI', 'PostgreSQL'],
    repoUrl: 'https://github.com/mfillalan',
  },
  {
    title: 'Project Three',
    description: 'A brief description of what this project does and the problem it solves.',
    tags: ['Vue', 'TypeScript', 'Firebase'],
    repoUrl: 'https://github.com/mfillalan',
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
