// Vercel Serverless Function: POST /api/contact
// Sends portfolio contact-form messages by email through Resend (https://resend.com).
//
// Required environment variable (Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY      API key from resend.com
// Optional:
//   CONTACT_TO_EMAIL    Inbox that receives messages (defaults to the address shown on the site)
//   CONTACT_FROM_EMAIL  Verified sender, e.g. "Portfolio <hello@yourdomain.com>".
//                       Defaults to Resend's test sender, which can only deliver to the email
//                       address that owns the Resend account.

const LIMITS = { name: 80, email: 254, subject: 140, message: 5000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 5
const hits = new Map() // best-effort, per warm instance

function clean(value, max) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max)
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

export function validate({ name, email, message }) {
  const errors = {}
  if (name.length < 2) errors.name = 'Please enter your name.'
  if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.'
  if (message.length < 10) errors.message = 'Please write at least 10 characters.'
  return errors
}

function rateLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > RATE_MAX
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'method_not_allowed' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }
  body = body && typeof body === 'object' ? body : {}

  // Honeypot: real visitors never fill the hidden "company" field.
  if (clean(body.company, 200)) return res.status(200).json({ ok: true })

  const data = {
    name: clean(body.name, LIMITS.name),
    email: clean(body.email, LIMITS.email),
    subject: clean(body.subject, LIMITS.subject),
    message: clean(body.message, LIMITS.message),
  }
  const errors = validate(data)
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, error: 'invalid', errors })

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
    .split(',')[0]
    .trim()
  if (rateLimited(ip)) return res.status(429).json({ ok: false, error: 'rate_limited' })

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return res.status(503).json({ ok: false, error: 'not_configured' })

  const to = process.env.CONTACT_TO_EMAIL || 'itsrohitrk.official@gmail.com'
  const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>'
  const subject = `Portfolio message from ${data.name}${data.subject ? `: ${data.subject}` : ''}`
  const text = `Name: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject || '(none)'}\n\n${data.message}\n`
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#111">
      <h2 style="margin:0 0 12px">New message from your portfolio</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}<br/>
         <strong>Email:</strong> ${escapeHtml(data.email)}<br/>
         <strong>Subject:</strong> ${escapeHtml(data.subject || '(none)')}</p>
      <p style="white-space:pre-wrap;border-left:3px solid #5b8cff;padding-left:12px">${escapeHtml(data.message)}</p>
    </div>`

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: data.email, subject, text, html }),
    })
    if (!response.ok) {
      console.error('[contact] Resend error', response.status, await response.text().catch(() => ''))
      return res.status(502).json({ ok: false, error: 'send_failed' })
    }
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[contact] Network error', err)
    return res.status(502).json({ ok: false, error: 'send_failed' })
  }
}
