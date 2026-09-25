import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { obterOcorrenciaGipe } from "./obter-ocorrencia-gipe";

vi.mock("@/lib/axios-intercorrencias", () => ({ default: { get: vi.fn() } }));
vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

describe("obterOcorrenciaGipe", () => {
    const mockApiGet = apiIntercorrencias.get as Mock;
    const mockCookies = cookies as Mock;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve retornar erro se o token não existir", async () => {
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        const result = await obterOcorrenciaGipe("abc-123");

        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        });
    });

    it("deve chamar a API com o UUID correto e o token de autenticação", async () => {
        const mockData = {
            id: 1,
            uuid: "gipe-123-def-456",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "108300",
            status: "finalizada",
            status_display: "Finalizada",
            status_extra: "",
            envolve_arma_ataque: "sim",
            ameaca_realizada_qual_maneira: "presencialmente",
            envolvido: ["env-uuid-123"],
            motivacao_ocorrencia: ["bullying", "racismo"],
            tipos_ocorrencia: ["tipo-uuid-1"],
            tipos_ocorrencia_detalhes: [
                {
                    uuid: "tipo-uuid-1",
                    nome: "Tipo A",
                },
            ],
            etapa_escolar: "alfabetizacao",
            info_sobre_interacoes_virtuais_pessoa_agressora:
                "Informações sobre interações virtuais",
            encaminhamentos_gipe: "Encaminhamentos realizados",
        };
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });
        mockApiGet.mockResolvedValue({ data: mockData });

        const uuid = "gipe-123-def-456";
        await obterOcorrenciaGipe(uuid);

        expect(mockApiGet).toHaveBeenCalledWith(`/gipe/${uuid}/`, {
            headers: {
                Authorization: "Bearer fake-token",
            },
        });
    });

    it("deve retornar os dados da ocorrência GIPE com sucesso", async () => {
        const mockData = {
            id: 1,
            uuid: "gipe-123-def-456",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "108300",
            status: "finalizada",
            status_display: "Finalizada",
            status_extra: "",
            envolve_arma_ataque: "sim",
            ameaca_realizada_qual_maneira: "presencialmente",
            envolvido: ["env-uuid-123"],
            motivacao_ocorrencia: ["bullying", "racismo"],
            tipos_ocorrencia: ["tipo-uuid-1"],
            tipos_ocorrencia_detalhes: [
                {
                    uuid: "tipo-uuid-1",
                    nome: "Tipo A",
                },
            ],
            etapa_escolar: "alfabetizacao",
            info_sobre_interacoes_virtuais_pessoa_agressora:
                "Informações sobre interações virtuais",
            encaminhamentos_gipe: "Encaminhamentos realizados",
        };
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });
        mockApiGet.mockResolvedValue({ data: mockData });

        const result = await obterOcorrenciaGipe("gipe-123-def-456");

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

        const result = await obterOcorrenciaGipe("uuid-teste");

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

        const result = await obterOcorrenciaGipe("uuid-inexistente");

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

        const result = await obterOcorrenciaGipe("uuid-teste");

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
            data: { detail: "Detalhe específico do erro da API GIPE" },
            statusText: "Bad Request",
            headers: {},
            config: { headers: new AxiosHeaders() },
        };
        mockApiGet.mockRejectedValue(axiosError);

        const result = await obterOcorrenciaGipe("uuid-teste");

        expect(result).toEqual({
            success: false,
            error: "Detalhe específico do erro da API GIPE",
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

        const result = await obterOcorrenciaGipe("uuid-teste");

        expect(result).toEqual({
            success: false,
            error: "Mensagem customizada do erro",
        });
    });

    it("deve retornar mensagem padrão quando não há detail nem error.message", async () => {
        const { AxiosError, AxiosHeaders } = await import("axios");

        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });

        const axiosError = new AxiosError();
        axiosError.response = {
            status: 400,
            data: {},
            statusText: "Bad Request",
            headers: {},
            config: { headers: new AxiosHeaders() },
        };
        // Remove a mensagem do erro
        axiosError.message = "";
        mockApiGet.mockRejectedValue(axiosError);

        const result = await obterOcorrenciaGipe("uuid-teste");

        expect(result).toEqual({
            success: false,
            error: "Erro ao obter ocorrência GIPE",
        });
    });
});
