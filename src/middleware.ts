import { NextRequest, NextResponse } from "next/server";

const PUBLIC_EXACT = new Set<string>(["/", "/cadastro", "/recuperar-senha"]);
const PUBLIC_PREFIXES = ["/recuperar-senha"];

const AUTH_REDIRECT_EXACT = new Set<string>(["/", "/cadastro"]);

const normalize = (p: string) => (p !== "/" ? p.replace(/\/+$/, "") : "/");

function isPublic(pathname: string) {
    const path = normalize(pathname);
    if (PUBLIC_EXACT.has(path)) return true;
    return PUBLIC_PREFIXES.some(
        (prefix) => path === prefix || path.startsWith(prefix + "/")
    );
}

function shouldRedirectAuthed(pathname: string) {
    const path = normalize(pathname);
    return AUTH_REDIRECT_EXACT.has(path);
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isAuthenticated = Boolean(request.cookies.get("auth_token")?.value);

    if (!isAuthenticated && !isPublic(pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (isAuthenticated && shouldRedirectAuthed(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
