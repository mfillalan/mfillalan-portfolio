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

import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Skills() {
  const ref = useScrollReveal();
  return (
    <section id="skills" className="section reveal" ref={ref as React.RefObject<HTMLElement>}>
      <div className="container">
        <h2 className="section-title">Skills &amp; Tech Stack</h2>
        <div className="skills-grid">
          {skillGroups.map((group, i) => (
            <div key={group.category} className="skill-group" style={{ transitionDelay: `${i * 0.07}s` }}>
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
