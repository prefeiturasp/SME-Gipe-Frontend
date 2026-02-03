import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { obterUnidadeGestao } from "./obter-unidade-gestao";

vi.mock("axios");
vi.mock("next/headers", () => ({
    cookies: vi.fn(() => ({
        get: vi.fn((key: string) =>
            key === "auth_token" ? { value: "fake-token" } : undefined
        ),
    })),
}));

describe("obterUnidadeGestao", () => {
    const mockUnidadeData = {
        uuid: "unidade-uuid-123",
        codigo_eol: "093319",
        nome: "EMEF ALMEIDA JUNIOR, PROF. 24",
        tipo_unidade: "EMEF" as const,
        tipo_unidade_label: "EMEF",
        rede: "DIRETA" as const,
        rede_label: "Direta",
        dre_uuid: "1a2766dc-36c8-4bbb-a840-155013526b80",
        dre_nome: "DRE BUTANTÃ",
        sigla: "DRE-BT",
        ativa: true,
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

    it("deve buscar unidade com sucesso", async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: mockUnidadeData,
        });

        const resultado = await obterUnidadeGestao("unidade-uuid-123");

        expect(resultado.success).toBe(true);
        if (resultado.success) {
            expect(resultado.data).toEqual(mockUnidadeData);
            expect(resultado.data.nome).toBe("EMEF ALMEIDA JUNIOR, PROF. 24");
            expect(resultado.data.tipo_unidade).toBe("EMEF");
        }

        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining(
                "/unidades/gestao-unidades/unidade-uuid-123/"
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

        const resultado = await obterUnidadeGestao("uuid-123");

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

        const resultado = await obterUnidadeGestao("uuid-123");

        expect(resultado.success).toBe(false);
        if (!resultado.success) {
            expect(resultado.error).toBe("Não autorizado");
        }
    });

    it("deve lidar com erro 404 (unidade não encontrada)", async () => {
        vi.mocked(axios.get).mockRejectedValue({
            response: {
                status: 404,
            },
        });

        const resultado = await obterUnidadeGestao("uuid-invalido");

        expect(resultado.success).toBe(false);
        if (!resultado.success) {
            expect(resultado.error).toBe("Unidade não encontrada");
        }
    });

    it("deve lidar com erro 500 (erro interno)", async () => {
        vi.mocked(axios.get).mockRejectedValue({
            response: {
                status: 500,
            },
        });

        const resultado = await obterUnidadeGestao("uuid-123");

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

        const resultado = await obterUnidadeGestao("uuid-123");

        expect(resultado.success).toBe(false);
        if (!resultado.success) {
            expect(resultado.error).toBe("Erro customizado da API");
        }
    });

    it("deve lidar com error.message quando outros campos não existem", async () => {
        vi.mocked(axios.get).mockRejectedValue({
            message: "Network Error",
        });

        const resultado = await obterUnidadeGestao("uuid-123");

        expect(resultado.success).toBe(false);
        if (!resultado.success) {
            expect(resultado.error).toBe("Network Error");
        }
    });

    it("deve buscar unidade com rede INDIRETA", async () => {
        const unidadeIndireta = {
            ...mockUnidadeData,
            rede: "INDIRETA" as const,
            rede_label: "Indireta",
            tipo_unidade: "CEI" as const,
            tipo_unidade_label: "CEI",
        };

        vi.mocked(axios.get).mockResolvedValue({
            data: unidadeIndireta,
        });

        const resultado = await obterUnidadeGestao("uuid-123");

        expect(resultado.success).toBe(true);
        if (resultado.success) {
            expect(resultado.data.rede).toBe("INDIRETA");
            expect(resultado.data.tipo_unidade).toBe("CEI");
        }
    });

    it("deve buscar unidade inativa", async () => {
        const unidadeInativa = {
            ...mockUnidadeData,
            ativa: false,
        };

        vi.mocked(axios.get).mockResolvedValue({
            data: unidadeInativa,
        });

        const resultado = await obterUnidadeGestao("uuid-123");

        expect(resultado.success).toBe(true);
        if (resultado.success) {
            expect(resultado.data.ativa).toBe(false);
        }
    });

    it("deve buscar unidade do tipo DRE", async () => {
        const unidadeDRE = {
            ...mockUnidadeData,
            tipo_unidade: "ADM" as const,
            tipo_unidade_label: "DRE",
            nome: "DRE BUTANTÃ",
        };

        vi.mocked(axios.get).mockResolvedValue({
            data: unidadeDRE,
        });

        const resultado = await obterUnidadeGestao("uuid-123");

        expect(resultado.success).toBe(true);
        if (resultado.success) {
            expect(resultado.data.tipo_unidade).toBe("ADM");
            expect(resultado.data.nome).toBe("DRE BUTANTÃ");
        }
    });
});
