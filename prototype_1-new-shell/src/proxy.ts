import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  // Update Supabase session (handles auth token refresh)
  const response = await updateSession(request);
  
  // If updateSession returned a redirect (e.g., to login), use that
  if (response.headers.get('location')) {
    return response;
  }

  // Redirect old contracts route to new agreements route
  if (request.nextUrl.pathname.startsWith("/contracts/in-review")) {
    return NextResponse.redirect(new URL("/agreements", request.url));
  }

  const disabledRoutes = ["/contracts", "/contracts/active"];

  if (disabledRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
