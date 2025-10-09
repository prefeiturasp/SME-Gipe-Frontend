import { vi, describe, it, expect, beforeEach, type Mock } from "vitest";
import { cookies } from "next/headers";
import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { getOcorrenciasAction } from "./ocorrencias";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("@/lib/axios-intercorrencias");

describe("getOcorrenciasAction", () => {
    const mockCookies = cookies as Mock;
    const mockApiGet = apiIntercorrencias.get as Mock;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve retornar erro se o token não existir", async () => {
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        const result = await getOcorrenciasAction({});
        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado",
        });
    });

    it("deve chamar a API sem parâmetros para GIPE", async () => {
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });
        mockApiGet.mockResolvedValue({ data: [] });

        await getOcorrenciasAction({});

        expect(mockApiGet).toHaveBeenCalledWith("/intercorrencias/", {
            headers: { Authorization: "Bearer fake-token" },
        });
    });

    it("deve chamar a API com o parâmetro 'dre' para Ponto Focal", async () => {
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });
        mockApiGet.mockResolvedValue({ data: [] });

        await getOcorrenciasAction({ dre: "12345" });

        expect(mockApiGet).toHaveBeenCalledWith("/intercorrencias/?dre=12345", {
            headers: { Authorization: "Bearer fake-token" },
        });
    });

    it("deve chamar a API com o parâmetro 'usuario' para Diretor/Assistente", async () => {
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });
        mockApiGet.mockResolvedValue({ data: [] });

        await getOcorrenciasAction({ usuario: "user123" });

        expect(mockApiGet).toHaveBeenCalledWith(
            "/intercorrencias/?usuario=user123",
            {
                headers: { Authorization: "Bearer fake-token" },
            }
        );
    });

    it("deve retornar os dados com sucesso", async () => {
        const mockData = [{ id: 1, uuid: "abc" }];
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });
        mockApiGet.mockResolvedValue({ data: mockData });

        const result = await getOcorrenciasAction({});

        expect(result).toEqual({ success: true, data: mockData });
    });

    it("deve retornar erro genérico em caso de falha na API", async () => {
        const { AxiosError, AxiosHeaders } = await import("axios");

        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });

        // Criar um erro sem message, sem detail e sem status 500
        const axiosError = new AxiosError();
        axiosError.response = {
            status: 400,
            data: {}, // sem detail
            statusText: "Bad Request",
            headers: {},
            config: { headers: new AxiosHeaders() },
        };
        // Remover a propriedade message para cair no caso padrão
        Object.defineProperty(axiosError, "message", {
            value: undefined,
            writable: true,
            enumerable: true,
            configurable: true,
        });

        mockApiGet.mockRejectedValue(axiosError);

        const result = await getOcorrenciasAction({});

        expect(result).toEqual({
            success: false,
            error: "Erro ao criar ocorrência",
        });
    });

    it("deve retornar 'Erro interno no servidor' quando o status for 500", async () => {
        const { AxiosError, AxiosHeaders } = await import("axios");

        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });

        const axiosError = new AxiosError("Erro de servidor");
        axiosError.response = {
            status: 500,
            data: {},
            statusText: "Internal Server Error",
            headers: {},
            config: { headers: new AxiosHeaders() },
        };
        mockApiGet.mockRejectedValue(axiosError);

        const result = await getOcorrenciasAction({});

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor",
        });
    });

    it("deve retornar a mensagem de 'detail' da resposta da API", async () => {
        const { AxiosError, AxiosHeaders } = await import("axios");

        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });

        const axiosError = new AxiosError("Erro com detalhe");
        axiosError.response = {
            status: 400,
            data: { detail: "Detalhe específico do erro da API" },
            statusText: "Bad Request",
            headers: {},
            config: { headers: new AxiosHeaders() },
        };
        mockApiGet.mockRejectedValue(axiosError);

        const result = await getOcorrenciasAction({});

        expect(result).toEqual({
            success: false,
            error: "Detalhe específico do erro da API",
        });
    });

    it("deve retornar a mensagem de 'error.message' quando não há detail nem status 500", async () => {
        const { AxiosError, AxiosHeaders } = await import("axios");

        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });

        const axiosError = new AxiosError("Mensagem customizada do erro");
        axiosError.response = {
            status: 400,
            data: {}, // sem detail
            statusText: "Bad Request",
            headers: {},
            config: { headers: new AxiosHeaders() },
        };
        // Garantir que error.message está definido
        Object.defineProperty(axiosError, "message", {
            value: "Mensagem customizada do erro",
            writable: true,
            enumerable: true,
            configurable: true,
        });

        mockApiGet.mockRejectedValue(axiosError);

        const result = await getOcorrenciasAction({});

        expect(result).toEqual({
            success: false,
            error: "Mensagem customizada do erro",
        });
    });
});
