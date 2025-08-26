import nodemailer from 'nodemailer'

export async function GET(): Promise<Response> {
  try {
    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT || 587)
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const from = process.env.SMTP_FROM || user
    const to = process.env.SMTP_TO || user

    const missing: string[] = []
    if (!host) missing.push('SMTP_HOST')
    if (!user) missing.push('SMTP_USER')
    if (!pass) missing.push('SMTP_PASS')
    if (!from) missing.push('SMTP_FROM')
    if (!to) missing.push('SMTP_TO')
    if (missing.length) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Missing vars', missing, port }),
        { status: 400 }
      )
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    try {
      await transporter.verify()
      return new Response(JSON.stringify({ ok: true, host, port, secure: port === 465 }), {
        status: 200,
      })
    } catch (err: unknown) {
      return new Response(
        JSON.stringify({ ok: false, stage: 'verify', message: (err as any)?.message || String(err) }),
        { status: 500 }
      )
    }
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ ok: false, stage: 'unexpected', message: (err as any)?.message || String(err) }),
      { status: 500 }
    )
  }
}


