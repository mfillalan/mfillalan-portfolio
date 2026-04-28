import '../ResumePage.css';

const highlights = [
  '14 years of professional software engineering experience',
  'Led WILD 2.0 modernization from legacy Web Forms to React + TypeScript + ASP.NET Core',
  'AI-native engineering workflow with durable memory, MCP, and agent tooling',
];

const skills = [
  'C# / .NET',
  'ASP.NET Core',
  'React',
  'TypeScript',
  'JavaScript',
  'MSSQL / Oracle',
  'REST API Design',
  'Legacy Modernization',
  'AI-Native Dev',
  'MCP Protocol',
  'GitHub / CI/CD',
];

const projects = [
  {
    name: 'DendriteMCP',
    summary: 'Open-source MCP server giving AI agents durable, searchable memory — persistent context across sessions.',
    tags: ['TypeScript', 'MCP', 'AI Tooling'],
  },
  {
    name: 'WILD 2.0',
    summary: 'Full-stack modernization of a mission-critical naval inventory system from legacy ASP.NET to React + .NET Core.',
    tags: ['React', 'C#', 'MSSQL', '.NET Core'],
  },
];

const experience = [
  {
    company: 'Serco',
    role: 'Software Engineer',
    period: 'May 2022 - Present',
    details: [
      'Core engineer on WILD, a mission-critical naval web-based inventory management system.',
      'Led WILD 2.0 modernization from VB.NET / ASP.NET 3.5 Web Forms + Oracle to React + TypeScript + ASP.NET Core + MSSQL.',
      'Defined architecture direction, migration strategy, and feature delivery for a live production environment.',
    ],
  },
  {
    company: 'Valiant Integrated Services',
    role: 'Software Engineer',
    period: 'Sep 2021 - May 2022',
    details: [
      'Maintained and enhanced the WILD platform under active contract transition.',
      'Delivered production features and defect fixes on ASP.NET Web Forms + Oracle stack.',
    ],
  },
  {
    company: 'Alliance Technical Services, Inc.',
    role: 'Software Engineer',
    period: 'Feb 2019 - Sep 2021',
    details: [
      'Built and maintained inventory-management features supporting naval operational workflows.',
      'Partnered with stakeholders to turn requirements into production-ready features.',
    ],
  },
  {
    company: 'Serco',
    role: 'Programmer I',
    period: 'Feb 2013 - Nov 2017',
    details: [
      'Developed functionality for WILD inventory management modules.',
      'Supported VB.NET and ASP.NET Web Forms code paths in a long-running production system.',
    ],
  },
  {
    company: 'L-3 Communications',
    role: 'Programmer',
    period: '2009 - 2011',
    details: [
      'Developed new features for SABER, a naval inventory management system using ASP.NET + VB.NET.',
      'Performed SQL Server data cleanup and maintenance to improve data integrity.',
    ],
  },
];

export default function ResumePage() {
  return (
    <section className="resume-page">
      <div className="resume-toolbar no-print">
        <a className="btn btn-secondary" href="#/">Back to Portfolio</a>
        <button className="btn btn-primary" onClick={() => window.print()} type="button">
          Print / Save as PDF
        </button>
      </div>

      <article className="resume-sheet">
        <header className="resume-header">
          <div>
            <h1>Michael Fillalan</h1>
            <p className="resume-title">Software Engineer</p>
            <p className="resume-summary">
              Full-stack engineer with 14 years of production experience and a drive to build
              things that feel as good as they function. I bring a creative, hands-on approach
              to every layer of the stack — from architecture decisions to the small UI details
              that make software genuinely enjoyable to use. Currently deep in AI-native
              development and looking for teams solving interesting problems.
            </p>
          </div>
          <div className="resume-contact">
            <img
              src="/mfillalan-portfolio/profile-photo.jpeg"
              alt="Michael Fillalan"
              className="resume-photo"
            />
            <div className="resume-contact-row">
              <span className="resume-contact-icon">📍</span>
              Virginia Beach, Virginia
            </div>
            <div className="resume-contact-row">
              <span className="resume-contact-icon">✉</span>
              <a href="mailto:mfillalan@gmail.com">mfillalan@gmail.com</a>
            </div>
            <div className="resume-contact-row">
              <span className="resume-contact-icon">💼</span>
              <a href="https://www.linkedin.com/in/michael-fillalan/" target="_blank" rel="noreferrer">
                linkedin.com/in/michael-fillalan
              </a>
            </div>
            <div className="resume-contact-row">
              <span className="resume-contact-icon">⌥</span>
              <a href="https://github.com/mfillalan" target="_blank" rel="noreferrer">
                github.com/mfillalan
              </a>
            </div>
          </div>
        </header>

        <section className="resume-grid">
          <aside className="resume-side">
            <div className="resume-block">
              <h2>Career Highlights</h2>
              <ul>
                {highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="resume-block">
              <h2>Core Skills</h2>
              <ul className="skill-list">
                {skills.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="resume-block hide-on-print">
              <h2>Featured Projects</h2>
              {projects.map((p) => (
                <div className="resume-project-item" key={p.name}>
                  <strong>{p.name}</strong>
                  <p>{p.summary}</p>
                  <div className="resume-project-tags">
                    {p.tags.map((t) => <span key={t}>{t}</span>)}
                  </div>
                </div>
              ))}
            </div>

            <div className="resume-block">
              <h2>Education</h2>
              <p className="resume-edu-school">ECPI University</p>
              <p className="resume-edu-degree">
                M.S. Information Systems<br />2011 – 2012
              </p>
              <p className="resume-edu-degree">
                B.S. Computer Information Science<br />Simulation &amp; Game Programming<br />2006 – 2009
              </p>
            </div>
          </aside>

          <div className="resume-main">
            <h2>Professional Experience</h2>
            <div className="resume-timeline">
              {experience.map((job) => (
                <section key={`${job.company}-${job.role}`} className="resume-job">
                  <div className="resume-job-header">
                    <h3>{job.role}</h3>
                    <span>{job.period}</span>
                  </div>
                  <p className="resume-company">{job.company}</p>
                  <ul>
                    {job.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </section>
      </article>
    </section>
  );
}
