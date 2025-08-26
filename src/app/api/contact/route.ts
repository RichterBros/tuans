import nodemailer from 'nodemailer'

type ContactFormPayload = {
  name: string
  phone: string
  email: string
  message: string
  token?: string | null
}

async function verifyRecaptcha(token: string | null | undefined): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) {
    // reCAPTCHA not configured; allow for local testing
    return true
  }
  if (!token) return false
  try {
    const params = new URLSearchParams()
    params.append('secret', secret)
    params.append('response', token)
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
    const data = (await response.json()) as { success: boolean }
    return !!data.success
  } catch {
    return false
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as ContactFormPayload
    const { name, phone, email, message, token } = body

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
    }

    const recaptchaOk = await verifyRecaptcha(token)
    if (!recaptchaOk) {
      return new Response(JSON.stringify({ error: 'reCAPTCHA verification failed' }), { status: 400 })
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


