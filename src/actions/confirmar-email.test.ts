import api from "@/lib/axios";
import type { ConfirmarEmailRequest } from "@/types/confirmar-email";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { confirmarEmailAction } from "./confirmar-email";

vi.mock("@/lib/axios", () => ({ default: { put: vi.fn() } }));
vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

const apiPutMock = vi.mocked(api.put);
const cookiesMock = cookies as Mock;

describe("confirmarEmailAction", () => {
    const dados: ConfirmarEmailRequest = { code: "token" };
    const mockAuthToken = "mock-auth-token";

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("deve retornar sucesso quando o email for confirmado", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
        apiPutMock.mockResolvedValueOnce({
            data: { email: "novo@exemplo.com" },
        } as never);

        const result = await confirmarEmailAction(dados);

        expect(apiPutMock).toHaveBeenCalledWith(
            "/alteracao-email/validar/token/",
            null,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
            },
        );

        expect(result).toEqual({ success: true, new_mail: "novo@exemplo.com" });
    });

    it("deve retornar erro se o token de autenticação não for encontrado", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        const result = await confirmarEmailAction(dados);
        expect(apiPutMock).not.toHaveBeenCalled();
        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        });
    });

    it("deve retornar erro 401 para sessão expirada", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
        apiPutMock.mockRejectedValueOnce({
            response: { status: 401 },
        } as never);

        const result = await confirmarEmailAction(dados);

        expect(result).toEqual({
            success: false,
            error: "Sua sessão expirou. Por favor, faça login novamente.",
            field: undefined,
        });
    });

    it("deve retornar erro 500 para erro interno do servidor", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
        apiPutMock.mockRejectedValueOnce({
            response: { status: 500 },
        } as never);

        const result = await confirmarEmailAction(dados);

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor. Tente novamente mais tarde.",
            field: undefined,
        });
    });

    it("deve retornar erro com detail da API", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
        apiPutMock.mockRejectedValueOnce({
            response: { data: { detail: "Token inválido" } },
        } as never);

        const result = await confirmarEmailAction(dados);

        expect(result).toEqual({
            success: false,
            error: "Token inválido",
            field: undefined,
        });
    });

    it("deve retornar erro com message genérica", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
        apiPutMock.mockRejectedValueOnce({
            message: "Erro desconhecido",
        } as never);

        const result = await confirmarEmailAction(dados);

        expect(result).toEqual({ success: false, error: "Erro desconhecido" });
    });

    it("deve retornar field quando a API envia o campo que causou erro", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
        apiPutMock.mockRejectedValueOnce({
            response: { data: { detail: "Código inválido", field: "code" } },
        } as never);

        const result = await confirmarEmailAction(dados);

        expect(result).toEqual({
            success: false,
            error: "Código inválido",
            field: "code",
        });
    });
});
