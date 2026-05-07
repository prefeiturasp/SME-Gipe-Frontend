import api from "@/lib/axios";
import { AxiosError, AxiosRequestHeaders, type Mock } from "axios";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
    atualizarGestaoUsuarioAction,
    type AtualizarGestaoUsuarioRequest,
} from "./atualizar-gestao-usuario";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("@/lib/axios", () => ({ default: { put: vi.fn() } }));

const cookiesMock = cookies as Mock;
const apiPutMock = vi.mocked(api.put);

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

        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
    });

    it("deve atualizar usuário com sucesso", async () => {
        apiPutMock.mockResolvedValue({} as never);

        const result = await atualizarGestaoUsuarioAction(
            usuarioUuid,
            dadosAtualizacao,
        );

        expect(result).toEqual({ success: true });

        expect(cookies().get).toHaveBeenCalledWith("auth_token");
        expect(apiPutMock).toHaveBeenCalledWith(
            `/users/gestao-usuarios/${usuarioUuid}/`,
            dadosAtualizacao,
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

        const result = await atualizarGestaoUsuarioAction(
            usuarioUuid,
            dadosAtualizacao,
        );

        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        });

        expect(apiPutMock).not.toHaveBeenCalled();
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

        apiPutMock.mockRejectedValue(error as never);

        const result = await atualizarGestaoUsuarioAction(
            usuarioUuid,
            dadosAtualizacao,
        );

        expect(result).toEqual({
            success: false,
            error: "Não autorizado. Faça login novamente.",
            field: undefined,
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

        apiPutMock.mockRejectedValue(error as never);

        const result = await atualizarGestaoUsuarioAction(
            usuarioUuid,
            dadosAtualizacao,
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

        apiPutMock.mockRejectedValue(error as never);

        const result = await atualizarGestaoUsuarioAction(
            usuarioUuid,
            dadosAtualizacao,
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

        apiPutMock.mockRejectedValue(error as never);

        const result = await atualizarGestaoUsuarioAction(
            usuarioUuid,
            dadosAtualizacao,
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

        apiPutMock.mockRejectedValue(error as never);

        const result = await atualizarGestaoUsuarioAction(
            usuarioUuid,
            dadosAtualizacao,
        );

        expect(result).toEqual({
            success: false,
            error: errorMessage,
            field: undefined,
        });
    });

    it("deve retornar mensagem padrão caso nenhuma outra regra se aplique", async () => {
        const error = new AxiosError();

        apiPutMock.mockRejectedValue(error as never);

        const result = await atualizarGestaoUsuarioAction(
            usuarioUuid,
            dadosAtualizacao,
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

        apiPutMock.mockResolvedValue({} as never);

        const result = await atualizarGestaoUsuarioAction(
            usuarioUuid,
            dadosGIPE,
        );

        expect(result).toEqual({ success: true });
        expect(apiPutMock).toHaveBeenCalledWith(
            `/users/gestao-usuarios/${usuarioUuid}/`,
            dadosGIPE,
            expect.any(Object),
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

        apiPutMock.mockResolvedValue({} as never);

        const result = await atualizarGestaoUsuarioAction(
            usuarioUuid,
            dadosAdmin,
        );

        expect(result).toEqual({ success: true });
        expect(apiPutMock).toHaveBeenCalledWith(
            `/users/gestao-usuarios/${usuarioUuid}/`,
            dadosAdmin,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
            },
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

        apiPutMock.mockResolvedValue({} as never);

        const result = await atualizarGestaoUsuarioAction(
            usuarioUuid,
            dadosIndireta,
        );

        expect(result).toEqual({ success: true });
        expect(apiPutMock).toHaveBeenCalledWith(
            `/users/gestao-usuarios/${usuarioUuid}/`,
            dadosIndireta,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
            },
        );
    });
});
