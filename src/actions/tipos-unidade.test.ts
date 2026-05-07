import api from "@/lib/axios";
import { AxiosError, AxiosRequestHeaders } from "axios";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

import { getTiposUnidadeAction, type TipoUnidadeAPI } from "./tipos-unidade";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("@/lib/axios", () => ({ default: { get: vi.fn() } }));

const cookiesMock = cookies as Mock;
const apiGetMock = api.get as Mock;

describe("getTiposUnidadeAction", () => {
    const mockAuthToken = "test-token-123";

    beforeEach(() => {
        vi.clearAllMocks();

        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
    });

    it("deve buscar tipos de unidade com sucesso", async () => {
        const mockData: TipoUnidadeAPI[] = [
            { id: "1", label: "Escola Municipal" },
            { id: "2", label: "Diretoria Regional de Educação" },
        ];

        apiGetMock.mockResolvedValue({ data: mockData });

        const result = await getTiposUnidadeAction();

        expect(result).toEqual({ success: true, data: mockData });

        expect(cookies().get).toHaveBeenCalledWith("auth_token");
        expect(apiGetMock).toHaveBeenCalledWith(
            "/unidades/gestao-unidades/tipos-unidade/",
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

        const result = await getTiposUnidadeAction();

        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
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

        apiGetMock.mockRejectedValue(error as never);

        const result = await getTiposUnidadeAction();

        expect(result).toEqual({
            success: false,
            error: "Não autorizado. Faça login novamente.",
        });
    });

    it("deve retornar erro 404 (tipos de unidade não encontrados)", async () => {
        const error = new AxiosError("Not Found");
        error.response = {
            status: 404,
            data: {},
            statusText: "Not Found",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };

        apiGetMock.mockRejectedValue(error as never);

        const result = await getTiposUnidadeAction();

        expect(result).toEqual({
            success: false,
            error: "Not Found",
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

        apiGetMock.mockRejectedValue(error as never);

        const result = await getTiposUnidadeAction();

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor",
        });
    });

    it("deve retornar mensagem detail da API se existir", async () => {
        const detailMessage = "Erro específico da API";

        const error = new AxiosError("Request failed");
        error.response = {
            status: 400,
            data: { detail: detailMessage },
            statusText: "Bad request",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };

        apiGetMock.mockRejectedValue(error as never);

        const result = await getTiposUnidadeAction();

        expect(result).toEqual({
            success: false,
            error: detailMessage,
        });
    });

    it("deve retornar mensagem do próprio erro (error.message)", async () => {
        const errorMessage = "Network Error";

        const error = new Error(errorMessage);

        apiGetMock.mockRejectedValue(error as never);

        const result = await getTiposUnidadeAction();

        expect(result).toEqual({
            success: false,
            error: errorMessage,
        });
    });

    it("deve retornar mensagem padrão caso nenhuma outra regra se aplique", async () => {
        const error = new AxiosError();

        apiGetMock.mockRejectedValue(error as never);

        const result = await getTiposUnidadeAction();

        expect(result).toEqual({
            success: false,
            error: "Erro ao buscar tipos de unidade",
        });
    });
});
