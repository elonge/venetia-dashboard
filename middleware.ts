import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')
  const response = NextResponse.next()

  // Check if the domain is the Vercel one
  if (hostname && hostname.includes('vercel.app')) {
    // Add the "noindex" header specifically for this domain
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }

  return response
}
