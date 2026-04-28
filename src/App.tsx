import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Experience from './components/Experience'
import Contact from './components/Contact'
import ResumePage from './components/ResumePage'

type ThemeMode = 'editorial' | 'brutalist' | 'studio'

function App() {
  const [theme, setTheme] = useState<ThemeMode>('editorial')
  const [isResumeRoute, setIsResumeRoute] = useState(() =>
    window.location.hash.startsWith('#/resume'),
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const onHashChange = () => {
      setIsResumeRoute(window.location.hash.startsWith('#/resume'))
    }

    window.addEventListener('hashchange', onHashChange)
    onHashChange()

    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <>
      {!isResumeRoute && (
        <aside className="theme-switcher" aria-label="Theme switcher">
          <span>Style Lab</span>
          <div className="theme-options">
            <button
              className={theme === 'editorial' ? 'active' : ''}
              onClick={() => setTheme('editorial')}
              type="button"
            >
              Editorial
            </button>
            <button
              className={theme === 'brutalist' ? 'active' : ''}
              onClick={() => setTheme('brutalist')}
              type="button"
            >
              Brutalist
            </button>
            <button
              className={theme === 'studio' ? 'active' : ''}
              onClick={() => setTheme('studio')}
              type="button"
            >
              Studio
            </button>
          </div>
        </aside>
      )}
      <Navbar isResumeRoute={isResumeRoute} />
      <main className={isResumeRoute ? 'resume-route' : ''}>
        {isResumeRoute ? (
          <ResumePage />
        ) : (
          <>
            <Hero />
            <About />
            <Projects />
            <Skills />
            <Education />
            <Experience />
            <Contact />
          </>
        )}
      </main>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} mfillalan. All rights reserved.</p>
      </footer>
    </>
  )
}

export default App
