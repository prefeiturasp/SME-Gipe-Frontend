import apiAnexos from "@/lib/axios-anexos";
import { AxiosError, AxiosRequestHeaders } from "axios";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { excluirAnexo } from "./excluir-anexo";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("@/lib/axios-anexos", () => ({
    default: {
        delete: vi.fn(),
    },
}));

const cookiesMock = cookies as Mock;

describe("excluirAnexo action", () => {
    const mockUuid = "anexo-123";
    const mockAuthToken = "token-xyz";

    beforeEach(() => {
        vi.clearAllMocks();
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
    });

    it("deve excluir o anexo com sucesso", async () => {
        vi.mocked(apiAnexos.delete).mockResolvedValue({});

        const result = await excluirAnexo(mockUuid);

        expect(result).toEqual({ success: true });
        expect(cookies().get).toHaveBeenCalledWith("auth_token");
        expect(apiAnexos.delete).toHaveBeenCalledWith(`/anexos/${mockUuid}/`, {
            headers: {
                Authorization: `Bearer ${mockAuthToken}`,
            },
        });
    });

    it("deve retornar erro se o token não for encontrado", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        const result = await excluirAnexo(mockUuid);

        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        });
        expect(apiAnexos.delete).not.toHaveBeenCalled();
    });

    it("deve retornar erro 401 quando não autorizado", async () => {
        const err = new AxiosError("Unauthorized");
        err.response = {
            status: 401,
            data: {},
            statusText: "Unauthorized",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };

        vi.mocked(apiAnexos.delete).mockRejectedValue(err);

        const result = await excluirAnexo(mockUuid);

        expect(result).toEqual({
            success: false,
            error: "Não autorizado. Faça login novamente.",
        });
    });

    it("deve retornar erro 404 quando arquivo não encontrado", async () => {
        const err = new AxiosError("Not Found");
        err.response = {
            status: 404,
            data: {},
            statusText: "Not Found",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };

        vi.mocked(apiAnexos.delete).mockRejectedValue(err);

        const result = await excluirAnexo(mockUuid);

        expect(result).toEqual({
            success: false,
            error: "Not Found",
        });
    });

    it("deve retornar erro 500 quando ocorre erro interno", async () => {
        const err = new AxiosError("Internal Server Error");
        err.response = {
            status: 500,
            data: {},
            statusText: "Internal Server Error",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };

        vi.mocked(apiAnexos.delete).mockRejectedValue(err);

        const result = await excluirAnexo(mockUuid);

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor",
        });
    });

    it("deve retornar detalhe da API quando disponível", async () => {
        const detailMessage = "Falha ao excluir devido a restrições.";
        const err = new AxiosError("Bad Request");
        err.response = {
            status: 400,
            data: { detail: detailMessage },
            statusText: "Bad Request",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };

        vi.mocked(apiAnexos.delete).mockRejectedValue(err);

        const result = await excluirAnexo(mockUuid);

        expect(result).toEqual({
            success: false,
            error: detailMessage,
        });
    });

    it("deve retornar mensagem de erro genérica quando existir error.message", async () => {
        const errorMessage = "Network Error";
        const err = new AxiosError(errorMessage);

        vi.mocked(apiAnexos.delete).mockRejectedValue(err);

        const result = await excluirAnexo(mockUuid);

        expect(result).toEqual({
            success: false,
            error: errorMessage,
        });
    });

    it("deve retornar mensagem padrão caso nenhuma outra se aplique", async () => {
        const err = new AxiosError();

        vi.mocked(apiAnexos.delete).mockRejectedValue(err);

        const result = await excluirAnexo(mockUuid);

        expect(result).toEqual({
            success: false,
            error: "Erro ao excluir arquivo.",
        });
    });
});
