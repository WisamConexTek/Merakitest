import { NextResponse } from 'next/server'

/* ═══════════════════════════════════════════════════════════
   CONTACT ENDPOINT

   ⚠ THIS DOES NOT SEND MAIL YET.

   It validates the submission and logs it. Nothing reaches an
   inbox, which means the success state the visitor sees on
   /contact is not yet true end to end — wire this to a real
   transport (SMTP, Resend, SES, a CRM webhook) BEFORE the site
   goes live, or the form will quietly swallow enquiries.

   Everything below is deliberately transport-agnostic so that
   swapping in a provider is a change to one function.
   ═══════════════════════════════════════════════════════════ */

type Submission = {
  name: string
  email: string
  company?: string
  topic?: string
  message: string
}

/* Deliberately permissive. Server-side email validation exists to catch
   obvious mistakes and junk, not to adjudicate RFC 5322 — a stricter
   pattern rejects real addresses, and the only way to truly know an
   address works is to send to it. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const LIMITS = { name: 120, email: 200, company: 200, topic: 80, message: 5000 }

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const submission: Submission = {
      name: clean(body.name, LIMITS.name),
      email: clean(body.email, LIMITS.email),
      company: clean(body.company, LIMITS.company),
      topic: clean(body.topic, LIMITS.topic),
      message: clean(body.message, LIMITS.message),
    }

    if (!submission.name || !submission.email || !submission.message) {
      return NextResponse.json(
        { error: 'Name, email and a message are all required.' },
        { status: 400 },
      )
    }

    if (!EMAIL.test(submission.email)) {
      return NextResponse.json(
        { error: 'That email address does not look right — please check it.' },
        { status: 400 },
      )
    }

    /* TODO: send. Until this line does something, nothing is delivered. */
    console.log('[contact] submission received', {
      ...submission,
      receivedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'We could not process that. Please try again, or call us.' },
      { status: 500 },
    )
  }
}
