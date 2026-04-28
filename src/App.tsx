import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Experience from './components/Experience'
import Contact from './components/Contact'
import ResumePage from './components/ResumePage'
import KonamiMatrix from './components/KonamiMatrix'
import AmbientParticles from './components/AmbientParticles'

type Theme = 'light' | 'dark'

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const [isResumeRoute, setIsResumeRoute] = useState(() =>
    window.location.hash.startsWith('#/resume'),
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const onHashChange = () => {
      const nextIsResume = window.location.hash.startsWith('#/resume')
      // Only reset scroll when entering/leaving the resume route,
      // not on every section anchor change.
      setIsResumeRoute((prev) => {
        if (prev !== nextIsResume) window.scrollTo(0, 0)
        return nextIsResume
      })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <div className="relative min-h-screen text-foreground">
      {!isResumeRoute && <AmbientParticles />}
      <KonamiMatrix />
      <Navbar isResumeRoute={isResumeRoute} theme={theme} onToggleTheme={toggleTheme} />

      <main>
        {isResumeRoute ? (
          <ResumePage />
        ) : (
          <>
            <Hero />
            <About />
            <Projects />
            <Skills />
            <Experience />
            <Education />
            <Contact />
          </>
        )}
      </main>

      {!isResumeRoute && (
        <footer className="border-t border-border py-10 px-6">
          <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Michael Fillalan. Built with React, Tailwind & Framer Motion.</p>
            <p
              data-boid-orbit
              className="font-mono text-xs"
              title="Try the Konami code: ↑↑↓↓←→←→BA"
            >
              ↑↑↓↓←→←→BA
            </p>
          </div>
        </footer>
      )}
    </div>
  )
}

export default App
