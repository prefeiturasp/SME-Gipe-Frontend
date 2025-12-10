import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { cookies } from "next/headers";
import axios, { AxiosError, AxiosRequestHeaders } from "axios";

import {
    cadastroGestaoUsuarioAction,
    type CadastroGestaoUsuarioRequest,
} from "./cadastro-gestao-usuario";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("axios");

const cookiesMock = cookies as Mock;
const axiosPostMock = axios.post as Mock;

describe("cadastroGestaoUsuarioAction", () => {
    const mockAuthToken = "test-token-123";
    const dadosCadastro: CadastroGestaoUsuarioRequest = {
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

    it("deve cadastrar usuário com sucesso", async () => {
        axiosPostMock.mockResolvedValue({});

        const result = await cadastroGestaoUsuarioAction(dadosCadastro);

        expect(result).toEqual({ success: true });

        expect(cookies().get).toHaveBeenCalledWith("auth_token");
        expect(axiosPostMock).toHaveBeenCalledWith(
            "https://api.exemplo.com/users/gestao-usuarios/",
            dadosCadastro,
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

        const result = await cadastroGestaoUsuarioAction(dadosCadastro);

        expect(result).toEqual({
            success: false,
            error: "Token de autenticação não encontrado",
        });

        expect(axiosPostMock).not.toHaveBeenCalled();
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

        axiosPostMock.mockRejectedValue(error);

        const result = await cadastroGestaoUsuarioAction(dadosCadastro);

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

        axiosPostMock.mockRejectedValue(error);

        const result = await cadastroGestaoUsuarioAction(dadosCadastro);

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

        axiosPostMock.mockRejectedValue(error);

        const result = await cadastroGestaoUsuarioAction(dadosCadastro);

        expect(result).toEqual({
            success: false,
            error: detailMessage,
            field: "email",
        });
    });

    it("deve retornar mensagem do próprio erro (error.message)", async () => {
        const errorMessage = "Network Error";

        const error = new Error(errorMessage);

        axiosPostMock.mockRejectedValue(error);

        const result = await cadastroGestaoUsuarioAction(dadosCadastro);

        expect(result).toEqual({
            success: false,
            error: errorMessage,
            field: undefined,
        });
    });

    it("deve retornar mensagem padrão caso nenhuma outra regra se aplique", async () => {
        const error = new AxiosError();

        axiosPostMock.mockRejectedValue(error);

        const result = await cadastroGestaoUsuarioAction(dadosCadastro);

        expect(result).toEqual({
            success: false,
            error: "Erro ao cadastrar usuário",
            field: undefined,
        });
    });

    it("deve cadastrar usuário GIPE sem CPF", async () => {
        const dadosGIPE: CadastroGestaoUsuarioRequest = {
            username: "joao.silva",
            name: "João Silva GIPE",
            email: "joao.gipe@exemplo.com",
            cargo: 2,
            rede: "DIRETA",
            unidades: ["dre-1"],
            is_app_admin: false,
        };

        axiosPostMock.mockResolvedValue({});

        const result = await cadastroGestaoUsuarioAction(dadosGIPE);

        expect(result).toEqual({ success: true });
        expect(axiosPostMock).toHaveBeenCalledWith(
            "https://api.exemplo.com/users/gestao-usuarios/",
            dadosGIPE,
            expect.any(Object)
        );
    });

    it("deve cadastrar usuário administrador", async () => {
        const dadosAdmin: CadastroGestaoUsuarioRequest = {
            username: "admin.user",
            name: "Admin User",
            email: "admin@exemplo.com",
            cargo: 2,
            rede: "DIRETA",
            unidades: [],
            is_app_admin: true,
        };

        axiosPostMock.mockResolvedValue({});

        const result = await cadastroGestaoUsuarioAction(dadosAdmin);

        expect(result).toEqual({ success: true });
        expect(axiosPostMock).toHaveBeenCalledWith(
            "https://api.exemplo.com/users/gestao-usuarios/",
            dadosAdmin,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
                withCredentials: true,
            }
        );
    });

    it("deve cadastrar usuário de rede INDIRETA", async () => {
        const dadosIndireta: CadastroGestaoUsuarioRequest = {
            username: "maria.santos",
            name: "Maria Santos",
            email: "maria@exemplo.com",
            cpf: "98765432100",
            cargo: 3,
            rede: "INDIRETA",
            unidades: ["dre-2", "ue-5"],
            is_app_admin: false,
        };

        axiosPostMock.mockResolvedValue({});

        const result = await cadastroGestaoUsuarioAction(dadosIndireta);

        expect(result).toEqual({ success: true });
        expect(axiosPostMock).toHaveBeenCalledWith(
            "https://api.exemplo.com/users/gestao-usuarios/",
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
