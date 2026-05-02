import { NextResponse } from 'next/server'

export async function POST(req) {
  // Placeholder Stripe webhook handler. Verify signatures in production.
  try {
    const body = await req.text()
    return new NextResponse('received', { status: 200 })
  } catch (err) {
    return new NextResponse('error', { status: 400 })
  }
}
