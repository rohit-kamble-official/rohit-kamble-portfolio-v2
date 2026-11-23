import { navLinks, profile } from '../data/profile.js'
import Icon from './Icon.jsx'
import { Logo } from './Navbar.jsx'

export default function Footer() {
  const extra = [
    { id: 'education', label: 'Education' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'github', label: 'GitHub Activity' },
  ]
  return (
    <footer className="relative border-t border-white/[0.06]">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-[#7a8cff]/60 to-transparent" />
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <div className="flex items-center gap-3">
            <Logo size={38} />
            <span className="text-lg font-semibold tracking-tight">Rohit Kamble</span>
          </div>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-fg-2">
            Full Stack Developer, AI/ML enthusiast and Robotics &amp; IoT engineer, building intelligent digital experiences from circuits to the cloud.
          </p>
          <div className="mt-6 flex gap-2.5">
            <a className="icon-btn" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
              <Icon name="github" size={18} />
            </a>
            <a className="icon-btn" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
              <Icon name="linkedin" size={17} />
            </a>
            <a className="icon-btn" href={`mailto:${profile.email}`} aria-label="Email Rohit">
              <Icon name="mail" size={18} />
            </a>
            <a className="icon-btn" href={profile.resume} download={profile.resumeFileName} aria-label="Download resume (PDF)">
              <Icon name="file" size={18} />
            </a>
          </div>
        </div>

        <nav aria-label="Footer">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-3">Navigate</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-[15px] md:grid-cols-1">
            {[...navLinks, ...extra].map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="text-fg-2 transition-colors hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-3">Get in touch</p>
          <a href={`mailto:${profile.email}`} className="mt-4 block break-all text-[15px] text-white/90 transition-colors hover:text-brand-blue">
            {profile.email}
          </a>
          <p className="mt-3 flex items-center gap-2 text-[15px] text-fg-2">
            <Icon name="pin" size={16} className="text-fg-3" />
            {profile.location}
          </p>
          <p className="mt-3 flex items-center gap-2.5 text-[15px] text-fg-2">
            <span className="pulse-dot" aria-hidden="true" />
            {profile.availability}
          </p>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-[13px] text-fg-3 sm:flex-row">
          <p>
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Rohit Kamble. Built with React, Three.js &amp; Vite.
          </p>
          <a href="#home" className="group inline-flex items-center gap-2 text-fg-2 transition-colors hover:text-white">
            Back to top
            <span className="grid h-8 w-8 place-items-center rounded-full border border-white/10 transition-transform group-hover:-translate-y-0.5">
              <Icon name="arrowUp" size={15} />
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}
