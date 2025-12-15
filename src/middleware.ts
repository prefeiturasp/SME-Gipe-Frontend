import { NextRequest, NextResponse } from "next/server";

const PUBLIC_EXACT = new Set<string>(["/", "/cadastro", "/recuperar-senha"]);
const PUBLIC_PREFIXES = ["/recuperar-senha"];

const normalize = (p: string) => (p !== "/" ? p.replace(/\/+$/, "") : "/");

function isPublic(pathname: string) {
    const path = normalize(pathname);
    if (PUBLIC_EXACT.has(path)) return true;
    return PUBLIC_PREFIXES.some(
        (prefix) => path === prefix || path.startsWith(prefix + "/")
    );
}

interface JWTPayload {
    is_app_admin?: boolean;
    [key: string]: unknown;
}

function decodeJWT(token: string): JWTPayload | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;

        const payload = parts[1];
        const decoded = Buffer.from(payload, "base64").toString("utf-8");
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const authToken = request.cookies.get("auth_token")?.value;
    const isAuthenticated = !!authToken;

    if (pathname.startsWith("/confirmar-email/")) {
        return NextResponse.next();
    }

    if (!isAuthenticated && !isPublic(pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (isAuthenticated && isPublic(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Verifica se o usuário tem permissão de admin GIPE para acessar rotas de gestão
    const isGestaoRoute =
        pathname.includes("/gestao-usuarios") ||
        pathname.includes("/gestao-unidades-educacionais");

    if (isAuthenticated && isGestaoRoute) {
        const decodedToken = decodeJWT(authToken);

        if (!decodedToken?.is_app_admin) {
            // Usuário não é admin do GIPE, redireciona para o dashboard
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return NextResponse.next();
}export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
