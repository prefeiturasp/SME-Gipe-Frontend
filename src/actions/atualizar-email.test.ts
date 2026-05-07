import api from "@/lib/axios";
import type { AtualizarEmailRequest } from "@/types/atualizar-email";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { atualizarEmailAction } from "./atualizar-email";

vi.mock("@/lib/axios", () => ({ default: { post: vi.fn() } }));
vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

const apiPostMock = vi.mocked(api.post);
const cookiesMock = cookies as Mock;

describe("atualizarEmailAction", () => {
    const dados: AtualizarEmailRequest = {
        new_email: "novo@exemplo.com.br",
    };
    const mockAuthToken = "mock-auth-token";

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("deve retornar sucesso quando o e-mail for atualizado", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
        apiPostMock.mockResolvedValueOnce({} as never);

        const result = await atualizarEmailAction(dados);

        expect(apiPostMock).toHaveBeenCalledWith(
            "/alteracao-email/solicitar/",
            dados,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
            },
        );
        expect(result).toEqual({ success: true });
    });

    it("deve retornar erro se o token de autenticação não for encontrado", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        const result = await atualizarEmailAction(dados);
        expect(apiPostMock).not.toHaveBeenCalled();
        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        });
    });

    it("deve retornar erro 401 para sessão expirada", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
        apiPostMock.mockRejectedValueOnce({
            response: { status: 401 },
        } as never);

        const result = await atualizarEmailAction(dados);

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
        apiPostMock.mockRejectedValueOnce({
            response: { status: 500 },
        } as never);

        const result = await atualizarEmailAction(dados);

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
        apiPostMock.mockRejectedValueOnce({
            response: { data: { detail: "E-mail já cadastrado" } },
        } as never);

        const result = await atualizarEmailAction(dados);

        expect(result).toEqual({
            success: false,
            error: "E-mail já cadastrado",
            field: undefined,
        });
    });

    it("deve retornar erro com message genérica", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
        apiPostMock.mockRejectedValueOnce({
            message: "Erro desconhecido",
        } as never);

        const result = await atualizarEmailAction(dados);

        expect(result).toEqual({ success: false, error: "Erro desconhecido" });
    });

    it("deve retornar field quando a API envia o campo que causou erro", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
        apiPostMock.mockRejectedValueOnce({
            response: { data: { detail: "E-mail inválido", field: "email" } },
        } as never);

        const result = await atualizarEmailAction(dados);

        expect(result).toEqual({
            success: false,
            error: "E-mail inválido",
            field: "email",
        });
    });
});
