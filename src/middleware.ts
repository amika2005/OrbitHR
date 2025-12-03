import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password",
  "/reset-password",
  "/api/webhooks(.*)", // Clerk webhooks
  "/hris",
  "/ats",
  "/contact",
  "/api/uploadthing"
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const pathname = req.nextUrl.pathname;

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Require authentication for protected routes
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Get role from Clerk public metadata
  const userRole = (sessionClaims?.metadata as any)?.role as string | undefined;

  // Redirect authenticated users away from auth pages
  if (isAuthRoute(pathname)) {
    // Default to dashboard if no role, otherwise use role-based routing
    const redirectUrl = userRole === "EMPLOYEE" ? "/portal" : "/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // Role-based access control (only if role exists)
  if (userRole) {
    const isPortalRoute = pathname.startsWith("/portal");
    const isDashboardRoute = pathname.startsWith("/dashboard");

    if (isPortalRoute && userRole !== "EMPLOYEE") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (isDashboardRoute && userRole === "EMPLOYEE") {
      return NextResponse.redirect(new URL("/portal", req.url));
    }
  }

  // Add user context to headers
  const response = NextResponse.next();
  response.headers.set("x-user-id", userId);
  if (userRole) {
    response.headers.set("x-user-role", userRole);
  }
  return response;
});

function isAuthRoute(pathname: string): boolean {
  return ["/sign-in", "/sign-up"].some((route) => 
    pathname.startsWith(route)
  );
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};