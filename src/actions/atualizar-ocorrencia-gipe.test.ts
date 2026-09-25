import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { OcorrenciaGipeBody } from "@/types/ocorrencia-gipe";
import { AxiosError, AxiosRequestHeaders } from "axios";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { atualizarOcorrenciaGipe } from "./atualizar-ocorrencia-gipe";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("@/lib/axios-intercorrencias", () => ({
    default: {
        put: vi.fn(),
    },
}));

const cookiesMock = cookies as Mock;

describe("atualizarOcorrenciaGipe action", () => {
    const mockUuid = "test-uuid-123";
    const mockBody: OcorrenciaGipeBody = {
        unidade_codigo_eol: "200237",
        dre_codigo_eol: "108500",
        envolve_arma_ataque: "sim",
        ameaca_realizada_qual_maneira: "virtualmente",
        tipos_ocorrencia: ["001c9106-7cbd-4cb8-8658-ae9b7b0aaf34"],
        encaminhamentos_gipe: "teste encaminhamento",
    };
    const mockAuthToken = "test-token";

    beforeEach(() => {
        vi.clearAllMocks();
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
    });

    it("deve atualizar a ocorrência GIPE com sucesso", async () => {
        const mockResponse = {
            data: {
                id: 1,
                uuid: mockUuid,
                status: "PENDENTE",
                status_display: "Pendente",
                status_extra: "Em andamento",
                unidade_codigo_eol: "200237",
                dre_codigo_eol: "108500",
                envolve_arma_ataque: "sim",
                ameaca_realizada_qual_maneira: "virtualmente",
                tipos_ocorrencia: ["001c9106-7cbd-4cb8-8658-ae9b7b0aaf34"],
                encaminhamentos_gipe: "teste encaminhamento",
            },
        };

        (apiIntercorrencias.put as Mock).mockResolvedValueOnce(mockResponse);

        const result = await atualizarOcorrenciaGipe(mockUuid, mockBody);

        expect(apiIntercorrencias.put).toHaveBeenCalledWith(
            `/gipe/${mockUuid}/`,
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

        const result = await atualizarOcorrenciaGipe(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        });
    });

    it("deve retornar erro 401 quando não autorizado", async () => {
        const error = new AxiosError("Unauthorized");
        error.response = {
            status: 401,
            data: {},
            statusText: "Unauthorized",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarOcorrenciaGipe(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Não autorizado. Faça login novamente.",
        });
    });

    it("deve retornar erro 404 quando não encontrado", async () => {
        const error = new AxiosError("Not Found");
        error.response = {
            status: 404,
            data: {},
            statusText: "Not Found",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarOcorrenciaGipe(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Not Found",
        });
    });

    it("deve retornar erro 500 do servidor", async () => {
        const error = new AxiosError("Internal Server Error");
        error.response = {
            status: 500,
            data: {},
            statusText: "Internal Server Error",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarOcorrenciaGipe(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor",
        });
    });

    it("deve retornar erro com mensagem detalhada quando disponível", async () => {
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

        const result = await atualizarOcorrenciaGipe(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: errorDetail,
        });
    });

    it("deve retornar uma mensagem de erro genérica", async () => {
        const errorMessage = "Network Error";
        const error = new AxiosError(errorMessage);
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarOcorrenciaGipe(mockUuid, mockBody);

        expect(result).toEqual({ success: false, error: errorMessage });
    });

    it("deve retornar a mensagem de erro padrão se nenhuma outra se aplicar", async () => {
        const error = new AxiosError();
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarOcorrenciaGipe(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Erro ao atualizar ocorrência GIPE",
        });
    });

    it("deve enviar todos os campos corretamente na requisição", async () => {
        const mockResponse = {
            data: {
                id: 1,
                uuid: mockUuid,
                ...mockBody,
                status: "PENDENTE",
                status_display: "Pendente",
                status_extra: "Em andamento",
            },
        };

        const putMock = vi
            .mocked(apiIntercorrencias.put)
            .mockResolvedValueOnce(mockResponse);

        await atualizarOcorrenciaGipe(mockUuid, mockBody);

        expect(putMock).toHaveBeenCalledWith(
            `/gipe/${mockUuid}/`,
            mockBody,
            expect.any(Object),
        );
    });
});
