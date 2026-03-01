// proxy.ts na raiz do projeto
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  return NextResponse.next()
}
