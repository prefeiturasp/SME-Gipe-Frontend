import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { cookies } from "next/headers";
import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { SecaoInicial } from "./secao-inicial";
import { SecaoInicialBody } from "@/types/secao-inicial";
import { AxiosError, AxiosRequestHeaders } from "axios";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("@/lib/axios-intercorrencias");

const cookiesMock = cookies as Mock;

describe("SecaoInicial action", () => {
    const mockBody: SecaoInicialBody = {
        data_ocorrencia: "2023-10-07",
        unidade_codigo_eol: "12345",
        dre_codigo_eol: "DRE-ABC",
        sobre_furto_roubo_invasao_depredacao: true,
    };
    const mockAuthToken = "test-token";

    beforeEach(() => {
        vi.clearAllMocks();
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
    });

    it("deve criar uma nova ocorrência com sucesso", async () => {
        const mockResponse = { data: { uuid: "test-uuid-123" } };
        const postSpy = vi
            .spyOn(apiIntercorrencias, "post")
            .mockResolvedValue(mockResponse);

        const result = await SecaoInicial(mockBody);

        expect(result).toEqual({
            success: true,
            data: { uuid: "test-uuid-123" },
        });
        expect(cookies().get).toHaveBeenCalledWith("auth_token");
        expect(postSpy).toHaveBeenCalledWith(
            "/diretor/secao-inicial/",
            mockBody,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
            }
        );
    });

    it("deve retornar erro se o token de autenticação não for encontrado", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });
        const postSpy = vi.spyOn(apiIntercorrencias, "post");

        const result = await SecaoInicial(mockBody);

        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        });
        expect(postSpy).not.toHaveBeenCalled();
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
        vi.spyOn(apiIntercorrencias, "post").mockRejectedValue(error);

        const result = await SecaoInicial(mockBody);

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor",
        });
    });

    it("deve retornar a mensagem de erro 'detail' da API", async () => {
        const detailMessage = "Um erro específico ocorreu.";
        const error = new AxiosError("Request failed");
        error.response = {
            status: 400,
            data: { detail: detailMessage },
            statusText: "Bad Request",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };
        vi.spyOn(apiIntercorrencias, "post").mockRejectedValue(error);

        const result = await SecaoInicial(mockBody);

        expect(result).toEqual({ success: false, error: detailMessage });
    });

    it("deve retornar uma mensagem de erro genérica", async () => {
        const errorMessage = "Network Error";
        const error = new AxiosError(errorMessage);
        vi.spyOn(apiIntercorrencias, "post").mockRejectedValue(error);

        const result = await SecaoInicial(mockBody);

        expect(result).toEqual({ success: false, error: errorMessage });
    });

    it("deve retornar a mensagem de erro padrão se nenhuma outra se aplicar", async () => {
        const error = new AxiosError();
        vi.spyOn(apiIntercorrencias, "post").mockRejectedValue(error);

        const result = await SecaoInicial(mockBody);

        expect(result).toEqual({
            success: false,
            error: "Erro ao criar ocorrência",
        });
    });
});
