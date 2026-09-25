import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDeclarantesAction } from "./declarantes";

vi.mock("@/lib/axios-intercorrencias", () => ({
    default: {
        get: vi.fn(),
    },
}));

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

describe("getDeclarantesAction", () => {
    const mockCookies = vi.mocked(cookies);
    const mockGet = vi.mocked(apiIntercorrencias.get);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve retornar os declarantes com sucesso", async () => {
        const mockData = [
            {
                uuid: "4cc15f41-e356-4cf5-82f9-06db6cf6c917",
                declarante: "Gabinete DRE",
            },
            {
                uuid: "62da7064-dedf-489e-9b0c-41752e87243f",
                declarante: "GCM",
            },
        ];

        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        } as never);

        mockGet.mockResolvedValue({
            data: mockData,
        } as never);

        const result = await getDeclarantesAction();

        expect(result).toEqual({
            success: true,
            data: mockData,
        });

        expect(mockGet).toHaveBeenCalledWith("/declarante/", {
            headers: {
                Authorization: "Bearer fake-token",
            },
        });
    });

    it("deve retornar erro quando não há token", async () => {
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        } as never);

        const result = await getDeclarantesAction();

        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
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

        const result = await getDeclarantesAction();

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

        const result = await getDeclarantesAction();

        expect(result).toEqual({
            success: false,
            error: "Not Found",
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

        const result = await getDeclarantesAction();

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

        const result = await getDeclarantesAction();

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

        const result = await getDeclarantesAction();

        expect(result).toEqual({
            success: false,
            error: "Network Error",
        });
    });
});
