import { profile } from '../data/profile.js'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative border-t-[3px] border-ink bg-paper">
      <div className="wrap py-16 md:py-24">
        <div className="grid items-end gap-10 md:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <p className="flex items-center gap-4">
              <span className="cjk text-[44px] leading-none text-accent" aria-hidden="true">
                完
              </span>
              <span className="mono text-ink-3">End of volume 01</span>
            </p>
            <p className="display mt-6 text-[clamp(64px,13vw,190px)]">
              Rohit
              <br />
              <span className="outline">Kamble</span>
            </p>
          </div>
          <a href="#home" className="link-arrow self-end">
            Read it again <span className="arr" aria-hidden="true">↑</span>
          </a>
        </div>

        <dl className="mt-14 grid grid-cols-1 gap-8 border-t-2 border-ink pt-8 text-[14px] leading-relaxed sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="mono text-accent">Author</dt>
            <dd className="mt-2">
              {profile.name}
              <br />
              <span className="text-ink-3">Full Stack · AI/ML · Robotics &amp; IoT, Nagpur</span>
            </dd>
          </div>
          <div>
            <dt className="mono text-accent">Set in</dt>
            <dd className="mt-2">Anton, Archivo, Instrument Serif and JetBrains Mono</dd>
          </div>
          <div>
            <dt className="mono text-accent">Made with</dt>
            <dd className="mt-2">React, Vite and Tailwind CSS, prerendered and hosted on Vercel</dd>
          </div>
          <div>
            <dt className="mono text-accent">Elsewhere</dt>
            <dd className="mt-2 flex flex-col">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-block py-1 underline underline-offset-4 hover:text-accent">
                GitHub
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-block py-1 underline underline-offset-4 hover:text-accent">
                LinkedIn
              </a>
              <a href={`mailto:${profile.email}`} className="inline-block py-1 underline underline-offset-4 hover:text-accent">
                Email
              </a>
            </dd>
          </div>
        </dl>
        <p className="mono mt-12 text-ink-3">
          © {year} {profile.name} · Vol. 01
        </p>
      </div>
    </footer>
  )
}
