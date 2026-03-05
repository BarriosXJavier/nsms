import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

// Define public paths that don't require authentication
const publicPaths = ["/", "/signin"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check authentication
  const session = await auth()

  // Redirect authenticated users away from signin page
  if (session && pathname === "/signin") {
    const role = session.user.role.toLowerCase()
    return NextResponse.redirect(new URL(`/${role}`, request.url))
  }

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Redirect to signin if not authenticated
  if (!session && (pathname.startsWith("/(dashboard)") || pathname.startsWith("/list") || pathname.startsWith("/admin") || pathname.startsWith("/teacher") || pathname.startsWith("/student") || pathname.startsWith("/parent"))) {
    const signInUrl = new URL("/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Role-based access control
  if (session) {
    const role = session.user.role.toLowerCase()
    
    // Check if user is accessing their allowed dashboard
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL(`/${role}`, request.url))
    }
    if (pathname.startsWith("/teacher") && role !== "teacher" && role !== "admin") {
      return NextResponse.redirect(new URL(`/${role}`, request.url))
    }
    if (pathname.startsWith("/student") && role !== "student" && role !== "admin") {
      return NextResponse.redirect(new URL(`/${role}`, request.url))
    }
    if (pathname.startsWith("/parent") && role !== "parent" && role !== "admin") {
      return NextResponse.redirect(new URL(`/${role}`, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
