import api from "@/lib/axios";
import type { AxiosResponse } from "axios";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import {
    afterAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
    type Mock,
} from "vitest";
import { consultarRfUsuarioAction } from "./consultar-rf-usuario";

vi.mock("@/lib/axios");
vi.mock("next/headers", () => ({ cookies: vi.fn() }));

const apiGetMock = api.get as Mock;
const cookiesMock = cookies as Mock;

describe("consultarRfUsuarioAction", () => {
    const originalEnv = process.env;
    const mockToken = "token-abc";
    const rf = "1234567";
    const mockResponse = {
        cpf: "12345678900",
        nome: "João Silva",
        codigoRf: "1234567",
        email: "joao.silva@exemplo.com",
        dreCodigo: "DRE-001",
        emailValido: true,
    };

    beforeEach(() => {
        vi.resetAllMocks();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it("deve retornar sucesso quando o RF for consultado com sucesso", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        });
        apiGetMock.mockResolvedValueOnce({ data: mockResponse });

        const result = await consultarRfUsuarioAction(rf);

        expect(apiGetMock).toHaveBeenCalledWith(
            "/users/gestao-usuarios/consultar-core-sso/",
            {
                params: { rf },
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                },
            },
        );
        expect(result).toEqual({ success: true, data: mockResponse });
    });

    it("deve retornar erro se o token de autenticação não for encontrado", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        const result = await consultarRfUsuarioAction(rf);

        expect(apiGetMock).not.toHaveBeenCalled();
        expect(result).toEqual({
            success: false,
            error: "Token de autenticação não encontrado",
        });
    });

    it("deve retornar erro 401 quando não autorizado", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        });
        const error = new AxiosError("Não autorizado");
        error.response = {
            status: 401,
        } as AxiosResponse;
        apiGetMock.mockRejectedValueOnce(error);

        const result = await consultarRfUsuarioAction(rf);

        expect(result).toEqual({
            success: false,
            error: "Não autorizado. Faça login novamente.",
        });
    });

    it("deve retornar erro com detail da API", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        });
        const error = new AxiosError("Erro da API");
        error.response = {
            data: { detail: "RF não encontrado" },
        } as unknown as AxiosResponse;
        apiGetMock.mockRejectedValueOnce(error);

        const result = await consultarRfUsuarioAction(rf);

        expect(result).toEqual({ success: false, error: "RF não encontrado" });
    });

    it("deve retornar erro com detail da API quando status não for tratado especificamente", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        });
        const error = new AxiosError("Erro da API");
        error.response = {
            data: { detail: "Erro ao processar requisição" },
        } as unknown as AxiosResponse;
        apiGetMock.mockRejectedValueOnce(error);

        const result = await consultarRfUsuarioAction(rf);

        expect(result).toEqual({
            success: false,
            error: "Erro ao processar requisição",
        });
    });

    it("deve retornar erro.message quando não for AxiosError", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        });
        apiGetMock.mockRejectedValueOnce(new Error("Erro genérico"));

        const result = await consultarRfUsuarioAction(rf);

        expect(result).toEqual({
            success: false,
            error: "Erro genérico",
        });
    });

    it("deve retornar erro genérico quando AxiosError sem response", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        });
        const error = new AxiosError("Erro sem response");
        apiGetMock.mockRejectedValueOnce(error);

        const result = await consultarRfUsuarioAction(rf);

        expect(result).toEqual({
            success: false,
            error: "Erro sem response",
        });
    });

    it("deve retornar erro 400 quando RF não for encontrado", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        });
        const error = new AxiosError("Bad Request");
        error.response = {
            status: 400,
        } as AxiosResponse;
        apiGetMock.mockRejectedValueOnce(error);

        const result = await consultarRfUsuarioAction(rf);

        expect(result).toEqual({ success: false, error: "RF não encontrado" });
    });

    it("deve retornar erro 500 quando houver erro no servidor", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        });
        const error = new AxiosError("Internal Server Error");
        error.response = {
            status: 500,
        } as AxiosResponse;
        apiGetMock.mockRejectedValueOnce(error);

        const result = await consultarRfUsuarioAction(rf);

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor",
        });
    });
});
