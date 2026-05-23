import { useState, useCallback } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Cursor from './components/Cursor'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Experience from './sections/Experience'
import Achievements from './sections/Achievements'
import Services from './sections/Services'
import Contact from './sections/Contact'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const handleDone = useCallback(() => setLoaded(true), [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 overflow-x-hidden">
      {/* Loading screen — shown first */}
      {!loaded && <LoadingScreen onDone={handleDone} />}

      {/* Main site — fades in after loading */}
      <div style={{
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.6s ease',
        visibility: loaded ? 'visible' : 'hidden',
      }}>
        <Cursor />
        <ScrollProgress />
        <Navbar />

        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Services />
          <Achievements />
          <Contact />
        </main>

        <Footer />
      </div>
    </div>
  )
}
