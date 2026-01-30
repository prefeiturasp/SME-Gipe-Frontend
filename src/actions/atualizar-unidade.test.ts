import axios, { AxiosError, AxiosRequestHeaders } from "axios";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

import {
    atualizarUnidadeAction,
    type AtualizarUnidadeRequest,
} from "./atualizar-unidade";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("axios");

const cookiesMock = cookies as Mock;
const axiosPutMock = axios.put as Mock;

describe("atualizarUnidadeAction", () => {
    const mockAuthToken = "test-token-123";
    const unidadeUuid = "abc123-e89b-12d3-a456-426614174999";
    const dadosAtualizacao: AtualizarUnidadeRequest = {
        tipo_unidade: "EMEF",
        nome: "EMEF Almeida Junior",
        rede: "DIRETA",
        codigo_eol: "093319",
        dre: "1a2766dc-36c8-4bbb-a840-155013526b80",
        sigla: "DRE-BT",
        ativa: true,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        process.env.NEXT_PUBLIC_API_URL = "https://api.exemplo.com";

        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
    });

    it("deve atualizar unidade com sucesso", async () => {
        axiosPutMock.mockResolvedValue({});

        const result = await atualizarUnidadeAction(
            unidadeUuid,
            dadosAtualizacao
        );

        expect(result).toEqual({ success: true });

        expect(cookies().get).toHaveBeenCalledWith("auth_token");
        expect(axiosPutMock).toHaveBeenCalledWith(
            `https://api.exemplo.com/unidades/gestao-unidades/${unidadeUuid}/`,
            dadosAtualizacao,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
                withCredentials: true,
            }
        );
    });

    it("deve retornar erro quando o token não existir", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        const result = await atualizarUnidadeAction(
            unidadeUuid,
            dadosAtualizacao
        );

        expect(result).toEqual({
            success: false,
            error: "Token de autenticação não encontrado",
        });

        expect(axiosPutMock).not.toHaveBeenCalled();
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

        axiosPutMock.mockRejectedValue(error);

        const result = await atualizarUnidadeAction(
            unidadeUuid,
            dadosAtualizacao
        );

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor",
            field: undefined,
        });
    });

    it("deve retornar mensagem detail da API se existir", async () => {
        const detailMessage = "Código EOL já cadastrado";

        const error = new AxiosError("Request failed");
        error.response = {
            status: 400,
            data: { detail: detailMessage },
            statusText: "Bad request",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };

        axiosPutMock.mockRejectedValue(error);

        const result = await atualizarUnidadeAction(
            unidadeUuid,
            dadosAtualizacao
        );

        expect(result).toEqual({
            success: false,
            error: detailMessage,
            field: undefined,
        });
    });

    it("deve retornar erro com field específico", async () => {
        const detailMessage = "Código EOL inválido";

        const error = new AxiosError("Request failed");
        error.response = {
            status: 400,
            data: { detail: detailMessage, field: "codigo_eol" },
            statusText: "Bad request",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };

        axiosPutMock.mockRejectedValue(error);

        const result = await atualizarUnidadeAction(
            unidadeUuid,
            dadosAtualizacao
        );

        expect(result).toEqual({
            success: false,
            error: detailMessage,
            field: "codigo_eol",
        });
    });

    it("deve retornar mensagem do próprio erro (error.message)", async () => {
        const errorMessage = "Network Error";

        const error = new Error(errorMessage);

        axiosPutMock.mockRejectedValue(error);

        const result = await atualizarUnidadeAction(
            unidadeUuid,
            dadosAtualizacao
        );

        expect(result).toEqual({
            success: false,
            error: errorMessage,
            field: undefined,
        });
    });

    it("deve retornar mensagem padrão caso nenhuma outra regra se aplique", async () => {
        const error = new AxiosError();

        axiosPutMock.mockRejectedValue(error);

        const result = await atualizarUnidadeAction(
            unidadeUuid,
            dadosAtualizacao
        );

        expect(result).toEqual({
            success: false,
            error: "Erro ao atualizar unidade",
            field: undefined,
        });
    });

    it("deve atualizar unidade do tipo CEI", async () => {
        const dadosCEI: AtualizarUnidadeRequest = {
            tipo_unidade: "CEI",
            nome: "CEI Exemplo",
            rede: "INDIRETA",
            codigo_eol: "012345",
            dre: "dre-uuid-456",
            sigla: "DRE-CL",
            ativa: true,
        };

        axiosPutMock.mockResolvedValue({});

        const result = await atualizarUnidadeAction(unidadeUuid, dadosCEI);

        expect(result).toEqual({ success: true });
        expect(axiosPutMock).toHaveBeenCalledWith(
            `https://api.exemplo.com/unidades/gestao-unidades/${unidadeUuid}/`,
            dadosCEI,
            expect.any(Object)
        );
    });

    it("deve atualizar unidade do tipo DRE sem campo dre", async () => {
        const dadosDRE: AtualizarUnidadeRequest = {
            tipo_unidade: "ADM",
            nome: "DRE Butantã",
            rede: "DIRETA",
            codigo_eol: "108600",
            sigla: "DRE-BT",
            ativa: true,
        };

        axiosPutMock.mockResolvedValue({});

        const result = await atualizarUnidadeAction(unidadeUuid, dadosDRE);

        expect(result).toEqual({ success: true });
        expect(axiosPutMock).toHaveBeenCalledWith(
            `https://api.exemplo.com/unidades/gestao-unidades/${unidadeUuid}/`,
            dadosDRE,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
                withCredentials: true,
            }
        );
    });

    it("deve atualizar unidade de rede INDIRETA", async () => {
        const dadosIndireta: AtualizarUnidadeRequest = {
            tipo_unidade: "CEI",
            nome: "CEI Conveniado",
            rede: "INDIRETA",
            codigo_eol: "678901",
            dre: "dre-uuid-678",
            sigla: "DRE-IP",
            ativa: true,
        };

        axiosPutMock.mockResolvedValue({});

        const result = await atualizarUnidadeAction(unidadeUuid, dadosIndireta);

        expect(result).toEqual({ success: true });
        expect(axiosPutMock).toHaveBeenCalledWith(
            `https://api.exemplo.com/unidades/gestao-unidades/${unidadeUuid}/`,
            dadosIndireta,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
                withCredentials: true,
            }
        );
    });

    it("deve atualizar unidade inativa", async () => {
        const dadosInativa: AtualizarUnidadeRequest = {
            tipo_unidade: "EMEF",
            nome: "EMEF Desativada",
            rede: "DIRETA",
            codigo_eol: "999999",
            dre: "dre-uuid-999",
            sigla: "DRE-DS",
            ativa: false,
        };

        axiosPutMock.mockResolvedValue({});

        const result = await atualizarUnidadeAction(unidadeUuid, dadosInativa);

        expect(result).toEqual({ success: true });
        expect(axiosPutMock).toHaveBeenCalledWith(
            `https://api.exemplo.com/unidades/gestao-unidades/${unidadeUuid}/`,
            dadosInativa,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
                withCredentials: true,
            }
        );
    });

    it("deve atualizar unidade sem sigla", async () => {
        const dadosSemSigla: AtualizarUnidadeRequest = {
            tipo_unidade: "EMEI",
            nome: "EMEI São Paulo",
            rede: "DIRETA",
            codigo_eol: "555555",
            dre: "dre-uuid-555",
            ativa: true,
        };

        axiosPutMock.mockResolvedValue({});

        const result = await atualizarUnidadeAction(unidadeUuid, dadosSemSigla);

        expect(result).toEqual({ success: true });
        expect(axiosPutMock).toHaveBeenCalledWith(
            `https://api.exemplo.com/unidades/gestao-unidades/${unidadeUuid}/`,
            dadosSemSigla,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
                withCredentials: true,
            }
        );
    });

    it("deve atualizar unidade do tipo CEU", async () => {
        const dadosCEU: AtualizarUnidadeRequest = {
            tipo_unidade: "CEU",
            nome: "CEU Rosa da China",
            rede: "DIRETA",
            codigo_eol: "333333",
            dre: "dre-uuid-333",
            sigla: "DRE-RC",
            ativa: true,
        };

        axiosPutMock.mockResolvedValue({});

        const result = await atualizarUnidadeAction(unidadeUuid, dadosCEU);

        expect(result).toEqual({ success: true });
        expect(axiosPutMock).toHaveBeenCalledWith(
            `https://api.exemplo.com/unidades/gestao-unidades/${unidadeUuid}/`,
            dadosCEU,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
                withCredentials: true,
            }
        );
    });
});
