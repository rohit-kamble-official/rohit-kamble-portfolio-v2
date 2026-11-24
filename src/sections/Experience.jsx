import { experience } from '../data/experience.js'
import { education } from '../data/credentials.js'
import { profile } from '../data/profile.js'
import { ChapterHead, Reveal } from '../components/ui.jsx'

const pad = (n) => String(n).padStart(2, '0')

function Job({ job, index }) {
  return (
    <Reveal as="li" className="grid gap-6 border-t-2 border-ink py-10 md:grid-cols-[220px_minmax(0,1fr)] md:gap-12">
      <div>
        <p className="mono text-ink-3">{job.period}</p>
        <p className="mt-2 flex flex-wrap gap-2">
          <span className="stamp stamp-line">{job.type}</span>
        </p>
        <p className="mt-3 text-[14px] text-ink-3">{job.location}</p>
      </div>
      <div>
        <div className="flex items-baseline gap-4">
          <span className="font-display text-[26px] leading-none text-accent">{pad(index + 1)}</span>
          <div>
            <h3 className="display text-[clamp(32px,4.4vw,56px)]">{job.role}</h3>
            <p className="mono mt-2 text-ink-2">{job.company}</p>
          </div>
        </div>
        <p className="mt-5 max-w-2xl text-[16.5px] leading-relaxed text-ink-2">{job.summary}</p>
        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {job.highlights.map((h, i) => (
            <li key={h} className="panel !shadow-[4px_4px_0_var(--color-ink)] p-4">
              <p className="mono text-[10px] text-accent">Shipped {pad(i + 1)}</p>
              <p className="mt-2 text-[15px] leading-relaxed">{h}</p>
            </li>
          ))}
        </ul>
        <p className="mono mt-5 text-[10.5px] text-ink-3">{job.tags.join(' · ')}</p>
      </div>
    </Reveal>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="chapter" aria-labelledby="experience-title">
      <div className="wrap">
        <ChapterHead id="experience" titleId="experience-title" lines={['On', 'the', 'Job']} />

        <Reveal className="mb-10 flex flex-wrap items-center justify-between gap-4 on-dark border-2 border-ink bg-ink p-5 text-paper sm:p-6">
          <div>
            <p className="mono text-accent">Now</p>
            <p className="display mt-2 text-[clamp(28px,3.4vw,40px)]">Looking for my first full-time role</p>
          </div>
          <a href="#contact" className="btn btn-accent">
            Get in touch →
          </a>
        </Reveal>

        <ol className="border-b-2 border-ink">
          {experience.map((job, i) => (
            <Job key={job.id} job={job} index={i} />
          ))}
          <Reveal as="li" className="grid gap-6 border-t-2 border-ink py-10 md:grid-cols-[220px_minmax(0,1fr)] md:gap-12">
            <div>
              <p className="mono text-ink-3">{education.period}</p>
              <p className="mt-2">
                <span className="stamp stamp-ink">Education</span>
              </p>
              <p className="mt-3 text-[14px] text-ink-3">{education.location}</p>
            </div>
            <div>
              <div className="flex items-baseline gap-4">
                <span className="font-display text-[26px] leading-none text-accent">{pad(experience.length + 1)}</span>
                <div>
                  <h3 className="display text-[clamp(32px,4.4vw,56px)]">B.Tech, Electrical Engineering</h3>
                  <p className="mono mt-2 text-ink-2">
                    {education.institute} · {education.minor}
                  </p>
                </div>
              </div>
              <dl className="mt-6 grid max-w-2xl grid-cols-2 border-l-2 border-t-2 border-ink sm:grid-cols-3">
                {[
                  ['CGPA', `${education.cgpa} / ${education.cgpaScale}`],
                  ['Class of', '2026'],
                  ['Final-year project', 'Substation Sentinel'],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col-reverse gap-2 border-b-2 border-r-2 border-ink p-4">
                    <dt className="mono text-[10px] text-ink-3">{k}</dt>
                    <dd className="font-display text-[26px] leading-none">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mono mt-5 text-[10.5px] leading-[1.9] text-ink-3">Coursework: {education.coursework.join(' · ')}</p>
            </div>
          </Reveal>
        </ol>
        <p className="sr-only">{profile.availability}</p>
      </div>
    </section>
  )
}
