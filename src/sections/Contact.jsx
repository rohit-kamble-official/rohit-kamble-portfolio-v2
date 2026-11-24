import { useId, useRef, useState } from 'react'
import { profile } from '../data/profile.js'
import { ChapterHead, Reveal } from '../components/ui.jsx'

const EMPTY = { name: '', email: '', subject: '', message: '', company: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const LIMITS = { name: 80, email: 254, subject: 140, message: 5000 }

function validate(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address.'
  if (v.message.trim().length < 10) e.message = 'Please write at least 10 characters.'
  return e
}

function Field({ id, label, error, optional, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {optional && <span className="ml-1.5 normal-case tracking-normal opacity-70">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

const LINKS = [
  { label: 'GitHub', value: profile.githubUser, href: profile.github },
  { label: 'LinkedIn', value: profile.linkedinHandle, href: profile.linkedin },
]

const lightShadow = '!shadow-[4px_4px_0_var(--color-paper)]'

export default function Contact() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ state: 'idle', message: '' })
  const [copied, setCopied] = useState(false)
  const formRef = useRef(null)

  const set = (key) => (e) => {
    const value = e.target.value
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key]) setErrors((errs) => ({ ...errs, [key]: validate({ ...values, [key]: value })[key] }))
  }
  const onBlur = (key) => () => {
    if (!values[key]) return
    setErrors((errs) => ({ ...errs, [key]: validate(values)[key] }))
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(values.subject || 'Hello Rohit')}&body=${encodeURIComponent(
    `${values.message}${values.name ? `\n\n${values.name}` : ''}`,
  )}`

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status.state === 'sending') return
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length) {
      formRef.current?.querySelector(`#${uid}-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    setStatus({ state: 'sending', message: '' })
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        setStatus({ state: 'success', message: '' })
        setValues(EMPTY)
      } else if (res.status === 400 && data.errors) {
        setErrors(data.errors)
        setStatus({ state: 'idle', message: '' })
      } else if (res.status === 429) {
        setStatus({ state: 'error', message: 'Too many messages in a short time. Please wait a few minutes, or email me directly.' })
      } else {
        setStatus({ state: 'error', message: "Your message couldn't be sent right now. You can email me directly instead; your text is kept below." })
      }
    } catch {
      setStatus({ state: 'error', message: 'Network error. Check your connection and try again, or email me directly.' })
    }
  }

  const inputProps = (key, extra = {}) => ({
    id: `${uid}-${key}`,
    name: key,
    value: values[key],
    onChange: set(key),
    onBlur: onBlur(key),
    maxLength: LIMITS[key],
    'aria-invalid': errors[key] ? 'true' : 'false',
    'aria-describedby': errors[key] ? `${uid}-${key}-error` : undefined,
    className: 'input',
    ...extra,
  })

  return (
    <section id="contact" className="chapter on-dark bg-ink text-paper" aria-labelledby="contact-title">
      <div className="wrap">
        <ChapterHead
          id="contact"
          titleId="contact-title"
          dark
          lines={['Next', 'chapter:', 'your team.']}
          lead="Hiring for software, AI/ML or embedded work, or have something that needs building? Tell me about it and I'll reply by email."
        />

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
          <Reveal>
            <p className="mono text-paper/60">Write to</p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-3 block break-words font-display text-[clamp(22px,2.7vw,38px)] uppercase leading-[1.05] no-underline hover:text-accent"
            >
              {profile.email.split('@')[0]}
              <wbr />@{profile.email.split('@')[1]}
            </a>
            <div className="mt-7 flex flex-wrap gap-4">
              <button type="button" onClick={copyEmail} className={`btn btn-accent ${lightShadow}`}>
                {copied ? 'Copied ✓' : 'Copy email'}
              </button>
              <a href={profile.resume} download={profile.resumeFileName} className={`btn border-paper text-paper ${lightShadow}`}>
                Resume (PDF)
              </a>
            </div>
            <p className="sr-only" aria-live="polite">
              {copied ? 'Email address copied to clipboard' : ''}
            </p>

            <ul className="mt-12 border-t-2 border-paper/30">
              {LINKS.map((l) => (
                <li key={l.label} className="border-b-2 border-paper/30">
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 py-5 no-underline">
                    <span className="min-w-0">
                      <span className="mono block text-paper/60">{l.label}</span>
                      <span className="mt-1 block truncate font-display text-[clamp(20px,2.4vw,26px)] uppercase leading-tight group-hover:text-accent">
                        {l.value}
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-[22px] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">
                      ↗
                    </span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-10 border-2 border-paper/30 p-5">
              <p className="mono flex items-center gap-2 text-accent">
                <span className="status-dot" aria-hidden="true" /> {profile.availability}
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-paper/75">
                {profile.workPreference}. Based in {profile.location}.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120} className="relative border-2 border-paper bg-[#1d1c19] p-6 shadow-[8px_8px_0_var(--accent)] sm:p-9">
            {status.state === 'success' ? (
              <div className="flex min-h-[420px] flex-col items-start justify-center" role="status">
                <p className="mono text-accent">Message received</p>
                <h3 className="display mt-4 text-[52px]">Thank you!</h3>
                <p className="mt-4 max-w-sm text-[16px] text-paper/75">Your message is on its way to my inbox. I&apos;ll reply to the email address you gave.</p>
                <button type="button" className={`btn mt-8 border-paper text-paper ${lightShadow}`} onClick={() => setStatus({ state: 'idle', message: '' })}>
                  Send another
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-7" aria-describedby={`${uid}-form-note`}>
                <h3 className="display text-[38px]">Send a message</h3>
                <div className="grid gap-7 sm:grid-cols-2">
                  <Field id={`${uid}-name`} label="Name" error={errors.name}>
                    <input {...inputProps('name', { type: 'text', autoComplete: 'name', placeholder: 'Your name', required: true })} />
                  </Field>
                  <Field id={`${uid}-email`} label="Email" error={errors.email}>
                    <input
                      {...inputProps('email', { type: 'email', autoComplete: 'email', inputMode: 'email', placeholder: 'you@example.com', required: true })}
                    />
                  </Field>
                </div>
                <Field id={`${uid}-subject`} label="Subject" optional>
                  <input {...inputProps('subject', { type: 'text', placeholder: 'Role, project or idea' })} />
                </Field>
                <Field id={`${uid}-message`} label="Message" error={errors.message}>
                  <textarea {...inputProps('message', { rows: 5, placeholder: 'What is it, and when do you need it?', required: true })} />
                </Field>
                <div className="mono flex items-center justify-between gap-3 text-[10.5px] text-paper/50">
                  <span id={`${uid}-form-note`}>All fields except subject are required</span>
                  <span aria-hidden="true">
                    {values.message.length}/{LIMITS.message}
                  </span>
                </div>

                {/* Honeypot: hidden from people, tempting for bots */}
                <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor={`${uid}-company`}>Company</label>
                  <input id={`${uid}-company`} name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={set('company')} />
                </div>

                {status.state === 'error' && (
                  <div
                    className="flex flex-col gap-3 border-2 border-[#ff8a7a] p-4 text-[14px] text-[#ffc6bd] sm:flex-row sm:items-center sm:justify-between"
                    role="alert"
                  >
                    <span>{status.message}</span>
                    <a href={mailto} className="btn btn-sm shrink-0 border-paper text-paper">
                      Email instead
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  className={`btn btn-accent w-full ${lightShadow}`}
                  disabled={status.state === 'sending'}
                  aria-busy={status.state === 'sending'}
                >
                  {status.state === 'sending' ? (
                    <>
                      <span className="spinner" aria-hidden="true" /> Sending…
                    </>
                  ) : (
                    <>Send message →</>
                  )}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
