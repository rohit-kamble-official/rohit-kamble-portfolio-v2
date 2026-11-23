import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar.jsx'
import CursorGlow from './components/CursorGlow.jsx'
import Hero from './sections/Hero.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Below-the-fold sections are separate chunks. Their HTML is fully prerendered at build time,
// and React hydrates each Suspense boundary on its own (selective hydration), keeping the
// main thread free during start-up.
const About = lazy(() => import('./sections/About.jsx'))
const Skills = lazy(() => import('./sections/Skills.jsx'))
const Experience = lazy(() => import('./sections/Experience.jsx'))
const Projects = lazy(() => import('./sections/Projects.jsx'))
const Certifications = lazy(() => import('./sections/Credentials.jsx').then((m) => ({ default: m.Certifications })))
const Education = lazy(() => import('./sections/Credentials.jsx').then((m) => ({ default: m.Education })))
const Achievements = lazy(() => import('./sections/Credentials.jsx').then((m) => ({ default: m.Achievements })))
const GitHubActivity = lazy(() => import('./sections/GitHubActivity.jsx'))
const Contact = lazy(() => import('./sections/Contact.jsx'))
const Footer = lazy(() => import('./components/Footer.jsx'))

const SectionError = () => (
  <div className="container-x py-16 text-center text-[15px] text-fg-2" role="alert">
    This section couldn&apos;t load.{' '}
    <button type="button" className="underline underline-offset-4 hover:text-white" onClick={() => window.location.reload()}>
      Reload the page
    </button>
  </div>
)

// Each lazy section gets its own error boundary, so one failed chunk never blanks the page.
const Section = ({ children }) => (
  <ErrorBoundary fallback={<SectionError />}>
    <Suspense fallback={null}>{children}</Suspense>
  </ErrorBoundary>
)

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="scroll-progress" aria-hidden="true" />
      <CursorGlow />
      <Navbar />
      <main id="main" tabIndex={-1} className="relative outline-none">
        <Hero />
        <Section>
          <About />
        </Section>
        <Section>
          <Skills />
        </Section>
        <Section>
          <Experience />
        </Section>
        <Section>
          <Projects />
        </Section>
        <Section>
          <Certifications />
        </Section>
        <Section>
          <Education />
        </Section>
        <Section>
          <Achievements />
        </Section>
        <Section>
          <GitHubActivity />
        </Section>
        <Section>
          <Contact />
        </Section>
      </main>
      <Section>
        <Footer />
      </Section>
      <div className="noise" aria-hidden="true" />
    </>
  )
}
