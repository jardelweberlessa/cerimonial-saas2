import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const RATE_LIMIT = 60; // req/min por IP para rotas públicas
const store = new Map<string, { count: number, ts: number }>()

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  if (url.pathname === '/sw.js' || url.pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  // Rate limit leve só nas páginas públicas
  const publicPrefixes = ['/login','/rsvp','/e','/pricing','/staff']
  const isPublic = publicPrefixes.some(p => url.pathname.startsWith(p))
  if (isPublic) {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'anon'
    const now = Date.now()
    const rec = store.get(ip) || { count: 0, ts: now }
    if (now - rec.ts > 60_000) { rec.count = 0; rec.ts = now }
    rec.count++; store.set(ip, rec)
    if (rec.count > RATE_LIMIT) return new NextResponse('Too Many Requests', { status: 429 })
  }

  // 🔓 Libera tudo (sem checagem de cookie de sessão)
  return NextResponse.next()
}

// Mantém o matcher padrão
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
