import {
    describe,
    it,
    expect,
    beforeEach,
    afterAll,
    vi,
    type Mock,
} from "vitest";
import { atualizarNomeAction } from "./atualizar-nome";
import axios from "axios";
import { cookies } from "next/headers";
import type { AtualizarNomeRequest } from "@/types/atualizar-nome";

vi.mock("axios");
vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

const axiosPutMock = axios.put as Mock;
const cookiesMock = cookies as Mock;

describe("atualizarNomeAction", () => {
    const originalEnv = process.env;
    const dados: AtualizarNomeRequest = {
        name: "Novo Nome",
    };
    const mockAuthToken = "mock-auth-token";

    beforeEach(() => {
        vi.resetAllMocks();
        process.env = { ...originalEnv };
        process.env.NEXT_PUBLIC_API_URL = "https://api.exemplo.com";
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it("deve retornar sucesso quando o nome for atualizado", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
        axiosPutMock.mockResolvedValueOnce({});

        const result = await atualizarNomeAction(dados);

        expect(axiosPutMock).toHaveBeenCalledWith(
            "https://api.exemplo.com/users/atualizar-dados",
            dados,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
            }
        );
        expect(result).toEqual({ success: true });
    });

    it("deve retornar erro se o token de autenticação não for encontrado", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        const result = await atualizarNomeAction(dados);

        expect(axiosPutMock).not.toHaveBeenCalled();
        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        });
    });

    it("deve retornar erro 401 para sessão expirada", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
        axiosPutMock.mockRejectedValueOnce({
            response: { status: 401 },
        });

        const result = await atualizarNomeAction(dados);

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
        axiosPutMock.mockRejectedValueOnce({
            response: { status: 500 },
        });

        const result = await atualizarNomeAction(dados);

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor. Tente novamente mais tarde.",
            field: undefined,
        });
    });

    it("deve retornar erro com a mensagem de 'detail' da API", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
        axiosPutMock.mockRejectedValueOnce({
            response: { data: { detail: "Nome inválido" } },
        });

        const result = await atualizarNomeAction(dados);

        expect(result).toEqual({
            success: false,
            error: "Nome inválido",
            field: undefined,
        });
    });

    it("deve retornar erro com a mensagem genérica do axios", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
        axiosPutMock.mockRejectedValueOnce({
            message: "Erro de rede",
        });

        const result = await atualizarNomeAction(dados);

        expect(result).toEqual({
            success: false,
            error: "Erro de rede",
            field: undefined,
        });
    });

    it("deve retornar o campo de erro quando a API o envia", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
        axiosPutMock.mockRejectedValueOnce({
            response: {
                data: {
                    detail: "Nome já existe",
                    field: "nome",
                },
            },
        });

        const result = await atualizarNomeAction(dados);

        expect(result).toEqual({
            success: false,
            error: "Nome já existe",
            field: "nome",
        });
    });
});
