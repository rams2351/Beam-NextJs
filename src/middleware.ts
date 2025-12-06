import { NextRequest, NextResponse } from "next/server";

// 1. Define Authentication Routes (Redirect logged-in users AWAY from these)
const authRoutes = ["/login", "/register", "/forgot-password"];

// 2. Define Protected Prefixes (Routes that REQUIRE login)
// Any route starting with these will be blocked for guests
const protectedPrefixes = ["/dashboard", "/profile", "/chat"];

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check for tokens (Access OR Refresh)
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const resetPasswordToken = req.cookies.get("resetPasswordToken");
  const isAuthenticated = !!(accessToken || refreshToken);

  if (path == "/reset-password") {
    if (!resetPasswordToken) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // =============================================================
  // SCENARIO 1: Logged-in user visiting Auth Pages (Login/Register)
  // =============================================================
  if (isAuthenticated && authRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // =============================================================
  // SCENARIO 2: Guest User visiting Protected Pages
  // =============================================================
  // We use .some() to check if the current path STARTS with any protected prefix
  const isProtectedPath = protectedPrefixes.some((prefix) => path.startsWith(prefix));

  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirectTo", path);
    return NextResponse.redirect(loginUrl);
  }

  // =============================================================
  // SCENARIO 3: Everything Else (Public Pages & 404s)
  // =============================================================
  // If we are here, the route is either public OR it doesn't exist.
  // We let Next.js handle it. If it doesn't exist, Next.js renders not-found.tsx.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes - handled separately or let pass)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (svg, png, jpg, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
