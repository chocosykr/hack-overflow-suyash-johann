import { NextResponse } from 'next/server'

export function middleware(request) {
  // 1. Get the session cookie
  const session = request.cookies.get('session')

  // 2. Define protected routes
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
  const isLogin = request.nextUrl.pathname.startsWith('/login')

  // 3. Logic:
  // If trying to access dashboard WITHOUT session -> Redirect to Login
  if (isDashboard && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If trying to access Login WITH session -> Redirect to Dashboard
  if (isLogin && session) {
    return NextResponse.redirect(new URL('/dashboard/student', request.url))
  }

  return NextResponse.next()
}

// Run this middleware only on specific paths
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}