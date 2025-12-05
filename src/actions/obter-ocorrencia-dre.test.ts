import { vi, describe, it, expect, beforeEach, type Mock } from "vitest";
import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { obterOcorrenciaDre } from "./obter-ocorrencia-dre";
import { cookies } from "next/headers";


vi.mock("@/lib/axios-intercorrencias");
vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

describe("obterOcorrenciaDre", () => {
    const mockApiGet = apiIntercorrencias.get as Mock;
    const mockCookies = cookies as Mock;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve retornar erro se o token não existir", async () => {
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        const result = await obterOcorrenciaDre("abc-123");

        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        });
    });

    it("deve chamar a API com o UUID correto e o token de autenticação", async () => {
        const mockData = {
            id: 1,
            uuid: "abc-123-def-456",
            data_ocorrencia: "2024-01-15",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "108300",
            acionamento_seguranca_publica: false,
            interlocucao_sts: true,
            info_complementar_sts: "Informações adicionais STS",
            interlocucao_cpca: false,
            info_complementar_cpca: "Informações adicionais CPCA",
            interlocucao_supervisao_escolar: true,
            info_complementar_supervisao_escolar:
                "Informações adicionais Supervisão Escolar",
            interlocucao_naapa: false,
            info_complementar_naapa: "Informações adicionais NAAPA",
            user_username: "20090388003",
            criado_em: "2025-10-15T14:48:04.383569-03:00",
            atualizado_em: "2025-10-15T14:48:04.383591-03:00",
        };
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });
        mockApiGet.mockResolvedValue({ data: mockData });

        const uuid = "abc-123-def-456";
        await obterOcorrenciaDre(uuid);

        expect(mockApiGet).toHaveBeenCalledWith(`/dre/${uuid}/`, {
            headers: {
                Authorization: "Bearer fake-token",
            },
        });
    });

    it("deve retornar os dados da ocorrência DRE com sucesso", async () => {
        const mockData = {
            id: 1,
            uuid: "abc-123-def-456",
            data_ocorrencia: "2024-01-15",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "108300",
            acionamento_seguranca_publica: false,
            interlocucao_sts: true,
            info_complementar_sts: "Informações adicionais STS",
            interlocucao_cpca: false,
            info_complementar_cpca: "Informações adicionais CPCA",
            interlocucao_supervisao_escolar: true,
            info_complementar_supervisao_escolar:
                "Informações adicionais Supervisão Escolar",
            interlocucao_naapa: false,
            info_complementar_naapa: "Informações adicionais NAAPA",
            user_username: "20090388003",
            criado_em: "2025-10-15T14:48:04.383569-03:00",
            atualizado_em: "2025-10-15T14:48:04.383591-03:00",
        };
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });
        mockApiGet.mockResolvedValue({ data: mockData });

        const result = await obterOcorrenciaDre("abc-123-def-456");

        expect(result).toEqual({ success: true, data: mockData });
    });

    it("deve retornar erro 401 quando não autorizado", async () => {
        const { AxiosError, AxiosHeaders } = await import("axios");

        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });

        const axiosError = new AxiosError("Não autorizado");
        axiosError.response = {
            status: 401,
            data: {},
            statusText: "Unauthorized",
            headers: {},
            config: { headers: new AxiosHeaders() },
        };
        mockApiGet.mockRejectedValue(axiosError);

        const result = await obterOcorrenciaDre("uuid-teste");

        expect(result).toEqual({
            success: false,
            error: "Não autorizado. Faça login novamente.",
        });
    });

    it("deve retornar erro quando a API retornar 404", async () => {
        const { AxiosError, AxiosHeaders } = await import("axios");

        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });

        const axiosError = new AxiosError("Erro ao buscar ocorrência");
        axiosError.response = {
            status: 404,
            data: { detail: "Ocorrência não encontrada" },
            statusText: "Not Found",
            headers: {},
            config: { headers: new AxiosHeaders() },
        };
        mockApiGet.mockRejectedValue(axiosError);

        const result = await obterOcorrenciaDre("uuid-inexistente");

        expect(result).toEqual({
            success: false,
            error: "Ocorrência não encontrada",
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

        const result = await obterOcorrenciaDre("uuid-teste");

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

        const result = await obterOcorrenciaDre("uuid-teste");

        expect(result).toEqual({
            success: false,
            error: "Detalhe específico do erro da API",
        });
    });

    it("deve retornar a mensagem de 'error.message' quando não há detail nem status 500/404", async () => {
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
        mockApiGet.mockRejectedValue(axiosError);

        const result = await obterOcorrenciaDre("uuid-teste");

        expect(result).toEqual({
            success: false,
            error: "Mensagem customizada do erro",
        });
    });
});

