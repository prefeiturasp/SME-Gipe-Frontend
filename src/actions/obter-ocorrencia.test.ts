import { vi, describe, it, expect, beforeEach, type Mock } from "vitest";
import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { obterOcorrencia } from "./obter-ocorrencia";
import { cookies } from "next/headers";

vi.mock("@/lib/axios-intercorrencias");
vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

describe("obterOcorrencia", () => {
    const mockApiGet = apiIntercorrencias.get as Mock;
    const mockCookies = cookies as Mock;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve retornar erro se o token não existir", async () => {
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        const result = await obterOcorrencia("abc-123");

        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado",
        });
    });

    it("deve chamar a API com o UUID correto e o token de autenticação", async () => {
        const mockData = {
            id: 1,
            uuid: "abc-123-def-456",
            data_ocorrencia: "2024-01-15",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "108300",
            sobre_furto_roubo_invasao_depredacao: false,
            user_username: "20090388003",
            criado_em: "2025-10-15T14:48:04.383569-03:00",
            atualizado_em: "2025-10-15T14:48:04.383591-03:00",
            tipos_ocorrencia: ["Violência física"],
            descricao: "Descrição da ocorrência",
            status: "Em andamento",
        };
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });
        mockApiGet.mockResolvedValue({ data: mockData });

        const uuid = "abc-123-def-456";
        await obterOcorrencia(uuid);

        expect(mockApiGet).toHaveBeenCalledWith(`/intercorrencias/${uuid}/`, {
            headers: {
                Authorization: "Bearer fake-token",
            },
        });
    });

    it("deve retornar os dados da ocorrência com sucesso", async () => {
        const mockData = {
            id: 1,
            uuid: "abc-123-def-456",
            data_ocorrencia: "2024-01-15",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "108300",
            sobre_furto_roubo_invasao_depredacao: false,
            user_username: "20090388003",
            criado_em: "2025-10-15T14:48:04.383569-03:00",
            atualizado_em: "2025-10-15T14:48:04.383591-03:00",
            tipos_ocorrencia: ["Violência física"],
            descricao: "Descrição da ocorrência",
            status: "Em andamento",
        };
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });
        mockApiGet.mockResolvedValue({ data: mockData });

        const result = await obterOcorrencia("abc-123-def-456");

        expect(result).toEqual({ success: true, data: mockData });
    });

    it("deve retornar os dados da ocorrência mesmo sem campos opcionais", async () => {
        const mockData = {
            id: 2,
            uuid: "xyz-789-uvw-012",
            data_ocorrencia: "2024-02-20",
            unidade_codigo_eol: "654321",
            dre_codigo_eol: "108300",
            sobre_furto_roubo_invasao_depredacao: true,
            user_username: "20090388003",
            criado_em: "2025-10-15T14:48:04.383569-03:00",
            atualizado_em: "2025-10-15T14:48:04.383591-03:00",
            status: "Incompleta",
        };
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });
        mockApiGet.mockResolvedValue({ data: mockData });

        const result = await obterOcorrencia("xyz-789-uvw-012");

        expect(result).toEqual({ success: true, data: mockData });
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

        const result = await obterOcorrencia("uuid-inexistente");

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

        const result = await obterOcorrencia("uuid-teste");

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

        const result = await obterOcorrencia("uuid-teste");

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

        const result = await obterOcorrencia("uuid-teste");

        expect(result).toEqual({
            success: false,
            error: "Mensagem customizada do erro",
        });
    });
});
