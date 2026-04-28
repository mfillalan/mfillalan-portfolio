const degrees = [
  {
    school: 'ECPI University',
    degree: 'Master of Science, Information Systems',
    period: '2011 – 2012',
    detail: 'Graduate studies focused on enterprise systems, software architecture, and information management.',
  },
  {
    school: 'ECPI University',
    degree: 'B.S. Computer Information Science',
    concentration: 'Simulation & Game Programming',
    period: '2006 – 2009',
    detail: 'Undergraduate program covering software engineering fundamentals, systems design, and applied programming.',
  },
];

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="container">
        <h2 className="section-title">Education</h2>
        <div className="education-list">
          {degrees.map((d) => (
            <div key={d.degree} className="education-card">
              <div className="education-meta">
                <span className="education-period">{d.period}</span>
              </div>
              <div className="education-body">
                <h3 className="education-degree">{d.degree}</h3>
                {d.concentration && (
                  <p className="education-concentration">{d.concentration}</p>
                )}
                <p className="education-school">{d.school}</p>
                <p className="education-detail">{d.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
