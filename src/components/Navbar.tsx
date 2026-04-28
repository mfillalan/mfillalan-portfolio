import { useEffect, useState } from 'react';

interface NavbarProps {
  isResumeRoute: boolean;
}

export default function Navbar({ isResumeRoute }: NavbarProps) {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    if (isResumeRoute) return;
    const ids = ['hero', 'about', 'projects', 'skills', 'education', 'experience', 'contact'];
    const onScroll = () => {
      let current = 'hero';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isResumeRoute]);

  return (
    <nav className="navbar">
      <span className="nav-brand">Michael Fillalan</span>
      <ul className="nav-links">
        <li><a href={isResumeRoute ? '#/' : '#hero'} className={!isResumeRoute && activeSection === 'hero' ? 'nav-active' : ''}>Home</a></li>
        {!isResumeRoute && <li><a href="#about" className={activeSection === 'about' ? 'nav-active' : ''}>About</a></li>}
        {!isResumeRoute && <li><a href="#projects" className={activeSection === 'projects' ? 'nav-active' : ''}>Projects</a></li>}
        {!isResumeRoute && <li><a href="#skills" className={activeSection === 'skills' ? 'nav-active' : ''}>Skills</a></li>}
        {!isResumeRoute && <li><a href="#education" className={activeSection === 'education' ? 'nav-active' : ''}>Education</a></li>}
        {!isResumeRoute && <li><a href="#experience" className={activeSection === 'experience' ? 'nav-active' : ''}>Experience</a></li>}
        {!isResumeRoute && <li><a href="#contact" className={activeSection === 'contact' ? 'nav-active' : ''}>Contact</a></li>}
        <li><a href="#/resume">Resume</a></li>
      </ul>
    </nav>
  );
}
