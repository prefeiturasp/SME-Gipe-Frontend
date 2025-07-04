// middleware.test.ts
import { vi } from "vitest";
import * as server from "next/server";
import { middleware } from "./middleware";

const { NextResponse } = server;

type MockRequest = {
    nextUrl: { pathname: string };
    url: string;
    cookies: { get: () => string | undefined };
};

describe("middleware", () => {
    beforeEach(() => {
        vi.spyOn(NextResponse, "redirect");
        vi.spyOn(NextResponse, "next");
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("deixa rota pública passar sem cookie", () => {
        const req: MockRequest = {
            nextUrl: { pathname: "/" },
            url: "http://localhost/",
            cookies: { get: () => undefined },
        };

        middleware(req as unknown as Parameters<typeof middleware>[0]);

        expect(NextResponse.next).toHaveBeenCalled();
        expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it('redireciona usuário não autenticado de "/dashboard" para "/"', () => {
        const req: MockRequest = {
            nextUrl: { pathname: "/dashboard" },
            url: "http://localhost/dashboard",
            cookies: { get: () => undefined },
        };

        middleware(req as unknown as Parameters<typeof middleware>[0]);

        expect(NextResponse.redirect).toHaveBeenCalledWith(
            new URL("/", req.url)
        );
        expect(NextResponse.next).not.toHaveBeenCalled();
    });

    it('redireciona usuário autenticado de "/" para "/dashboard"', () => {
        const req: MockRequest = {
            nextUrl: { pathname: "/" },
            url: "http://localhost/",
            cookies: { get: () => "algum_valor" },
        };

        middleware(req as unknown as Parameters<typeof middleware>[0]);

        expect(NextResponse.redirect).toHaveBeenCalledWith(
            new URL("/dashboard", req.url)
        );
        expect(NextResponse.next).not.toHaveBeenCalled();
    });

    it("deixa usuário autenticado em rota protegida passar", () => {
        const req: MockRequest = {
            nextUrl: { pathname: "/portal/qualquer" },
            url: "http://localhost/portal/qualquer",
            cookies: { get: () => "algum_valor" },
        };

        middleware(req as unknown as Parameters<typeof middleware>[0]);

        expect(NextResponse.next).toHaveBeenCalled();
        expect(NextResponse.redirect).not.toHaveBeenCalled();
    });
});
