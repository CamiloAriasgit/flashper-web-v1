// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  }); // <--- Punto y coma vital aquí

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return (request.cookies as any).get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          (request.cookies as any).set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          }); // <--- Punto y coma vital aquí
          (response.cookies as any).set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          (request.cookies as any).set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          }); // <--- Punto y coma vital aquí
          (response.cookies as any).set({ name, value: '', ...options });
        },
      },
    }
  );

  // Refrescar sesión
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};