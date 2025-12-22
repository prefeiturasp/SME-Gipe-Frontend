import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { cookies } from "next/headers";
import axios, { AxiosError, AxiosRequestHeaders } from "axios";

import {
    atualizarGestaoUsuarioAction,
    type AtualizarGestaoUsuarioRequest,
} from "./atualizar-gestao-usuario";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("axios");

const cookiesMock = cookies as Mock;
const axiosPutMock = axios.put as Mock;

describe("atualizarGestaoUsuarioAction", () => {
    const mockAuthToken = "test-token-123";
    const usuarioUuid = "dde1bea9-1e91-4217-b1dc-656abb3d69b4";
    const dadosAtualizacao: AtualizarGestaoUsuarioRequest = {
        username: "123456",
        name: "João Silva",
        email: "joao@exemplo.com",
        cpf: "12345678901",
        cargo: 1,
        rede: "DIRETA",
        unidades: ["dre-1", "ue-1"],
        is_app_admin: false,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        process.env.NEXT_PUBLIC_API_URL = "https://api.exemplo.com";

        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
    });

    it("deve atualizar usuário com sucesso", async () => {
        axiosPutMock.mockResolvedValue({});

        const result = await atualizarGestaoUsuarioAction(
            usuarioUuid,
            dadosAtualizacao
        );

        expect(result).toEqual({ success: true });

        expect(cookies().get).toHaveBeenCalledWith("auth_token");
        expect(axiosPutMock).toHaveBeenCalledWith(
            `https://api.exemplo.com/users/gestao-usuarios/${usuarioUuid}/`,
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

        const result = await atualizarGestaoUsuarioAction(
            usuarioUuid,
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

        const result = await atualizarGestaoUsuarioAction(
            usuarioUuid,
            dadosAtualizacao
        );

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor",
            field: undefined,
        });
    });

    it("deve retornar mensagem detail da API se existir", async () => {
        const detailMessage = "Email já cadastrado";

        const error = new AxiosError("Request failed");
        error.response = {
            status: 400,
            data: { detail: detailMessage },
            statusText: "Bad request",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };

        axiosPutMock.mockRejectedValue(error);

        const result = await atualizarGestaoUsuarioAction(
            usuarioUuid,
            dadosAtualizacao
        );

        expect(result).toEqual({
            success: false,
            error: detailMessage,
            field: undefined,
        });
    });

    it("deve retornar erro com field específico", async () => {
        const detailMessage = "Email já cadastrado";

        const error = new AxiosError("Request failed");
        error.response = {
            status: 400,
            data: { detail: detailMessage, field: "email" },
            statusText: "Bad request",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };

        axiosPutMock.mockRejectedValue(error);

        const result = await atualizarGestaoUsuarioAction(
            usuarioUuid,
            dadosAtualizacao
        );

        expect(result).toEqual({
            success: false,
            error: detailMessage,
            field: "email",
        });
    });

    it("deve retornar mensagem do próprio erro (error.message)", async () => {
        const errorMessage = "Network Error";

        const error = new Error(errorMessage);

        axiosPutMock.mockRejectedValue(error);

        const result = await atualizarGestaoUsuarioAction(
            usuarioUuid,
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

        const result = await atualizarGestaoUsuarioAction(
            usuarioUuid,
            dadosAtualizacao
        );

        expect(result).toEqual({
            success: false,
            error: "Erro ao atualizar usuário",
            field: undefined,
        });
    });

    it("deve atualizar usuário GIPE sem CPF", async () => {
        const dadosGIPE: AtualizarGestaoUsuarioRequest = {
            username: "joao.silva",
            name: "João Silva GIPE",
            email: "joao.gipe@exemplo.com",
            cargo: 2,
            rede: "DIRETA",
            unidades: ["dre-1"],
            is_app_admin: false,
        };

        axiosPutMock.mockResolvedValue({});

        const result = await atualizarGestaoUsuarioAction(
            usuarioUuid,
            dadosGIPE
        );

        expect(result).toEqual({ success: true });
        expect(axiosPutMock).toHaveBeenCalledWith(
            `https://api.exemplo.com/users/gestao-usuarios/${usuarioUuid}/`,
            dadosGIPE,
            expect.any(Object)
        );
    });

    it("deve atualizar usuário administrador", async () => {
        const dadosAdmin: AtualizarGestaoUsuarioRequest = {
            username: "admin.user",
            name: "Admin User",
            email: "admin@exemplo.com",
            cargo: 2,
            rede: "DIRETA",
            unidades: [],
            is_app_admin: true,
        };

        axiosPutMock.mockResolvedValue({});

        const result = await atualizarGestaoUsuarioAction(
            usuarioUuid,
            dadosAdmin
        );

        expect(result).toEqual({ success: true });
        expect(axiosPutMock).toHaveBeenCalledWith(
            `https://api.exemplo.com/users/gestao-usuarios/${usuarioUuid}/`,
            dadosAdmin,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
                withCredentials: true,
            }
        );
    });

    it("deve atualizar usuário de rede INDIRETA", async () => {
        const dadosIndireta: AtualizarGestaoUsuarioRequest = {
            username: "maria.santos",
            name: "Maria Santos",
            email: "maria@exemplo.com",
            cpf: "98765432100",
            cargo: 3,
            rede: "INDIRETA",
            unidades: ["dre-2", "ue-5"],
            is_app_admin: false,
        };

        axiosPutMock.mockResolvedValue({});

        const result = await atualizarGestaoUsuarioAction(
            usuarioUuid,
            dadosIndireta
        );

        expect(result).toEqual({ success: true });
        expect(axiosPutMock).toHaveBeenCalledWith(
            `https://api.exemplo.com/users/gestao-usuarios/${usuarioUuid}/`,
            dadosIndireta,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
                withCredentials: true,
            }
        );
    });
});
