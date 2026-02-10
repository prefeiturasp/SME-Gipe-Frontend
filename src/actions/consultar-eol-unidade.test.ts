import api from "@/lib/axios";
import { AxiosError, AxiosRequestHeaders } from "axios";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

import {
    consultarEolUnidadeAction,
    type ConsultarEolUnidadeResponse,
} from "./consultar-eol-unidade";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("@/lib/axios");

const cookiesMock = cookies as Mock;
const apiGetMock = api.get as Mock;

describe("consultarEolUnidadeAction", () => {
    const mockAuthToken = "test-token-123";
    const codigoEol = "123456";
    const etapaModalidade = "EMEI";
    const mockResponse: ConsultarEolUnidadeResponse = {
        etapa_modalidade: "EMEI",
        nome_unidade: "MARCIANO VASQUES PEREIRA, PROF.",
    };

    beforeEach(() => {
        vi.clearAllMocks();

        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
    });

    it("deve consultar código EOL com sucesso", async () => {
        apiGetMock.mockResolvedValue({ data: mockResponse });

        const result = await consultarEolUnidadeAction(
            codigoEol,
            etapaModalidade,
        );

        expect(result).toEqual({ success: true, data: mockResponse });

        expect(cookies().get).toHaveBeenCalledWith("auth_token");
        expect(apiGetMock).toHaveBeenCalledWith(
            `/unidades/gestao-unidades/consultar-eol/?codigo_eol=${codigoEol}&etapa_modalidade=${etapaModalidade}`,
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

        const result = await consultarEolUnidadeAction(
            codigoEol,
            etapaModalidade,
        );

        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado",
        });

        expect(apiGetMock).not.toHaveBeenCalled();
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

        apiGetMock.mockRejectedValue(error);

        const result = await consultarEolUnidadeAction(
            codigoEol,
            etapaModalidade,
        );

        expect(result).toEqual({
            success: false,
            error: "Não autorizado. Faça login novamente.",
        });
    });

    it("deve retornar erro 500 (erro interno do servidor)", async () => {
        const error = new AxiosError("Internal Server Error");
        error.response = {
            status: 500,
            data: {},
            statusText: "Internal Server Error",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };

        apiGetMock.mockRejectedValue(error);

        const result = await consultarEolUnidadeAction(
            codigoEol,
            etapaModalidade,
        );

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor",
        });
    });

    it("deve retornar mensagem detail da API se existir", async () => {
        const detailMessage = "Código EOL não encontrado";

        const error = new AxiosError("Request failed");
        error.response = {
            status: 404,
            data: { detail: detailMessage },
            statusText: "Not Found",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };

        apiGetMock.mockRejectedValue(error);

        const result = await consultarEolUnidadeAction(
            codigoEol,
            etapaModalidade,
        );

        expect(result).toEqual({
            success: false,
            error: detailMessage,
        });
    });

    it("deve retornar mensagem do próprio erro (error.message)", async () => {
        const errorMessage = "Network Error";

        const error = new Error(errorMessage);

        apiGetMock.mockRejectedValue(error);

        const result = await consultarEolUnidadeAction(
            codigoEol,
            etapaModalidade,
        );

        expect(result).toEqual({
            success: false,
            error: errorMessage,
        });
    });

    it("deve retornar mensagem padrão caso nenhuma outra regra se aplique", async () => {
        const error = new AxiosError();

        apiGetMock.mockRejectedValue(error);

        const result = await consultarEolUnidadeAction(
            codigoEol,
            etapaModalidade,
        );

        expect(result).toEqual({
            success: false,
            error: "Erro ao consultar código EOL",
        });
    });

    it("deve consultar diferentes códigos EOL", async () => {
        const codigoDiferente = "654321";
        const etapaDiferente = "EMEF";
        const mockResponseDiferente: ConsultarEolUnidadeResponse = {
            etapa_modalidade: "EMEF",
            nome_unidade: "JOÃO DA SILVA, DR.",
        };

        apiGetMock.mockResolvedValue({ data: mockResponseDiferente });

        const result = await consultarEolUnidadeAction(
            codigoDiferente,
            etapaDiferente,
        );

        expect(result).toEqual({
            success: true,
            data: mockResponseDiferente,
        });
        expect(apiGetMock).toHaveBeenCalledWith(
            `/unidades/gestao-unidades/consultar-eol/?codigo_eol=${codigoDiferente}&etapa_modalidade=${etapaDiferente}`,
            expect.any(Object),
        );
    });
});
