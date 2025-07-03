// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/"];

function isPublicRoute(pathname: string) {
    return PUBLIC_ROUTES.includes(pathname);
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isPublic = isPublicRoute(pathname);
    const isAuthenticated = !!request.cookies.get("user_data");

    if (!isAuthenticated && !isPublic) {
        return NextResponse.redirect(new URL("/", request.url));
    }
    if (isAuthenticated && pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/login/:path*",
        "/((?!api|_next/static|_next/image|favicon\\.ico|images).*)",
    ],
};
