import { describe, it, expect, vi, beforeEach } from "vitest";
import { enviarAnexoAction } from "./enviar-anexo";
import apiAnexos from "@/lib/axios-anexos";

vi.mock("@/lib/axios-anexos");
vi.mock("next/headers", () => ({
    cookies: vi.fn(() => ({
        get: vi.fn((key: string) =>
            key === "auth_token" ? { value: "fake-token" } : undefined
        ),
    })),
}));

describe("enviarAnexoAction", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        const nextHeaders = await import("next/headers");
        vi.mocked(nextHeaders.cookies).mockReturnValue({
            get: vi.fn((key: string) =>
                key === "auth_token" ? { value: "fake-token" } : undefined
            ),
        } as never);
    });

    it("deve enviar anexo com sucesso", async () => {
        const mockFormData = new FormData();
        mockFormData.append("intercorrencia_uuid", "uuid-123");
        mockFormData.append("perfil", "diretor");
        mockFormData.append("categoria", "boletim_ocorrencia");
        mockFormData.append(
            "arquivo",
            new File(["conteúdo"], "teste.pdf", {
                type: "application/pdf",
            })
        );

        const mockResponse = {
            data: {
                id: "123",
                url: "https://example.com/anexo.pdf",
            },
        };

        vi.mocked(apiAnexos.post).mockResolvedValue(mockResponse);

        const resultado = await enviarAnexoAction(mockFormData);

        expect(resultado.success).toBe(true);
        expect(resultado.data).toEqual(mockResponse.data);
        expect(apiAnexos.post).toHaveBeenCalledWith(
            "/anexos/",
            mockFormData,
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

        const mockFormData = new FormData();
        mockFormData.append("intercorrencia_uuid", "uuid-123");
        mockFormData.append("perfil", "diretor");
        mockFormData.append("categoria", "boletim_ocorrencia");
        mockFormData.append(
            "arquivo",
            new File(["conteúdo"], "teste.pdf", {
                type: "application/pdf",
            })
        );

        const resultado = await enviarAnexoAction(mockFormData);

        expect(resultado.success).toBe(false);
        expect(resultado.error).toBe("Token de autenticação não encontrado");
    });

    it("deve lidar com erro 401 (não autorizado)", async () => {
        const mockFormData = new FormData();
        mockFormData.append("intercorrencia_uuid", "uuid-123");
        mockFormData.append("perfil", "diretor");
        mockFormData.append("categoria", "boletim_ocorrencia");
        mockFormData.append(
            "arquivo",
            new File(["conteúdo"], "teste.pdf", {
                type: "application/pdf",
            })
        );

        const mockError = {
            response: {
                status: 401,
            },
        };

        vi.mocked(apiAnexos.post).mockRejectedValue(mockError);

        const resultado = await enviarAnexoAction(mockFormData);

        expect(resultado.success).toBe(false);
        expect(resultado.error).toBe("Não autorizado");
    });

    it("deve lidar com erro 500 (erro interno)", async () => {
        const mockFormData = new FormData();
        mockFormData.append("intercorrencia_uuid", "uuid-123");
        mockFormData.append("perfil", "diretor");
        mockFormData.append("categoria", "boletim_ocorrencia");
        mockFormData.append(
            "arquivo",
            new File(["conteúdo"], "teste.pdf", {
                type: "application/pdf",
            })
        );

        const mockError = {
            response: {
                status: 500,
            },
        };

        vi.mocked(apiAnexos.post).mockRejectedValue(mockError);

        const resultado = await enviarAnexoAction(mockFormData);

        expect(resultado.success).toBe(false);
        expect(resultado.error).toBe("Erro interno no servidor");
    });

    it("deve lidar com mensagem de erro customizada da API", async () => {
        const mockFormData = new FormData();
        mockFormData.append("intercorrencia_uuid", "uuid-123");
        mockFormData.append("perfil", "diretor");
        mockFormData.append("categoria", "boletim_ocorrencia");
        mockFormData.append(
            "arquivo",
            new File(["conteúdo"], "teste.pdf", {
                type: "application/pdf",
            })
        );

        const mockError = {
            response: {
                status: 400,
                data: {
                    detail: "Arquivo inválido",
                },
            },
        };

        vi.mocked(apiAnexos.post).mockRejectedValue(mockError);

        const resultado = await enviarAnexoAction(mockFormData);

        expect(resultado.success).toBe(false);
        expect(resultado.error).toBe("Arquivo inválido");
    });
});
