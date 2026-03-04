import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

import { MotivoEncerramentoBody } from "@/types/finalizar-etapa";
import { finalizarEtapaGipe } from "./finalizar-etapa-gipe";

import { AxiosError, AxiosRequestHeaders } from "axios";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("@/lib/axios-intercorrencias");

const cookiesMock = cookies as Mock;

describe("finalizarEtapaGipe action", () => {
    const uuid = "abc-uuid-gipe";

    const mockBody: MotivoEncerramentoBody = {
        unidade_codigo_eol: "0001",
        dre_codigo_eol: "01",
    };

    const mockAuthToken = "test-token";

    beforeEach(() => {
        vi.clearAllMocks();
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
    });

    it("deve finalizar a etapa GIPE com sucesso", async () => {
        const mockResponse = {
            data: {
                protocolo_da_intercorrencia: "2025-XYZ",
            },
        };

        const putSpy = vi
            .spyOn(apiIntercorrencias, "put")
            .mockResolvedValue(mockResponse);

        const result = await finalizarEtapaGipe(uuid, mockBody);

        expect(result).toEqual({
            success: true,
            data: mockResponse.data,
        });

        expect(cookies().get).toHaveBeenCalledWith("auth_token");
        expect(putSpy).toHaveBeenCalledWith(
            `/gipe/${uuid}/finalizar/`,
            mockBody,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
            },
        );
    });

    it("deve retornar erro quando o token não existir", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        const putSpy = vi.spyOn(apiIntercorrencias, "put");

        const result = await finalizarEtapaGipe(uuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        });

        expect(putSpy).not.toHaveBeenCalled();
    });

    it("deve retornar erro 401 (não autorizado)", async () => {
        const error = new AxiosError("Unauthorized");
        error.response = {
            status: 401,
            data: {},
            statusText: "Unauthorized",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };

        vi.spyOn(apiIntercorrencias, "put").mockRejectedValue(error);

        const result = await finalizarEtapaGipe(uuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Não autorizado. Faça login novamente.",
        });
    });

    it("deve retornar erro 404 (não encontrado)", async () => {
        const error = new AxiosError("Not Found");
        error.response = {
            status: 404,
            data: {},
            statusText: "Not Found",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };

        vi.spyOn(apiIntercorrencias, "put").mockRejectedValue(error);

        const result = await finalizarEtapaGipe(uuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Ocorrência não encontrada.",
        });
    });

    it("deve retornar erro 500 (erro servidor)", async () => {
        const error = new AxiosError("Internal Server Error");
        error.response = {
            status: 500,
            data: {},
            statusText: "Internal Server Error",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };

        vi.spyOn(apiIntercorrencias, "put").mockRejectedValue(error);

        const result = await finalizarEtapaGipe(uuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor.",
        });
    });

    it("deve retornar mensagem detail da API se existir", async () => {
        const detailMessage = "Mensagem detalhada da API";

        const error = new AxiosError("Request failed");
        error.response = {
            status: 400,
            data: { detail: detailMessage },
            statusText: "Bad Request",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };

        vi.spyOn(apiIntercorrencias, "put").mockRejectedValue(error);

        const result = await finalizarEtapaGipe(uuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: detailMessage,
        });
    });

    it("deve retornar mensagem do próprio erro (error.message)", async () => {
        const errorMessage = "Network Error";

        const error = new AxiosError(errorMessage);

        vi.spyOn(apiIntercorrencias, "put").mockRejectedValue(error);

        const result = await finalizarEtapaGipe(uuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: errorMessage,
        });
    });

    it("deve retornar mensagem padrão caso nenhuma outra regra se aplique", async () => {
        const error = new AxiosError();

        vi.spyOn(apiIntercorrencias, "put").mockRejectedValue(error);

        const result = await finalizarEtapaGipe(uuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Erro ao enviar etapa para GIPE",
        });
    });
});
