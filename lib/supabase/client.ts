import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          if (typeof document !== 'undefined') {
            const cookie = document.cookie
              .split('; ')
              .find(row => row.startsWith(`${name}=`))
            return cookie ? cookie.split('=')[1] : undefined
          }
          return undefined
        },
        set(name: string, value: string, options: any) {
          if (typeof document !== 'undefined') {
            document.cookie = `${name}=${value}; path=/; max-age=${options.maxAge || 31536000}; SameSite=Lax`
          }
        },
        remove(name: string) {
          if (typeof document !== 'undefined') {
            document.cookie = `${name}=; path=/; max-age=0`
          }
        },
      },
    }
  )
}