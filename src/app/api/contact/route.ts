import nodemailer from 'nodemailer'

type ContactFormPayload = {
  name: string
  phone: string
  email: string
  message: string
  token?: string | null
}

type RecaptchaVerifyResponse = {
  success: boolean
  score?: number
  action?: string
  challenge_ts?: string
  hostname?: string
  'error-codes'?: string[]
}

type RecaptchaResult = {
  ok: boolean
  errors?: string[]
  score?: number
  action?: string
  hostname?: string
}

async function verifyRecaptcha(token: string | null | undefined, remoteIp?: string | null): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) {
    // reCAPTCHA not configured; allow for local testing
    return { ok: true }
  }
  if (!token) return { ok: false, errors: ['missing-input-response'] }
  try {
    const params = new URLSearchParams()
    params.append('secret', secret)
    params.append('response', token)
    if (remoteIp) params.append('remoteip', remoteIp)
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
    const data = (await response.json()) as RecaptchaVerifyResponse
    if (!data.success) {
      console.error('[reCAPTCHA] Verification failed', {
        errors: data['error-codes'],
        action: data.action,
        score: data.score,
        hostname: data.hostname,
      })
    }
    return {
      ok: !!data.success,
      errors: data['error-codes'],
      score: data.score,
      action: data.action,
      hostname: data.hostname,
    }
  } catch (err) {
    console.error('[reCAPTCHA] Verification error', err)
    return { ok: false, errors: ['verification-exception'] }
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as ContactFormPayload
    const { name, phone, email, message, token } = body

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
    }

    const forwardedFor = request.headers.get('x-forwarded-for')
    const clientIp = forwardedFor ? forwardedFor.split(',')[0]?.trim() : null
    const hostHeader = request.headers.get('host') || ''
    const isLocalhost = hostHeader.includes('localhost') || hostHeader.startsWith('127.0.0.1')
    const disableViaEnv = process.env.DISABLE_RECAPTCHA === 'true'
    const bypassRecaptcha = disableViaEnv || (process.env.NODE_ENV !== 'production' && isLocalhost)

    const recaptcha = bypassRecaptcha ? { ok: true } : await verifyRecaptcha(token, clientIp)
    if (!recaptcha.ok) {
      const includeDetails = process.env.DEBUG_RECAPTCHA === 'true' || process.env.NODE_ENV !== 'production'
      const body = includeDetails
        ? { error: 'reCAPTCHA verification failed', details: { errors: recaptcha.errors, action: recaptcha.action, score: recaptcha.score, hostname: recaptcha.hostname } }
        : { error: 'reCAPTCHA verification failed' }
      return new Response(JSON.stringify(body), { status: 400 })
    }

    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT || 587)
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const from = process.env.SMTP_FROM || user
    const to = process.env.SMTP_TO || user

    if (!host || !user || !pass || !from || !to) {
      return new Response(
        JSON.stringify({ error: 'Email transport is not configured on the server.' }),
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    const subject = `New contact form submission from ${name}`
    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || 'N/A'}`,
      '',
      'Message:',
      message,
    ].join('\n')

    const html = `
      <div>
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <hr />
        <p style="white-space:pre-wrap;">${message.replace(/</g, '&lt;')}</p>
      </div>
    `

    await transporter.sendMail({ from, to, subject, text, html })

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to send message' }), { status: 500 })
  }
}


