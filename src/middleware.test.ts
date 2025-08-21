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

function makeReq(pathname: string, cookieValue?: string): MockRequest {
    return {
        nextUrl: { pathname },
        url: `http://localhost${pathname}`,
        cookies: {
            get: (key: string) =>
                key === "user_data" && cookieValue
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
});
