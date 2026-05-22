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
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 overflow-x-hidden">
      {/* Global UI overlays */}
      <Cursor />
      <ScrollProgress />
      <Navbar />

      {/* Page sections */}
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
  )
}
