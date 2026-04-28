export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <p>
            I've been writing code since I was 11 years old — what started as curiosity
            turned into a 14-year professional career building real-world software. For the
            past several years I've been a core engineer on <strong>WILD</strong>, a web-based
            naval inventory management system, where I've maintained production features and
            recently led a full ground-up modernization of the legacy platform.
          </p>
          <p>
            That modernization — WILD 2.0 — took the system from VB.NET / ASP.NET 3.5 Web
            Forms with an Oracle database to a modern stack: <strong>React + TypeScript</strong> on
            the front end, <strong>ASP.NET Core</strong> on the back end, and <strong>MSSQL</strong>.
            Architecting and driving that transition has been the most technically rewarding work
            of my career so far.
          </p>
          <p>
            Over the past year I've made a deliberate shift to becoming a fully
            <strong> AI-native software engineer</strong> — not just using AI tools, but deeply
            integrating them into every part of how I design, build, and ship software. I'm
            actively building tooling in this space and am looking for a team where that mindset
            is a strength, not a novelty.
          </p>
        </div>
      </div>
    </section>
  );
}
