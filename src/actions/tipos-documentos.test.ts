import apiAnexos from "@/lib/axios-anexos";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { getTiposDocumentoAction } from "./tipos-documentos";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("@/lib/axios-anexos", () => ({ default: { get: vi.fn() } }));

describe("getTiposDocumentoAction", () => {
    const mockCookies = cookies as Mock;
    const mockApiGet = apiAnexos.get as Mock;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve retornar erro se o token não existir", async () => {
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        const result = await getTiposDocumentoAction("diretor");

        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        });
    });

    it("deve retornar os dados com sucesso", async () => {
        const mockResponse = {
            perfil: "diretor",
            categorias: [
                { value: "boletim_ocorrencia", label: "Boletim de ocorrência" },
            ],
        };

        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });

        mockApiGet.mockResolvedValue({ data: mockResponse });

        const result = await getTiposDocumentoAction("diretor");

        expect(result).toEqual({
            success: true,
            data: mockResponse,
        });
    });

    it("deve retornar erro genérico em caso de falha na API", async () => {
        const { AxiosError, AxiosHeaders } = await import("axios");

        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });

        const axiosError = new AxiosError();
        axiosError.response = {
            status: 400,
            data: {}, // sem detail
            statusText: "Bad Request",
            headers: {},
            config: { headers: new AxiosHeaders() },
        };

        Object.defineProperty(axiosError, "message", {
            value: undefined,
            writable: true,
        });

        mockApiGet.mockRejectedValue(axiosError);

        const result = await getTiposDocumentoAction("diretor");

        expect(result).toEqual({
            success: false,
            error: "Erro ao obter categorias de documentos",
        });
    });

    it("deve retornar 'Erro interno no servidor' quando o status for 500", async () => {
        const { AxiosError, AxiosHeaders } = await import("axios");

        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });

        const axiosError = new AxiosError("Erro no servidor");
        axiosError.response = {
            status: 500,
            data: {},
            statusText: "Internal Server Error",
            headers: {},
            config: { headers: new AxiosHeaders() },
        };

        mockApiGet.mockRejectedValue(axiosError);

        const result = await getTiposDocumentoAction("diretor");

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor",
        });
    });

    it("deve retornar a mensagem de 'detail' da API quando existir", async () => {
        const { AxiosError, AxiosHeaders } = await import("axios");

        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });

        const axiosError = new AxiosError();
        axiosError.response = {
            status: 400,
            data: { detail: "Erro específico da API" },
            statusText: "Bad Request",
            headers: {},
            config: { headers: new AxiosHeaders() },
        };

        mockApiGet.mockRejectedValue(axiosError);

        const result = await getTiposDocumentoAction("diretor");

        expect(result).toEqual({
            success: false,
            error: "Erro específico da API",
        });
    });

    it("deve retornar error.message quando não há detail nem status 500", async () => {
        const { AxiosError, AxiosHeaders } = await import("axios");

        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });

        const axiosError = new AxiosError("Mensagem clara do erro");
        axiosError.response = {
            status: 400,
            data: {},
            statusText: "Bad Request",
            headers: {},
            config: { headers: new AxiosHeaders() },
        };

        mockApiGet.mockRejectedValue(axiosError);

        const result = await getTiposDocumentoAction("diretor");

        expect(result).toEqual({
            success: false,
            error: "Mensagem clara do erro",
        });
    });
});
