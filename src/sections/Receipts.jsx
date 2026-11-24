import { achievements, certifications } from '../data/credentials.js'
import { ChapterHead, Reveal, Tapes } from '../components/ui.jsx'

const pad = (n) => String(n).padStart(2, '0')

function Receipt({ no, rank, title, org, date, body, label, delay }) {
  return (
    <Reveal as="li" delay={delay} className="receipt-wrap">
      <div className="receipt h-full">
      <p className="flex justify-between text-[10.5px] tracking-[0.14em] text-ink-3 uppercase">
        <span>Receipt no. {pad(no)}</span>
        <span>{label}</span>
      </p>
      <hr className="rule-dash my-4" />
      {rank && <p className="font-display text-[44px] leading-none text-accent uppercase">{rank}</p>}
      <h3 className="mt-3 font-sans text-[19px] leading-snug font-semibold">{title}</h3>
      <p className="mt-1.5 text-[11px] tracking-[0.1em] text-ink-2 uppercase">
        {[date, org].filter(Boolean).join(' · ')}
      </p>
      <hr className="rule-dash my-4" />
      <p className="pr-16 font-sans text-[14px] leading-relaxed text-ink-2">{body}</p>
      <span className="receipt-stamp" aria-hidden="true">
        Received
      </span>
      </div>
    </Reveal>
  )
}

export default function Receipts() {
  const tape = achievements.map((a) => `${a.title.replace(' Finalist', '')} · ${a.rank}`)
  return (
    <>
      <section id="receipts" className="chapter" aria-labelledby="receipts-title">
        <div className="wrap">
          <ChapterHead
            id="receipts"
            titleId="receipts-title"
            lines={['The', 'Receipts']}
            lead="Hackathon results, leadership and certifications. Each one is real and on my resume."
          />

          <h3 className="mono mb-6 text-accent">// Results &amp; leadership</h3>
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((a, i) => (
              <Receipt key={a.id} no={i + 1} rank={a.rank} title={a.title} org={a.org} date={a.year} body={a.body} label="Result" delay={(i % 3) * 80} />
            ))}
          </ul>

          <h3 className="mono mb-6 mt-20 text-accent">// Certifications</h3>
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((c, i) => (
              <Receipt
                key={c.id}
                no={achievements.length + i + 1}
                rank={c.badge}
                title={c.title}
                org={c.issuer}
                date={c.date}
                body={c.description}
                label={c.kind}
                delay={(i % 3) * 80}
              />
            ))}
          </ul>
        </div>
      </section>
      <Tapes a={tape} b={['Open to full-time', 'Full-stack builds', 'Applied AI', 'Embedded & IoT']} />
    </>
  )
}
