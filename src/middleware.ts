import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/admin'];

// Routes that should be accessible without auth
const PUBLIC_ROUTES = ['/login', '/api', '/articles', '/recipes-view', '/'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the path is a protected admin route
    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    if (!isProtectedRoute) {
        return NextResponse.next();
    }

    // Check for authentication token
    // The token can be in cookies or localStorage (we check cookies in middleware)
    const accessToken = request.cookies.get('accessToken')?.value;

    // Also check for refresh token as a backup indicator of auth
    const refreshToken = request.cookies.get('refreshToken')?.value;

    const isAuthenticated = !!accessToken || !!refreshToken;

    if (!isAuthenticated) {
        // Redirect to login page
        const loginUrl = new URL('/login', request.url);
        // Optionally, add a redirect parameter so user can return after login
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
    matcher: [
        // Match all admin routes
        '/admin/:path*',
    ],
};
