import { useState } from 'react';
import MagneticButton from './MagneticButton';

export default function Hero() {
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
    setParallax({ x, y });
  };

  const handleMouseLeave = () => setParallax({ x: 0, y: 0 });

  return (
    <section id="hero" className="hero" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div className="hero-content">
        <div className="hero-intro">
          <img
            src="/mfillalan-portfolio/profile-photo.jpeg"
            alt="Michael Fillalan"
            className="hero-photo"
            style={{
              transform: `translate(${parallax.x}px, ${parallax.y}px)`,
              transition: 'transform 0.18s ease-out',
            }}
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
          <MagneticButton href="#projects" className="btn btn-primary">View My Work</MagneticButton>
          <MagneticButton href="#contact" className="btn btn-secondary">Get in Touch</MagneticButton>
        </div>
      </div>
    </section>
  );
}
