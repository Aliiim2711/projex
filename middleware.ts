// import { type NextRequest, NextResponse } from 'next/server';
// import { updateSession } from '@/utils/supabase/middleware';
// import { createServerClient } from '@supabase/ssr';

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
  
//   // Define public routes that don't require authentication
//   const publicRoutes = [
//     '/',
//     '/login',
//     '/create-account',
//     '/forget-password',
    
//   ];
  
//   // Allow access to public routes without authentication check
//   if (publicRoutes.includes(pathname)) {
//     return NextResponse.next();
//   }

//   // For protected routes, check authentication using Supabase
//   let response = NextResponse.next({
//     request: {
//       headers: request.headers,
//     },
//   });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return request.cookies.get(name)?.value;
//         },
//         set(name: string, value: string, options: any) {
//           request.cookies.set({
//             name,
//             value,
//             ...options,
//           });
//           response = NextResponse.next({
//             request: {
//               headers: request.headers,
//             },
//           });
//           response.cookies.set({
//             name,
//             value,
//             ...options,
//           });
//         },
//         remove(name: string, options: any) {
//           request.cookies.set({
//             name,
//             value: '',
//             ...options,
//           });
//           response = NextResponse.next({
//             request: {
//               headers: request.headers,
//             },
//           });
//           response.cookies.set({
//             name,
//             value: '',
//             ...options,
//           });
//         },
//       },
//     }
//   );

//   // Get the current session
//   const { data: { session } } = await supabase.auth.getSession();

//   // If no session exists for protected routes, redirect to login
//   if (!session) {
//     const url = request.nextUrl.clone();
//     url.pathname = '/login';
//     return NextResponse.redirect(url);
//   }

//   // Update the session and continue to protected route
//   return await updateSession(request);
// }

// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// };



import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/create-account",
    "/forgot-password",
    "/auth/callback",
    "/auth/reset-password",
    "/auth/auth-error",
  ]

  // Check if the current path matches any public path pattern (including dynamic routes like /profile/:id)
  const isPublicPath =
    publicRoutes.some((route) => {
      if (route.includes(":id")) {
        const pattern = route.replace(":id", "[^/]+")
        const regex = new RegExp(`^${pattern}$`)
        return regex.test(pathname)
      }
      return pathname === route
    }) || pathname.startsWith("/profile/") // Allow public profile pages

  // Allow access to public routes without authentication check
  if (isPublicPath) {
    return NextResponse.next()
  }

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
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session exists for protected routes, redirect to login
  if (!session) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  // If user is logged in and trying to access auth pages, redirect appropriately
  if (session && (pathname === "/login" || pathname === "/create-account")) {
    const nextPath = request.nextUrl.searchParams.get("next") || "/"
    const url = new URL(nextPath, request.url)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
