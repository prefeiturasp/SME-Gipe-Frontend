import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { AxiosError, AxiosRequestHeaders } from "axios";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { getAnalytics, type AnalyticsRequestBody } from "./analytics";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("@/lib/axios-intercorrencias", () => ({
    default: {
        post: vi.fn(),
    },
}));

const cookiesMock = cookies as Mock;

const mockBody: AnalyticsRequestBody = {
    ano: [2026],
    mes: [],
    periodo: [],
    dre: [],
    unidade: [],
    genero: [],
    etapa_escolar: [],
    idade: "",
    idade_em_meses: false,
};

const mockAuthToken = "test-token";

describe("getAnalytics action", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
    });

    it("deve retornar dados analíticos com sucesso", async () => {
        const mockResponse = {
            data: {
                intercorrencias_dre: [
                    {
                        codigo_eol: "108501",
                        total: 5,
                        patrimonial: 2,
                        interpessoal: 3,
                    },
                ],
                intercorrencias_status: [
                    {
                        status: "Em andamento",
                        total: 3,
                        patrimonial: 1,
                        interpessoal: 2,
                    },
                ],
                evolucao_mensal: [
                    {
                        mes: 3,
                        total: 18,
                        patrimonial: 10,
                        interpessoal: 8,
                    },
                ],
                intercorrencias_tipos: {
                    patrimonial: { "Dano material": 4 },
                    interpessoal: { "Agressão física": 6 },
                },
                total_por_motivo: { Bullying: 6 },
                cards: [
                    { total_intercorrencia: 5 },
                    { intercorrencias_patrimoniais: 2 },
                    { intercorrencias_interpessoais: 3 },
                    { media_mensal: 1 },
                ],
            },
        };

        (apiIntercorrencias.post as Mock).mockResolvedValue(mockResponse);

        const result = await getAnalytics(mockBody);

        expect(result).toEqual({ success: true, data: mockResponse.data });
        expect(apiIntercorrencias.post).toHaveBeenCalledWith(
            "/analytics/",
            mockBody,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
            },
        );
    });

    it("deve retornar erro quando token não encontrado", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        const result = await getAnalytics(mockBody);

        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        });
        expect(apiIntercorrencias.post).not.toHaveBeenCalled();
    });

    it("deve retornar erro 401", async () => {
        const axiosError = new AxiosError("Unauthorized", "ERR_BAD_REQUEST", {
            headers: {} as AxiosRequestHeaders,
        });
        axiosError.response = {
            status: 401,
            data: {},
            statusText: "Unauthorized",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };

        (apiIntercorrencias.post as Mock).mockRejectedValue(axiosError);

        const result = await getAnalytics(mockBody);

        expect(result).toEqual({
            success: false,
            error: "Não autorizado. Faça login novamente.",
        });
    });

    it("deve retornar erro 500", async () => {
        const axiosError = new AxiosError(
            "Internal Server Error",
            "ERR_BAD_RESPONSE",
            { headers: {} as AxiosRequestHeaders },
        );
        axiosError.response = {
            status: 500,
            data: {},
            statusText: "Internal Server Error",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };

        (apiIntercorrencias.post as Mock).mockRejectedValue(axiosError);

        const result = await getAnalytics(mockBody);

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor",
        });
    });

    it("deve retornar mensagem de detalhe do erro quando disponível", async () => {
        const axiosError = new AxiosError("Bad Request", "ERR_BAD_REQUEST", {
            headers: {} as AxiosRequestHeaders,
        });
        axiosError.response = {
            status: 400,
            data: { detail: "Parâmetros inválidos" },
            statusText: "Bad Request",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };

        (apiIntercorrencias.post as Mock).mockRejectedValue(axiosError);

        const result = await getAnalytics(mockBody);

        expect(result).toEqual({
            success: false,
            error: "Parâmetros inválidos",
        });
    });

    it("deve retornar mensagem genérica para erros sem resposta", async () => {
        (apiIntercorrencias.post as Mock).mockRejectedValue(
            new Error("Network Error"),
        );

        const result = await getAnalytics(mockBody);

        expect(result).toEqual({
            success: false,
            error: "Network Error",
        });
    });
});
