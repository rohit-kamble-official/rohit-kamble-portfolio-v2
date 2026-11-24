import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './sections/Hero.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Below-the-fold chapters are separate chunks. Their HTML is fully prerendered at build time,
// and React hydrates each Suspense boundary on its own (selective hydration).
const Work = lazy(() => import('./sections/Work.jsx'))
const Stack = lazy(() => import('./sections/Stack.jsx'))
const About = lazy(() => import('./sections/About.jsx'))
const Experience = lazy(() => import('./sections/Experience.jsx'))
const Receipts = lazy(() => import('./sections/Receipts.jsx'))
const Bring = lazy(() => import('./sections/Bring.jsx'))
const Contact = lazy(() => import('./sections/Contact.jsx'))
const Footer = lazy(() => import('./components/Footer.jsx'))

const SectionError = () => (
  <div className="wrap py-16 text-center text-[15px] text-ink-2" role="alert">
    This chapter couldn&apos;t load.{' '}
    <button type="button" className="underline underline-offset-4 hover:text-accent" onClick={() => window.location.reload()}>
      Reload the page
    </button>
  </div>
)

// Each lazy chapter gets its own error boundary, so one failed chunk never blanks the page.
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
      <Navbar />
      <main id="main" tabIndex={-1} className="relative outline-none">
        <Hero />
        <Section>
          <Work />
        </Section>
        <Section>
          <Stack />
        </Section>
        <Section>
          <About />
        </Section>
        <Section>
          <Experience />
        </Section>
        <Section>
          <Receipts />
        </Section>
        <Section>
          <Bring />
        </Section>
        <Section>
          <Contact />
        </Section>
      </main>
      <Section>
        <Footer />
      </Section>
      <div className="grain" aria-hidden="true" />
    </>
  )
}
