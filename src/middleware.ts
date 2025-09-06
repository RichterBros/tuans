import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const rawPath = url.pathname

  // Guard: only handle blog paths
  if (!rawPath.startsWith('/blog/')) return NextResponse.next()

  // If path contains a comma (or encoded comma/space), normalize to the first segment
  if (rawPath.includes(',') || rawPath.toLowerCase().includes('%2c')) {
    try {
      const decoded = decodeURIComponent(rawPath)
      const first = decoded.split(',')[0]?.trim() || '/blog'
      if (first && first !== rawPath) {
        const redirectUrl = new URL(url.href)
        redirectUrl.pathname = first
        return NextResponse.redirect(redirectUrl, 308)
      }
    } catch {
      // Fall through on decode errors
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/blog/:path*'],
}


