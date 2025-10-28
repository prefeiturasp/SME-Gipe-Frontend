import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { cookies } from "next/headers";
import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { atualizarSecaoInicial } from "./atualizar-secao-inicial";
import { SecaoInicialBody } from "@/types/secao-inicial";
import { AxiosError, AxiosRequestHeaders } from "axios";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("@/lib/axios-intercorrencias", () => ({
    default: {
        put: vi.fn(),
    },
}));

const cookiesMock = cookies as Mock;

describe("atualizarSecaoInicial action", () => {
    const mockUuid = "test-uuid-123";
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

    it("deve atualizar a ocorrência com sucesso", async () => {
        const mockResponse = { data: { uuid: mockUuid } };
        vi.mocked(apiIntercorrencias.put).mockResolvedValue(mockResponse);

        const result = await atualizarSecaoInicial(mockUuid, mockBody);

        expect(result).toEqual({ success: true, data: { uuid: mockUuid } });
        expect(cookies().get).toHaveBeenCalledWith("auth_token");
        expect(apiIntercorrencias.put).toHaveBeenCalledWith(
            `/diretor/${mockUuid}/secao-inicial/`,
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

        const result = await atualizarSecaoInicial(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        });
        expect(apiIntercorrencias.put).not.toHaveBeenCalled();
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

        const result = await atualizarSecaoInicial(mockUuid, mockBody);

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

        const result = await atualizarSecaoInicial(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Ocorrência não encontrada",
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

        const result = await atualizarSecaoInicial(mockUuid, mockBody);

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
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarSecaoInicial(mockUuid, mockBody);

        expect(result).toEqual({ success: false, error: detailMessage });
    });

    it("deve retornar uma mensagem de erro genérica", async () => {
        const errorMessage = "Network Error";
        const error = new AxiosError(errorMessage);
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarSecaoInicial(mockUuid, mockBody);

        expect(result).toEqual({ success: false, error: errorMessage });
    });

    it("deve retornar a mensagem de erro padrão se nenhuma outra se aplicar", async () => {
        const error = new AxiosError();
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarSecaoInicial(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Erro ao atualizar ocorrência",
        });
    });
});
