interface NavbarProps {
  isResumeRoute: boolean;
}

export default function Navbar({ isResumeRoute }: NavbarProps) {
  return (
    <nav className="navbar">
      <span className="nav-brand">Michael Fillalan</span>
      <ul className="nav-links">
        <li><a href={isResumeRoute ? '#/' : '#hero'}>Home</a></li>
        {!isResumeRoute && <li><a href="#about">About</a></li>}
        {!isResumeRoute && <li><a href="#projects">Projects</a></li>}
        {!isResumeRoute && <li><a href="#skills">Skills</a></li>}
        {!isResumeRoute && <li><a href="#education">Education</a></li>}
        {!isResumeRoute && <li><a href="#experience">Experience</a></li>}
        {!isResumeRoute && <li><a href="#contact">Contact</a></li>}
        <li><a href="#/resume">Resume</a></li>
      </ul>
    </nav>
  );
}
