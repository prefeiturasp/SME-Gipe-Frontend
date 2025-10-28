import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTiposOcorrenciaAction } from "./tipos-ocorrencia";
import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { cookies } from "next/headers";

vi.mock("@/lib/axios-intercorrencias", () => ({
    default: {
        get: vi.fn(),
    },
}));

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

describe("getTiposOcorrenciaAction", () => {
    const mockCookies = vi.mocked(cookies);
    const mockGet = vi.mocked(apiIntercorrencias.get);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve retornar os tipos de ocorrência com sucesso", async () => {
        const mockData = [
            {
                uuid: "1cd5b78c-3d8a-483c-a2c5-1346c44a4e97",
                nome: "Agressão física",
            },
            {
                uuid: "f2a5b2d7-390d-4af9-ab1b-06551eec0dba",
                nome: "Ameaça externa",
            },
        ];

        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        } as never);

        mockGet.mockResolvedValue({
            data: mockData,
        } as never);

        const result = await getTiposOcorrenciaAction();

        expect(result).toEqual({
            success: true,
            data: mockData,
        });

        expect(mockGet).toHaveBeenCalledWith("/tipos-ocorrencia/", {
            headers: {
                Authorization: "Bearer fake-token",
            },
        });
    });

    it("deve retornar erro quando não há token", async () => {
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        } as never);

        const result = await getTiposOcorrenciaAction();

        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado",
        });

        expect(mockGet).not.toHaveBeenCalled();
    });

    it("deve retornar erro 401 quando não autorizado", async () => {
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "invalid-token" }),
        } as never);

        mockGet.mockRejectedValue({
            response: {
                status: 401,
                data: {},
            },
            message: "Unauthorized",
        });

        const result = await getTiposOcorrenciaAction();

        expect(result).toEqual({
            success: false,
            error: "Não autorizado. Faça login novamente.",
        });
    });

    it("deve retornar erro 404 quando não encontrado", async () => {
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        } as never);

        mockGet.mockRejectedValue({
            response: {
                status: 404,
                data: {},
            },
            message: "Not Found",
        });

        const result = await getTiposOcorrenciaAction();

        expect(result).toEqual({
            success: false,
            error: "Tipos de ocorrência não encontrados",
        });
    });

    it("deve retornar erro 500 para erro interno do servidor", async () => {
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        } as never);

        mockGet.mockRejectedValue({
            response: {
                status: 500,
                data: {},
            },
            message: "Internal Server Error",
        });

        const result = await getTiposOcorrenciaAction();

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor",
        });
    });

    it("deve retornar erro com detail quando fornecido pela API", async () => {
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        } as never);

        mockGet.mockRejectedValue({
            response: {
                status: 400,
                data: {
                    detail: "Erro customizado da API",
                },
            },
            message: "Bad Request",
        });

        const result = await getTiposOcorrenciaAction();

        expect(result).toEqual({
            success: false,
            error: "Erro customizado da API",
        });
    });

    it("deve retornar erro genérico quando não há informação específica", async () => {
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        } as never);

        mockGet.mockRejectedValue({
            message: "Network Error",
        });

        const result = await getTiposOcorrenciaAction();

        expect(result).toEqual({
            success: false,
            error: "Network Error",
        });
    });
});
