import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import MagneticButton from './MagneticButton';

export default function Contact() {
  const ref = useScrollReveal();
  const [toastVisible, setToastVisible] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('mfillalan@gmail.com').then(() => {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    });
  };

  return (
    <section id="contact" className="section reveal" ref={ref as React.RefObject<HTMLElement>}>
      <div className="container contact-container">
        <h2 className="section-title">Get in Touch</h2>
        <p>I'm currently open to new opportunities. Feel free to reach out!</p>
        <div className="contact-links">
          <MagneticButton onClick={copyEmail} className="btn btn-primary">
            Copy Email
          </MagneticButton>
          <MagneticButton href="https://github.com/mfillalan" target="_blank" rel="noreferrer" className="btn btn-secondary">
            GitHub
          </MagneticButton>
          <MagneticButton href="https://linkedin.com/in/michael-fillalan" target="_blank" rel="noreferrer" className="btn btn-secondary">
            LinkedIn
          </MagneticButton>
        </div>
      </div>
      {toastVisible && <div className="toast">✓ Email copied to clipboard!</div>}
    </section>
  );
}
