import { useState } from 'react'
import SectionHeader from '../components/SectionHeader'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { personalInfo } from '../utils/data'

const contactItems = [
  {
    label: 'Email',
    value: personalInfo.email,
    href: `mailto:${personalInfo.email}`,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <polyline points="2,4 12,13 22,4"/>
      </svg>
    ),
    color: 'hover:border-violet-500 hover:bg-[rgba(124,58,237,0.06)]',
    iconBg: 'bg-[rgba(124,58,237,0.15)] text-violet-400',
  },
  {
    label: 'LinkedIn',
    value: 'rohit-kamble-135575252',
    href: personalInfo.linkedin,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.59 0 4.25 2.36 4.25 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>
      </svg>
    ),
    color: 'hover:border-cyan-500 hover:bg-[rgba(6,182,212,0.06)]',
    iconBg: 'bg-[rgba(6,182,212,0.15)] text-cyan-400',
  },
  {
    label: 'GitHub',
    value: 'rohit-kamble-official',
    href: personalInfo.github,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
    color: 'hover:border-slate-400 hover:bg-[rgba(255,255,255,0.04)]',
    iconBg: 'bg-[rgba(255,255,255,0.08)] text-slate-300',
  },
  {
    label: 'Location',
    value: 'Nagpur, Maharashtra, India',
    href: null,
    icon: '📍',
    color: 'cursor-default border-[rgba(251,191,36,0.15)] bg-[rgba(251,191,36,0.02)]',
    iconBg: 'bg-[rgba(251,191,36,0.12)] text-yellow-400',
    isText: true,
  },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)
  const { ref: leftRef, isVisible: leftVisible } = useScrollReveal()
  const { ref: rightRef, isVisible: rightVisible } = useScrollReveal()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: 'error', msg: 'Please fill in all fields.' })
      return
    }
    setSending(true)
    // Simulate send (replace with EmailJS integration)
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    setStatus({ type: 'success', msg: '✓ Message sent! Rohit will get back to you soon.' })
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setStatus(null), 5000)
  }

  return (
    <section id="contact" className="max-w-6xl mx-auto px-6 py-24">
      <SectionHeader
        label="Let's connect"
        title="Get In Touch"
        subtitle="I'm actively seeking full-time SDE roles. Reach out for opportunities, collaborations, or just to say hi! 🙌"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Contact info */}
        <div
          ref={leftRef}
          className={`space-y-3 transition-all duration-700 ${leftVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
        >
          {contactItems.map((item) => {
            const inner = (
              <>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${item.iconBg}`}>
                  {typeof item.icon === 'string' ? item.icon : item.icon}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-0.5">{item.label}</p>
                  <p className="text-slate-200 text-sm">{item.value}</p>
                </div>
                {item.href && (
                  <div className="ml-auto">
                    <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                )}
              </>
            )

            return item.href ? (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noreferrer"
                className={`flex items-center gap-4 p-4 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] transition-all duration-300 hover:translate-x-1.5 ${item.color}`}
              >
                {inner}
              </a>
            ) : (
              <div key={item.label} className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${item.color}`}>
                {inner}
              </div>
            )
          })}

          {/* Open to work banner */}
          <div className="mt-4 p-5 rounded-2xl border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.04)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_8px_#22c55e] animate-pulse" />
              <p className="text-green-300 font-semibold text-sm">Open to Work</p>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Actively seeking <strong className="text-white">Full-Time SDE / Full-Stack Developer</strong> roles starting 2026. Open to on-site, hybrid, or remote positions across India.
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <div
          ref={rightRef}
          className={`transition-all duration-700 delay-200 ${rightVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
        >
          <form
            onSubmit={handleSubmit}
            className="glass-card rounded-2xl p-8 space-y-5"
          >
            <h3 className="font-syne font-bold text-white text-lg mb-2">Send a Message</h3>

            {[
              { key: 'name', label: 'Your Name', type: 'text', placeholder: 'John Doe' },
              { key: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-xl text-slate-200 placeholder-slate-600 text-sm font-grotesk focus:outline-none focus:border-violet-500 focus:bg-[rgba(124,58,237,0.04)] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)] transition-all duration-300"
                />
              </div>
            ))}

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2">Message</label>
              <textarea
                placeholder="Hey Rohit, I'd like to discuss a role / project..."
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                rows={5}
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-xl text-slate-200 placeholder-slate-600 text-sm font-grotesk resize-none focus:outline-none focus:border-violet-500 focus:bg-[rgba(124,58,237,0.04)] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)] transition-all duration-300"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-violet-900/30"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  Send Message
                </>
              )}
            </button>

            {status && (
              <div className={`text-center text-sm py-2 rounded-lg ${
                status.type === 'success'
                  ? 'text-green-400 bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)]'
                  : 'text-red-400 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)]'
              }`}>
                {status.msg}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
