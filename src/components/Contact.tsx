export default function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container contact-container">
        <h2 className="section-title">Get in Touch</h2>
        <p>I'm currently open to new opportunities. Feel free to reach out!</p>
        <div className="contact-links">
          <a
            href="mailto:your.email@example.com"
            className="btn btn-primary"
          >
            Email Me
          </a>
          <a
            href="https://github.com/mfillalan"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/mfillalan"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
