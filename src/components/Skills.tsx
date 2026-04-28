const skillGroups = [
  {
    category: 'Languages',
    skills: ['TypeScript', 'JavaScript', 'C#', 'VB.NET', 'HTML', 'CSS'],
  },
  {
    category: 'Frameworks & Libraries',
    skills: ['React', 'ASP.NET Core', 'Next.js', 'Vue', 'Knockout.js', 'Vite'],
  },
  {
    category: 'Databases',
    skills: ['MSSQL', 'Oracle', 'SQL Server'],
  },
  {
    category: 'UI & Tooling',
    skills: ['shadcn/ui', 'Git', 'GitHub', 'REST APIs', 'MVC'],
  },
  {
    category: 'AI & Emerging',
    skills: ['AI-Native Development', 'MCP (Model Context Protocol)', 'LLM Integration', 'Prompt Engineering'],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <h2 className="section-title">Skills &amp; Tech Stack</h2>
        <div className="skills-grid">
          {skillGroups.map((group) => (
            <div key={group.category} className="skill-group">
              <h3>{group.category}</h3>
              <div className="tags">
                {group.skills.map((skill) => (
                  <span key={skill} className="tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
