import { describe, it, expect, vi, beforeEach } from "vitest";
import { obterAnexos } from "./obter-anexos";
import apiAnexos from "@/lib/axios-anexos";

vi.mock("@/lib/axios-anexos");
vi.mock("next/headers", () => ({
    cookies: vi.fn(() => ({
        get: vi.fn((key: string) =>
            key === "auth_token" ? { value: "fake-token" } : undefined
        ),
    })),
}));

describe("obterAnexos", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        const nextHeaders = await import("next/headers");
        vi.mocked(nextHeaders.cookies).mockReturnValue({
            get: vi.fn((key: string) =>
                key === "auth_token" ? { value: "fake-token" } : undefined
            ),
        } as never);
    });

    it("deve buscar anexos com sucesso", async () => {
        const mockResponse = {
            data: {
                count: 2,
                next: null,
                previous: null,
                results: [
                    {
                        uuid: "anexo-uuid-1",
                        nome_original: "documento1.pdf",
                        categoria: "boletim_ocorrencia",
                        categoria_display: "Boletim de ocorrência",
                        perfil: "diretor",
                        perfil_display: "Diretor de Escola",
                        tamanho_formatado: "1.2 MB",
                        extensao: "pdf",
                        arquivo_url: "https://example.com/anexo1.pdf",
                        criado_em: "2025-11-17T10:00:00Z",
                        usuario_username: "diretor1",
                    },
                    {
                        uuid: "anexo-uuid-2",
                        nome_original: "documento2.pdf",
                        categoria: "relatorio_naapa",
                        categoria_display: "Relatório do NAAPA",
                        perfil: "diretor",
                        perfil_display: "Diretor de Escola",
                        tamanho_formatado: "800 KB",
                        extensao: "pdf",
                        arquivo_url: "https://example.com/anexo2.pdf",
                        criado_em: "2025-11-17T11:00:00Z",
                        usuario_username: "diretor1",
                    },
                ],
            },
        };

        vi.mocked(apiAnexos.get).mockResolvedValue(mockResponse);

        const resultado = await obterAnexos({
            intercorrenciaUuid: "uuid-123",
        });

        expect(resultado.success).toBe(true);
        if (resultado.success) {
            expect(resultado.data).toEqual(mockResponse.data);
            expect(resultado.data.count).toBe(2);
            expect(resultado.data.results).toHaveLength(2);
        }
        expect(apiAnexos.get).toHaveBeenCalledWith(
            "/anexos/?intercorrencia_uuid=uuid-123",
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: "Bearer fake-token",
                }),
            })
        );
    });

    it("deve retornar lista vazia quando não há anexos", async () => {
        const mockResponse = {
            data: {
                count: 0,
                next: null,
                previous: null,
                results: [],
            },
        };

        vi.mocked(apiAnexos.get).mockResolvedValue(mockResponse);

        const resultado = await obterAnexos({
            intercorrenciaUuid: "uuid-123",
        });

        expect(resultado.success).toBe(true);
        if (resultado.success) {
            expect(resultado.data.count).toBe(0);
            expect(resultado.data.results).toEqual([]);
        }
    });

    it("deve retornar erro quando token não está presente", async () => {
        const { cookies } = await import("next/headers");
        vi.mocked(cookies).mockReturnValue({
            get: vi.fn(() => undefined),
        } as never);

        const resultado = await obterAnexos({
            intercorrenciaUuid: "uuid-123",
        });

        expect(resultado.success).toBe(false);
        if (!resultado.success) {
            expect(resultado.error).toBe(
                "Token de autenticação não encontrado"
            );
        }
    });

    it("deve lidar com erro 401 (não autorizado)", async () => {
        const mockError = {
            response: {
                status: 401,
            },
        };

        vi.mocked(apiAnexos.get).mockRejectedValue(mockError);

        const resultado = await obterAnexos({
            intercorrenciaUuid: "uuid-123",
        });

        expect(resultado.success).toBe(false);
        if (!resultado.success) {
            expect(resultado.error).toBe("Não autorizado");
        }
    });

    it("deve lidar com erro 500 (erro interno)", async () => {
        const mockError = {
            response: {
                status: 500,
            },
        };

        vi.mocked(apiAnexos.get).mockRejectedValue(mockError);

        const resultado = await obterAnexos({
            intercorrenciaUuid: "uuid-123",
        });

        expect(resultado.success).toBe(false);
        if (!resultado.success) {
            expect(resultado.error).toBe("Erro interno no servidor");
        }
    });

    it("deve lidar com mensagem de erro customizada da API", async () => {
        const mockError = {
            response: {
                status: 404,
                data: {
                    detail: "Intercorrência não encontrada",
                },
            },
        };

        vi.mocked(apiAnexos.get).mockRejectedValue(mockError);

        const resultado = await obterAnexos({
            intercorrenciaUuid: "uuid-invalido",
        });

        expect(resultado.success).toBe(false);
        if (!resultado.success) {
            expect(resultado.error).toBe("Intercorrência não encontrada");
        }
    });

    it("deve lidar com error.message quando outros campos não existem", async () => {
        const mockError = {
            message: "Network Error",
        };

        vi.mocked(apiAnexos.get).mockRejectedValue(mockError);

        const resultado = await obterAnexos({
            intercorrenciaUuid: "uuid-123",
        });

        expect(resultado.success).toBe(false);
        if (!resultado.success) {
            expect(resultado.error).toBe("Network Error");
        }
    });

    it("deve lidar com paginação quando há next e previous", async () => {
        const mockResponse = {
            data: {
                count: 25,
                next: "https://api.example.com/anexos/?page=2",
                previous: null,
                results: [
                    {
                        uuid: "anexo-uuid-1",
                        nome_original: "documento1.pdf",
                        categoria: "boletim_ocorrencia",
                        categoria_display: "Boletim de ocorrência",
                        perfil: "diretor",
                        perfil_display: "Diretor de Escola",
                        tamanho_formatado: "1.2 MB",
                        extensao: "pdf",
                        arquivo_url: "https://example.com/anexo1.pdf",
                        criado_em: "2025-11-17T10:00:00Z",
                        usuario_username: "diretor1",
                    },
                ],
            },
        };

        vi.mocked(apiAnexos.get).mockResolvedValue(mockResponse);

        const resultado = await obterAnexos({
            intercorrenciaUuid: "uuid-123",
        });

        expect(resultado.success).toBe(true);
        if (resultado.success) {
            expect(resultado.data.count).toBe(25);
            expect(resultado.data.next).toBe(
                "https://api.example.com/anexos/?page=2"
            );
            expect(resultado.data.previous).toBe(null);
        }
    });

    it("deve incluir parâmetro perfil na URL quando fornecido", async () => {
        const mockResponse = {
            data: {
                count: 1,
                next: null,
                previous: null,
                results: [
                    {
                        uuid: "anexo-uuid-1",
                        nome_original: "documento1.pdf",
                        categoria: "boletim_ocorrencia",
                        categoria_display: "Boletim de ocorrência",
                        perfil: "diretor",
                        perfil_display: "Diretor de Escola",
                        tamanho_formatado: "1.2 MB",
                        extensao: "pdf",
                        arquivo_url: "https://example.com/anexo1.pdf",
                        criado_em: "2025-11-17T10:00:00Z",
                        usuario_username: "diretor1",
                    },
                ],
            },
        };

        vi.mocked(apiAnexos.get).mockResolvedValue(mockResponse);

        const resultado = await obterAnexos({
            intercorrenciaUuid: "uuid-123",
            perfil: "UE",
        });

        expect(resultado.success).toBe(true);
        expect(apiAnexos.get).toHaveBeenCalledWith(
            "/anexos/?intercorrencia_uuid=uuid-123&perfil=UE",
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: "Bearer fake-token",
                }),
            })
        );
    });

    it("não deve incluir parâmetro perfil na URL quando não fornecido", async () => {
        const mockResponse = {
            data: {
                count: 0,
                next: null,
                previous: null,
                results: [],
            },
        };

        vi.mocked(apiAnexos.get).mockResolvedValue(mockResponse);

        const resultado = await obterAnexos({
            intercorrenciaUuid: "uuid-123",
        });

        expect(resultado.success).toBe(true);
        expect(apiAnexos.get).toHaveBeenCalledWith(
            "/anexos/?intercorrencia_uuid=uuid-123",
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: "Bearer fake-token",
                }),
            })
        );
    });

    it("não deve incluir parâmetro perfil na URL quando undefined", async () => {
        const mockResponse = {
            data: {
                count: 0,
                next: null,
                previous: null,
                results: [],
            },
        };

        vi.mocked(apiAnexos.get).mockResolvedValue(mockResponse);

        const resultado = await obterAnexos({
            intercorrenciaUuid: "uuid-123",
            perfil: undefined,
        });

        expect(resultado.success).toBe(true);
        expect(apiAnexos.get).toHaveBeenCalledWith(
            "/anexos/?intercorrencia_uuid=uuid-123",
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: "Bearer fake-token",
                }),
            })
        );
    });
});
