import { useScrollReveal } from '../hooks/useScrollReveal';

interface Job {
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

const experience: Job[] = [
  {
    company: 'Serco',
    role: 'Software Engineer',
    period: 'May 2022 – Present',
    bullets: [
      'Core engineer on WILD, a mission-critical naval web-based inventory management system used across U.S. Navy programs.',
      'Led the full ground-up modernization of the legacy platform (WILD 2.0) — migrating from VB.NET / ASP.NET 3.5 Web Forms + Oracle to React, TypeScript, ASP.NET Core, and MSSQL.',
      'Architected front-end component structure, API contracts, and data migration strategy for WILD 2.0.',
      'Transitioned to AI-native development practices, integrating AI tooling deeply into the engineering workflow to accelerate delivery and code quality.',
    ],
  },
  {
    company: 'Valiant Integrated Services',
    role: 'Software Engineer',
    period: 'September 2021 – May 2022',
    bullets: [
      'Continued development and maintenance on the WILD inventory management system under contract.',
      'Delivered new features and bug fixes across the ASP.NET Web Forms / Oracle stack.',
    ],
  },
  {
    company: 'Alliance Technical Services, Inc.',
    role: 'Software Engineer',
    period: 'February 2019 – September 2021',
    bullets: [
      'Maintained and enhanced WILD, supporting day-to-day naval inventory operations.',
      'Collaborated with stakeholders to gather requirements and translate them into working features.',
    ],
  },
  {
    company: 'Serco',
    role: 'Programmer I',
    period: 'February 2013 – November 2017',
    bullets: [
      'Developed new functionality for the WILD inventory management system.',
      'Worked with ASP.NET Web Forms and VB.NET back end, maintaining and extending core modules.',
    ],
  },
  {
    company: 'L-3 Communications',
    role: 'Programmer',
    period: '2009 – 2011',
    bullets: [
      'Developed new features for SABER, a naval inventory management system built on ASP.NET with a VB.NET back end.',
      'Performed SQL Server data cleanup and maintenance to improve data integrity.',
    ],
  },
];

export default function Experience() {
  const ref = useScrollReveal();
  return (
    <section id="experience" className="section section-alt reveal" ref={ref as React.RefObject<HTMLElement>}>
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
