interface Job {
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

const experience: Job[] = [
  {
    company: 'Company Name',
    role: 'Software Developer',
    period: '2022 – Present',
    bullets: [
      'Built and maintained features for a production web application serving thousands of users.',
      'Collaborated with cross-functional teams to deliver projects on time.',
      'Improved CI/CD pipeline, reducing deployment time by 30%.',
    ],
  },
  {
    company: 'Previous Company',
    role: 'Junior Developer',
    period: '2020 – 2022',
    bullets: [
      'Developed RESTful APIs consumed by web and mobile clients.',
      'Wrote unit and integration tests, increasing coverage from 40% to 80%.',
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section section-alt">
      <div className="container">
        <h2 className="section-title">Work Experience</h2>
        <div className="timeline">
          {experience.map((job) => (
            <div key={job.company + job.role} className="timeline-item">
              <div className="timeline-header">
                <div>
                  <h3>{job.role}</h3>
                  <span className="company">{job.company}</span>
                </div>
                <span className="period">{job.period}</span>
              </div>
              <ul>
                {job.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
