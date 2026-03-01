// proxy.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  // se não quiser fazer nada, só deixa passar
  return NextResponse.next()
}

// opcional: limite os paths onde roda
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

