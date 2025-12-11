import { vi } from "vitest";
import * as server from "next/server";
import { middleware } from "./middleware";

const { NextResponse } = server;

type MockCookie = { value: string };
type MockRequest = {
    nextUrl: { pathname: string };
    url: string;
    cookies: { get: (key: string) => MockCookie | undefined };
};

const encodeSegment = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");

const createToken = (payload: object) =>
    `${encodeSegment({ alg: "HS256", typ: "JWT" })}.${encodeSegment(
        payload
    )}.signature`;

function makeReq(pathname: string, cookieValue?: string): MockRequest {
    return {
        nextUrl: { pathname },
        url: `http://localhost${pathname}`,
        cookies: {
            get: (key: string) =>
                key === "auth_token" && cookieValue
                    ? { value: cookieValue }
                    : undefined,
        },
    };
}

describe("middleware", () => {
    beforeEach(() => {
        vi.spyOn(NextResponse, "redirect");
        vi.spyOn(NextResponse, "next");
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("deixa rota pública exata passar sem cookie (/)", () => {
        const req = makeReq("/");
        middleware(req as unknown as Parameters<typeof middleware>[0]);
        expect(NextResponse.next).toHaveBeenCalled();
        expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it("redireciona usuário não autenticado de rota protegida para /", () => {
        const req = makeReq("/dashboard");
        middleware(req as unknown as Parameters<typeof middleware>[0]);
        expect(NextResponse.redirect).toHaveBeenCalledWith(
            new URL("/", req.url)
        );
        expect(NextResponse.next).not.toHaveBeenCalled();
    });

    it('redireciona usuário autenticado de "/" para "/dashboard"', () => {
        const req = makeReq("/", "token123");
        middleware(req as unknown as Parameters<typeof middleware>[0]);
        expect(NextResponse.redirect).toHaveBeenCalledWith(
            new URL("/dashboard", req.url)
        );
        expect(NextResponse.next).not.toHaveBeenCalled();
    });

    it("deixa usuário autenticado em rota protegida passar (/portal/qualquer)", () => {
        const req = makeReq("/portal/qualquer", "token123");
        middleware(req as unknown as Parameters<typeof middleware>[0]);
        expect(NextResponse.next).toHaveBeenCalled();
        expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it("deixa rota pública por prefixo passar sem cookie (/recuperar-senha/[code]/[token])", () => {
        const req = makeReq(
            "/recuperar-senha/Mg/cuqlze-a3574692a9db67cc73abb5fe47af5fa0"
        );
        middleware(req as unknown as Parameters<typeof middleware>[0]);
        expect(NextResponse.next).toHaveBeenCalled();
        expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it("normaliza barra final e ainda aplica regra de redirect (autenticado em /cadastro/ → /dashboard)", () => {
        const req = makeReq("/cadastro/", "token123");
        middleware(req as unknown as Parameters<typeof middleware>[0]);
        expect(NextResponse.redirect).toHaveBeenCalledWith(
            new URL("/dashboard", req.url)
        );
        expect(NextResponse.next).not.toHaveBeenCalled();
    });

    it("normaliza barra final e deixa rota pública exata passar sem cookie (/cadastro/)", () => {
        const req = makeReq("/cadastro/");
        middleware(req as unknown as Parameters<typeof middleware>[0]);
        expect(NextResponse.next).toHaveBeenCalled();
        expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it("deixa rota de confirmação passar quando token está no path sem cookie", () => {
        const req = makeReq("/confirmar-email/token123");
        middleware(req as unknown as Parameters<typeof middleware>[0]);
        expect(NextResponse.next).toHaveBeenCalled();
        expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it("redireciona se rota de confirmação não tiver o token no path", () => {
        const req = makeReq("/confirmar-email");
        middleware(req as unknown as Parameters<typeof middleware>[0]);
        expect(NextResponse.redirect).toHaveBeenCalledWith(
            new URL("/", req.url)
        );
        expect(NextResponse.next).not.toHaveBeenCalled();
    });

    it("redireciona se outra rota tiver um token no path", () => {
        const req = makeReq("/alterar-senha/token123");
        middleware(req as unknown as Parameters<typeof middleware>[0]);
        expect(NextResponse.redirect).toHaveBeenCalledWith(
            new URL("/", req.url)
        );
        expect(NextResponse.next).not.toHaveBeenCalled();
    });

    it("deixa rota de confirmação passar mesmo se o usuário já estiver autenticado", () => {
        const req = makeReq("/confirmar-email/token123", "token_cookie_123");
        middleware(req as unknown as Parameters<typeof middleware>[0]);
        expect(NextResponse.next).toHaveBeenCalled();
        expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it("impede usuário não admin de acessar rotas de gestão", () => {
        const token = createToken({ is_app_admin: false });
        const req = makeReq("/dashboard/gestao-usuarios", token);
        middleware(req as unknown as Parameters<typeof middleware>[0]);
        expect(NextResponse.redirect).toHaveBeenCalledWith(
            new URL("/dashboard", req.url)
        );
        expect(NextResponse.next).not.toHaveBeenCalled();
    });

    it("permite usuário admin acessar rotas de gestão", () => {
        const token = createToken({ is_app_admin: true });
        const req = makeReq(
            "/dashboard/gestao-unidades-educacionais/detalhe",
            token
        );
        middleware(req as unknown as Parameters<typeof middleware>[0]);
        expect(NextResponse.next).toHaveBeenCalled();
        expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it("bloqueia acesso quando o token JWT é inválido (não tem 3 partes)", () => {
        const invalidToken = "token.invalido";
        const req = makeReq("/dashboard/gestao-usuarios", invalidToken);
        middleware(req as unknown as Parameters<typeof middleware>[0]);
        expect(NextResponse.redirect).toHaveBeenCalledWith(
            new URL("/dashboard", req.url)
        );
        expect(NextResponse.next).not.toHaveBeenCalled();
    });

    it("bloqueia acesso quando o token JWT tem payload inválido (não é JSON)", () => {
        const invalidToken = "header.not-valid-base64-json.signature";
        const req = makeReq("/dashboard/gestao-usuarios", invalidToken);
        middleware(req as unknown as Parameters<typeof middleware>[0]);
        expect(NextResponse.redirect).toHaveBeenCalledWith(
            new URL("/dashboard", req.url)
        );
        expect(NextResponse.next).not.toHaveBeenCalled();
    });

    it("bloqueia acesso quando o token não tem a propriedade is_app_admin", () => {
        const token = createToken({ other_property: "value" });
        const req = makeReq("/dashboard/gestao-usuarios", token);
        middleware(req as unknown as Parameters<typeof middleware>[0]);
        expect(NextResponse.redirect).toHaveBeenCalledWith(
            new URL("/dashboard", req.url)
        );
        expect(NextResponse.next).not.toHaveBeenCalled();
    });
});
