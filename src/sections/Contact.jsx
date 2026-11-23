import { useId, useRef, useState } from 'react'
import { profile } from '../data/profile.js'
import { spot } from '../lib/hooks.js'
import { Reveal, SectionHeader } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'

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
        {optional && <span className="ml-1.5 font-normal text-fg-3">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="field-error flex items-center gap-1.5" role="alert">
          <Icon name="alert" size={14} />
          {error}
        </p>
      )}
    </div>
  )
}

function ContactCard({ icon, label, value, href, external, download, action }) {
  const inner = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/90">
        <Icon name={icon} size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-3">{label}</span>
        <span className="mt-0.5 block truncate text-[15px] text-white/90">{value}</span>
      </span>
    </>
  )
  return (
    <li className="card spotlight relative flex items-center gap-4 p-4 transition-colors hover:border-white/15" onPointerMove={spot}>
      <a
        href={href}
        className="stretched flex min-w-0 flex-1 items-center gap-4 rounded-xl"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...(download ? { download } : {})}
      >
        {inner}
      </a>
      {action || <Icon name={external ? 'arrowUpRight' : download ? 'download' : 'arrowRight'} size={16} className="shrink-0 text-fg-3" />}
    </li>
  )
}

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
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div aria-hidden="true" className="section-glow left-[10%] top-[30%] h-[420px] w-[520px] bg-[#3b4fd8]/25" />
      <div className="container-x relative">
        <SectionHeader
          id="contact-title"
          eyebrow="Let's connect"
          title={
            <>
              Have a role, a project <span className="text-gradient">or a robot in mind?</span>
            </>
          }
          lead="I'm open to full-time opportunities and collaborations in software, AI and embedded systems. Send a message and I'll reply by email."
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <Reveal>
            <ul className="space-y-3">
              <ContactCard
                icon="mail"
                label="Email"
                value={profile.email}
                href={`mailto:${profile.email}`}
                action={
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="above-stretch icon-btn !h-9 !w-9"
                    aria-label={copied ? 'Email address copied' : 'Copy email address'}
                  >
                    <Icon name={copied ? 'check' : 'copy'} size={16} className={copied ? 'text-[#3ee6a0]' : undefined} />
                  </button>
                }
              />
              <ContactCard icon="linkedin" label="LinkedIn" value={`in/${profile.linkedinHandle}`} href={profile.linkedin} external />
              <ContactCard icon="github" label="GitHub" value={`@${profile.githubUser}`} href={profile.github} external />
              <ContactCard icon="file" label="Resume" value="Download PDF" href={profile.resume} download={profile.resumeFileName} />
            </ul>
            <p className="sr-only" aria-live="polite">
              {copied ? 'Email address copied to clipboard' : ''}
            </p>

            <div className="card mt-5 p-5">
              <p className="flex items-center gap-2.5 text-[15px] font-semibold text-white">
                <span className="pulse-dot" aria-hidden="true" />
                {profile.availability}
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-fg-2">Software development, AI/ML and embedded roles. {profile.workPreference}.</p>
              <p className="mt-3 flex items-center gap-2 text-[13.5px] text-fg-3">
                <Icon name="pin" size={15} />
                {profile.location}
              </p>
            </div>
          </Reveal>

          <Reveal delay={120} className="card relative overflow-hidden p-6 sm:p-8">
            {status.state === 'success' ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center" role="status">
                <span className="grid h-16 w-16 place-items-center rounded-full border border-[#3ee6a0]/40 bg-[#3ee6a0]/10 text-[#3ee6a0]">
                  <Icon name="check" size={28} strokeWidth={2.2} />
                </span>
                <h3 className="mt-6 text-[1.4rem] font-semibold tracking-tight text-white">Message sent. Thank you!</h3>
                <p className="mt-2 max-w-sm text-[15px] text-fg-2">
                  Your message is on its way to my inbox. I&apos;ll reply to the email address you provided.
                </p>
                <button type="button" className="btn btn-secondary btn-sm mt-7" onClick={() => setStatus({ state: 'idle', message: '' })}>
                  Send another message
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5" aria-describedby={`${uid}-form-note`}>
                <h3 className="text-[1.2rem] font-semibold tracking-tight text-white">Send a message</h3>
                <div className="grid gap-5 sm:grid-cols-2">
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
                  <textarea {...inputProps('message', { rows: 6, placeholder: 'Tell me a little about what you have in mind…', required: true })} />
                </Field>
                <div className="flex items-center justify-between gap-3 text-[12px] text-fg-3">
                  <span id={`${uid}-form-note`}>All fields except subject are required.</span>
                  <span className="font-mono" aria-hidden="true">
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
                    className="flex flex-col gap-3 rounded-2xl border border-[#ff7a8a]/30 bg-[#ff7a8a]/[0.07] p-4 text-[14px] text-[#ffc2ca] sm:flex-row sm:items-center sm:justify-between"
                    role="alert"
                  >
                    <span className="flex gap-2.5">
                      <Icon name="alert" size={17} className="mt-0.5 shrink-0" />
                      {status.message}
                    </span>
                    <a href={mailto} className="btn btn-secondary btn-sm shrink-0">
                      <Icon name="mail" size={15} /> Email instead
                    </a>
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-full" disabled={status.state === 'sending'} aria-busy={status.state === 'sending'}>
                  {status.state === 'sending' ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Icon name="send" size={16} />
                      Send message
                    </>
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
