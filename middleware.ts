import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()

  // Define public routes that don't need auth
  const publicPaths = [
    '/',              // Home page is public
    '/signin',        // Sign in page
    '/api',           // API routes
    '/auth'           // Auth callback routes
  ]
  
  const isPublicPath = publicPaths.some(path => {
    if (path === '/') {
      return request.nextUrl.pathname === '/'
    }
    return request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + '/')
  })

  // If user is NOT logged in and trying to access protected routes
  if (!user && !isPublicPath) {
    const url = new URL('/signin', request.url)
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // If user IS logged in and trying to access signin page, redirect to admin
  if (user && request.nextUrl.pathname === '/signin') {
    const url = new URL('/admin', request.url)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}