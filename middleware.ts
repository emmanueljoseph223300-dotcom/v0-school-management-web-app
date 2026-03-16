import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  // First, update the session
  const response = await updateSession(request)

  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/about", "/contact", "/auth/login", "/auth/sign-up", "/auth/sign-up-success", "/auth/error"]
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith("/api/"))

  if (isPublicRoute) {
    return response
  }

  // Create a Supabase client to check the user
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // If no user and trying to access protected route, redirect to login
  if (!user) {
    const redirectUrl = new URL("/auth/login", request.url)
    redirectUrl.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Get the user's role from metadata
  const role = user.user_metadata?.role as string | undefined

  // Role-based route protection
  const isAdminRoute = pathname.startsWith("/admin")
  const isTeacherRoute = pathname.startsWith("/teacher")
  const isStudentRoute = pathname.startsWith("/student")

  // Redirect based on role if accessing wrong dashboard
  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL(role === "teacher" ? "/teacher" : "/student", request.url))
  }

  if (isTeacherRoute && role !== "teacher" && role !== "admin") {
    return NextResponse.redirect(new URL(role === "admin" ? "/admin" : "/student", request.url))
  }

  if (isStudentRoute && role !== "student" && role !== "admin") {
    return NextResponse.redirect(new URL(role === "admin" ? "/admin" : "/teacher", request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
