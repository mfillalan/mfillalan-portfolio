export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <div className="hero-intro">
          <img
            src="/mfillalan-portfolio/profile-photo.jpeg"
            alt="Michael Fillalan"
            className="hero-photo"
          />
          <div>
            <h1>Hi, I'm <span className="accent">Michael Fillalan</span></h1>
            <p className="tagline">
              Software Engineer &mdash; 14 years of professional experience building
              production systems, now fully committed to AI-native development.
            </p>
          </div>
        </div>
        <div className="hero-actions">
          <a href="#projects" className="btn btn-primary">View My Work</a>
          <a href="#contact" className="btn btn-secondary">Get in Touch</a>
        </div>
      </div>
    </section>
  );
}
