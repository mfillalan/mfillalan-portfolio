const skillGroups = [
  {
    category: 'Languages',
    skills: ['TypeScript', 'JavaScript', 'Python', 'HTML', 'CSS'],
  },
  {
    category: 'Frameworks & Libraries',
    skills: ['React', 'Node.js', 'Express', 'Vite'],
  },
  {
    category: 'Tools & Platforms',
    skills: ['Git', 'GitHub', 'Docker', 'VS Code', 'Linux'],
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
