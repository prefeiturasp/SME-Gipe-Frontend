import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { OcorrenciaDreBody } from "@/types/ocorrencia-dre";
import { AxiosError, AxiosRequestHeaders } from "axios";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { atualizarOcorrenciaDre } from "./atualizar-ocorrencia-dre";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("@/lib/axios-intercorrencias", () => ({
    default: {
        put: vi.fn(),
    },
}));

const cookiesMock = cookies as Mock;

describe("atualizarOcorrenciaDre action", () => {
    const mockUuid = "test-uuid-123";
    const mockBody: OcorrenciaDreBody = {
        unidade_codigo_eol: "123456",
        dre_codigo_eol: "DRE-001",
        quais_orgaos_acionados_dre: [
            "comunicacao_supervisao_tecnica_saude",
            "comunicacao_gipe",
        ],
    };
    const mockAuthToken = "test-token";

    beforeEach(() => {
        vi.clearAllMocks();
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
    });

    it("deve atualizar a ocorrência DRE com sucesso", async () => {
        const mockResponse = {
            data: {
                uuid: mockUuid,
                unidade_codigo_eol: "123456",
                dre_codigo_eol: "DRE-001",
                quais_orgaos_acionados_dre: [
                    "comunicacao_supervisao_tecnica_saude",
                    "comunicacao_gipe",
                ],
            },
        };

        (apiIntercorrencias.put as Mock).mockResolvedValueOnce(mockResponse);

        const result = await atualizarOcorrenciaDre(mockUuid, mockBody);

        expect(apiIntercorrencias.put).toHaveBeenCalledWith(
            `/dre/${mockUuid}/`,
            mockBody,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
            },
        );

        expect(result).toEqual({ success: true, data: mockResponse.data });
    });

    it("deve retornar erro quando o usuário não estiver autenticado", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        const result = await atualizarOcorrenciaDre(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        });
    });

    it("deve tratar erros de API corretamente", async () => {
        const mockError = {
            response: {
                status: 404,
            },
        } as AxiosError<{ detail?: string }>;

        (apiIntercorrencias.put as Mock).mockRejectedValueOnce(mockError);

        const result = await atualizarOcorrenciaDre(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Ocorrência não encontrada",
        });
    });

    it("Deve retornar erro 401 quando não autorizado", async () => {
        const error = new AxiosError("Unauthorized");
        error.response = {
            status: 401,
            data: {},
            statusText: "Unauthorized",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarOcorrenciaDre(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Não autorizado. Faça login novamente.",
        });
    });

    it("Deve retornar erro 404 quando não encontrado", async () => {
        const error = new AxiosError("Not Found");
        error.response = {
            status: 404,
            data: {},
            statusText: "Not Found",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarOcorrenciaDre(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Ocorrência não encontrada",
        });
    });

    it("Deve retornar erro 500 do servidor", async () => {
        const error = new AxiosError("Internal Server Error");
        error.response = {
            status: 500,
            data: {},
            statusText: "Internal Server Error",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarOcorrenciaDre(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor",
        });
    });

    it("Deve retornar erro com mensagem detalhada quando disponível", async () => {
        const errorDetail = "Detalhe específico do erro";
        const error = new AxiosError("Bad Request");
        error.response = {
            status: 400,
            data: { detail: errorDetail },
            statusText: "Bad Request",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarOcorrenciaDre(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: errorDetail,
        });
    });

    it("deve retornar uma mensagem de erro genérica", async () => {
        const errorMessage = "Network Error";
        const error = new AxiosError(errorMessage);
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarOcorrenciaDre(mockUuid, mockBody);

        expect(result).toEqual({ success: false, error: errorMessage });
    });

    it("deve retornar a mensagem de erro padrão se nenhuma outra se aplicar", async () => {
        const error = new AxiosError();
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarOcorrenciaDre(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Erro ao atualizar ocorrência DRE",
        });
    });

    it("Deve enviar todos os campos corretamente na requisição", async () => {
        const mockResponse = {
            data: {
                uuid: mockUuid,
                ...mockBody,
            },
        };

        const putMock = vi
            .mocked(apiIntercorrencias.put)
            .mockResolvedValueOnce(mockResponse);

        await atualizarOcorrenciaDre(mockUuid, mockBody);

        expect(putMock).toHaveBeenCalledWith(
            `/dre/${mockUuid}/`,
            mockBody,
            expect.any(Object),
        );
    });
});
