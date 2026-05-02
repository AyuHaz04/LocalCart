import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ products: [] })
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}))
  return NextResponse.json({ ok: true, created: body })
}
