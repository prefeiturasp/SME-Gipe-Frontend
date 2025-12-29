import api from "@/lib/axios";
import { AxiosError, AxiosRequestHeaders } from "axios";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

import {
    cadastrarUnidadeAction,
    type UnidadeCadastroPayload,
} from "./cadastrar-unidade";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("@/lib/axios");

const cookiesMock = cookies as Mock;
const apiPostMock = api.post as Mock;

describe("cadastrarUnidadeAction", () => {
    const mockAuthToken = "test-token-123";
    const payload: UnidadeCadastroPayload = {
        nome: "Escola Municipal João Silva",
        codigo_eol: "123456",
        tipo_unidade: "escola",
        rede: "DIRETA",
        sigla: "EMJS",
        dre: "DRE-1",
        ativa: true,
    };

    beforeEach(() => {
        vi.clearAllMocks();

        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
    });

    it("deve cadastrar unidade com sucesso", async () => {
        apiPostMock.mockResolvedValue({});

        const result = await cadastrarUnidadeAction(payload);

        expect(result).toEqual({ success: true });

        expect(cookies().get).toHaveBeenCalledWith("auth_token");
        expect(apiPostMock).toHaveBeenCalledWith(
            "/unidades/gestao-unidades/",
            payload,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
            }
        );
    });

    it("deve retornar erro quando o token não existir", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        const result = await cadastrarUnidadeAction(payload);

        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado",
        });

        expect(apiPostMock).not.toHaveBeenCalled();
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

        apiPostMock.mockRejectedValue(error);

        const result = await cadastrarUnidadeAction(payload);

        expect(result).toEqual({
            success: false,
            error: "Não autorizado. Faça login novamente.",
        });
    });

    it("deve retornar erro 400 (dados inválidos)", async () => {
        const error = new AxiosError("Bad Request");
        error.response = {
            status: 400,
            data: {},
            statusText: "Bad Request",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };

        apiPostMock.mockRejectedValue(error);

        const result = await cadastrarUnidadeAction(payload);

        expect(result).toEqual({
            success: false,
            error: "Dados inválidos para cadastro",
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

        apiPostMock.mockRejectedValue(error);

        const result = await cadastrarUnidadeAction(payload);

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor",
        });
    });

    it("deve retornar mensagem detail da API se existir", async () => {
        const detailMessage = "Unidade já cadastrada";

        const error = new AxiosError("Request failed");
        error.response = {
            status: 422,
            data: { detail: detailMessage },
            statusText: "Unprocessable Entity",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };

        apiPostMock.mockRejectedValue(error);

        const result = await cadastrarUnidadeAction(payload);

        expect(result).toEqual({
            success: false,
            error: detailMessage,
        });
    });

    it("deve retornar mensagem do próprio erro (error.message)", async () => {
        const errorMessage = "Network Error";

        const error = new Error(errorMessage);

        apiPostMock.mockRejectedValue(error);

        const result = await cadastrarUnidadeAction(payload);

        expect(result).toEqual({
            success: false,
            error: errorMessage,
        });
    });

    it("deve retornar mensagem padrão caso nenhuma outra regra se aplique", async () => {
        const error = new AxiosError();

        apiPostMock.mockRejectedValue(error);

        const result = await cadastrarUnidadeAction(payload);

        expect(result).toEqual({
            success: false,
            error: "Erro ao cadastrar unidade",
        });
    });

    it("deve cadastrar unidade sem sigla e dre", async () => {
        const payloadSemOpcionais: UnidadeCadastroPayload = {
            nome: "Diretoria Regional de Educação",
            codigo_eol: "654321",
            tipo_unidade: "dre",
            rede: "DIRETA",
            ativa: true,
        };

        apiPostMock.mockResolvedValue({});

        const result = await cadastrarUnidadeAction(payloadSemOpcionais);

        expect(result).toEqual({ success: true });
        expect(apiPostMock).toHaveBeenCalledWith(
            "/unidades/gestao-unidades/",
            payloadSemOpcionais,
            expect.any(Object)
        );
    });

    it("deve cadastrar unidade inativa", async () => {
        const payloadInativo: UnidadeCadastroPayload = {
            nome: "Escola Inativa",
            codigo_eol: "789012",
            tipo_unidade: "escola",
            rede: "INDIRETA",
            sigla: "EI",
            dre: "DRE-2",
            ativa: false,
        };

        apiPostMock.mockResolvedValue({});

        const result = await cadastrarUnidadeAction(payloadInativo);

        expect(result).toEqual({ success: true });
        expect(apiPostMock).toHaveBeenCalledWith(
            "/unidades/gestao-unidades/",
            payloadInativo,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
            }
        );
    });
});
