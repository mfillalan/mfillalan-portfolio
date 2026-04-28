import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Contact from './components/Contact'

type ThemeMode = 'editorial' | 'brutalist' | 'studio'

function App() {
  const [theme, setTheme] = useState<ThemeMode>('editorial')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <>
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
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} mfillalan. All rights reserved.</p>
      </footer>
    </>
  )
}

export default App
