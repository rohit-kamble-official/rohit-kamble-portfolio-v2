import { about, profile } from '../data/profile.js'
import { education } from '../data/credentials.js'
import { ChapterHead, Picture, Reveal } from '../components/ui.jsx'

function Panel({ no, className = '', delay = 0, children }) {
  return (
    <Reveal delay={delay} className={`panel p-6 pt-12 sm:p-8 sm:pt-12 ${className}`}>
      <span className="panel-no" aria-hidden="true">
        {no}
      </span>
      {children}
    </Reveal>
  )
}

export default function About() {
  return (
    <section id="about" className="chapter" aria-labelledby="about-title">
      <div className="wrap">
        <ChapterHead id="about" titleId="about-title" lines={['The', 'Author']} />

        <div className="story-grid">
          <Reveal className="panel group relative overflow-hidden !p-0">
            <span className="panel-no z-[2]" aria-hidden="true">
              1
            </span>
            <div className="ink-img relative h-full min-h-[420px] bg-paper-2">
              <Picture
                k="rohit-portrait"
                alt={`Portrait of ${profile.name}`}
                sizes="(min-width: 900px) 600px, 100vw"
                className="absolute inset-0 block"
                imgClassName="h-full w-full object-cover object-[50%_20%]"
              />
              <div className="halftone pointer-events-none absolute inset-0 opacity-[0.18] [mask-image:linear-gradient(to_top,#000,transparent_55%)]" />
            </div>
            <div className="absolute inset-x-0 bottom-0 z-[2] border-t-[2.5px] border-ink bg-paper p-5 sm:p-6">
              <p className="mono text-accent">Nagpur, Maharashtra</p>
              <p className="mt-2 text-[16px] leading-relaxed">
                B.Tech in Electrical Engineering with a minor in Computer Science, {education.institute}. Class of 2026, CGPA{' '}
                {education.cgpa}/10.
              </p>
            </div>
          </Reveal>

          <Panel no="2" delay={80} className="flex items-center justify-center bg-paper-2">
            <blockquote className="bubble max-w-md">
              <p className="serif text-[clamp(24px,2.8vw,32px)] leading-[1.15]">“From circuits to code to intelligence.”</p>
            </blockquote>
          </Panel>

          <Panel no="3" delay={120}>
            <h3 className="display text-[clamp(34px,4vw,48px)]">End to end</h3>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-2">{about.paragraphs[0]}</p>
          </Panel>

          <Panel no="4">
            <h3 className="display text-[38px]">Four internships</h3>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-2">{about.paragraphs[1]}</p>
          </Panel>

          <Panel no="5" delay={80}>
            <h3 className="display text-[38px]">Deadlines</h3>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-2">
              Top 6 of 5,000+ teams at Hack for Impact (IIIT Delhi), 3rd at Tech Trek, 1st at Srujanotsava, and Vice-Chairperson of IEEE SBJITMR.
            </p>
          </Panel>

          <Panel no="6" delay={160} className="on-dark !bg-ink text-paper">
            <p className="mono text-accent">Now</p>
            <h3 className="display mt-3 text-[clamp(40px,4.4vw,56px)]">
              Open to
              <br />
              <span className="outline-paper">full-time</span>
            </h3>
            <p className="mt-4 text-[15.5px] leading-relaxed text-paper/80">Roles where software, AI and hardware meet. {profile.workPreference}.</p>
          </Panel>
        </div>

        <Reveal className="mt-12 flex flex-wrap gap-2">
          {about.strengths.map((s) => (
            <span key={s} className="tag">
              {s}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
