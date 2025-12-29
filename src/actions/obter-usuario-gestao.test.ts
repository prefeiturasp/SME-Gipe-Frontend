import { describe, it, expect, vi, beforeEach } from "vitest";
import { obterUsuarioGestao } from "./obter-usuario-gestao";
import axios from "axios";

vi.mock("axios");
vi.mock("next/headers", () => ({
    cookies: vi.fn(() => ({
        get: vi.fn((key: string) =>
            key === "auth_token" ? { value: "fake-token" } : undefined
        ),
    })),
}));

describe("obterUsuarioGestao", () => {
    const mockUsuarioData = {
        uuid: "dde1bea9-1e91-4217-b1dc-656abb3d69b4",
        username: "40450525856",
        name: "Marcus Vinicius Silva da Rocha",
        email: "testesgipe23@sme.prefeitura.sp.gov.br",
        cpf: "40450525856",
        cargo: 3360,
        rede: "INDIRETA" as const,
        unidades: ["091952"],
        is_validado: false,
        is_app_admin: false,
        is_core_sso: false,
        is_active: true,
        codigo_eol_unidade: "091952",
        codigo_eol_dre_da_unidade: "108600",
    };

    beforeEach(async () => {
        vi.clearAllMocks();
        const nextHeaders = await import("next/headers");
        vi.mocked(nextHeaders.cookies).mockReturnValue({
            get: vi.fn((key: string) =>
                key === "auth_token" ? { value: "fake-token" } : undefined
            ),
        } as never);
    });

    it("deve buscar usuário com sucesso", async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: mockUsuarioData,
        });

        const resultado = await obterUsuarioGestao(
            "dde1bea9-1e91-4217-b1dc-656abb3d69b4"
        );

        expect(resultado.success).toBe(true);
        if (resultado.success) {
            expect(resultado.data).toEqual(mockUsuarioData);
            expect(resultado.data.name).toBe("Marcus Vinicius Silva da Rocha");
            expect(resultado.data.cargo).toBe(3360);
        }

        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining(
                "/users/gestao-usuarios/dde1bea9-1e91-4217-b1dc-656abb3d69b4"
            ),
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: "Bearer fake-token",
                }),
            })
        );
    });

    it("deve retornar erro quando token não está presente", async () => {
        const { cookies } = await import("next/headers");
        vi.mocked(cookies).mockReturnValue({
            get: vi.fn(() => undefined),
        } as never);

        const resultado = await obterUsuarioGestao("uuid-123");

        expect(resultado.success).toBe(false);
        if (!resultado.success) {
            expect(resultado.error).toBe(
                "Token de autenticação não encontrado"
            );
        }
    });

    it("deve lidar com erro 401 (não autorizado)", async () => {
        vi.mocked(axios.get).mockRejectedValue({
            response: {
                status: 401,
            },
        });

        const resultado = await obterUsuarioGestao("uuid-123");

        expect(resultado.success).toBe(false);
        if (!resultado.success) {
            expect(resultado.error).toBe("Não autorizado");
        }
    });

    it("deve lidar com erro 404 (usuário não encontrado)", async () => {
        vi.mocked(axios.get).mockRejectedValue({
            response: {
                status: 404,
            },
        });

        const resultado = await obterUsuarioGestao("uuid-invalido");

        expect(resultado.success).toBe(false);
        if (!resultado.success) {
            expect(resultado.error).toBe("Usuário não encontrado");
        }
    });

    it("deve lidar com erro 500 (erro interno)", async () => {
        vi.mocked(axios.get).mockRejectedValue({
            response: {
                status: 500,
            },
        });

        const resultado = await obterUsuarioGestao("uuid-123");

        expect(resultado.success).toBe(false);
        if (!resultado.success) {
            expect(resultado.error).toBe("Erro interno no servidor");
        }
    });

    it("deve lidar com mensagem de erro customizada da API", async () => {
        vi.mocked(axios.get).mockRejectedValue({
            response: {
                status: 400,
                data: {
                    detail: "Erro customizado da API",
                },
            },
        });

        const resultado = await obterUsuarioGestao("uuid-123");

        expect(resultado.success).toBe(false);
        if (!resultado.success) {
            expect(resultado.error).toBe("Erro customizado da API");
        }
    });

    it("deve lidar com error.message quando outros campos não existem", async () => {
        vi.mocked(axios.get).mockRejectedValue({
            message: "Network Error",
        });

        const resultado = await obterUsuarioGestao("uuid-123");

        expect(resultado.success).toBe(false);
        if (!resultado.success) {
            expect(resultado.error).toBe("Network Error");
        }
    });

    it("deve buscar usuário com rede DIRETA", async () => {
        const usuarioDireta = {
            ...mockUsuarioData,
            rede: "DIRETA" as const,
            username: "12345",
        };

        vi.mocked(axios.get).mockResolvedValue({
            data: usuarioDireta,
        });

        const resultado = await obterUsuarioGestao("uuid-123");

        expect(resultado.success).toBe(true);
        if (resultado.success) {
            expect(resultado.data.rede).toBe("DIRETA");
            expect(resultado.data.username).toBe("12345");
        }
    });
});
