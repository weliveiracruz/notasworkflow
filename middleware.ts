// Auth temporariamente desabilitada para testes — remover este bypass quando OAuth estiver configurado
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleware(_req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.svg).*)'],
}
