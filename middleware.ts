import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("appwrite-sessions"); // Adjust this to match your session token key
  const currentPath = req.nextUrl.pathname;

  // Redirect authenticated users away from /sign-in and /sign-up
  if (token && (currentPath === "/sign-in" || currentPath === "/sign-up")) {
    return NextResponse.redirect(new URL("/", req.url)); // Redirect to home or dashboard
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!token && currentPath === "/") {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Allow all other requests to proceed
  return NextResponse.next();
}

// Specify routes where the middleware should apply
export const config = {
  matcher: ["/", "/sign-in", "/sign-up"], // Apply middleware to these routes
};
