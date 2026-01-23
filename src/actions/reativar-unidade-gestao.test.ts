import type { AxiosResponse } from "axios";
import axios, { AxiosError, AxiosRequestHeaders } from "axios";
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
import { reativarUnidadeGestaoAction } from "./reativar-unidade-gestao";

vi.mock("axios");
vi.mock("next/headers", () => ({ cookies: vi.fn() }));

const axiosPostMock = axios.post as Mock;
const cookiesMock = cookies as Mock;

describe("reativarUnidadeGestaoAction", () => {
    const originalEnv = process.env;
    const uuid = "unidade-uuid-123";
    const mockToken = "token-abc";
    const API_URL = "https://api.exemplo.com";

    beforeEach(() => {
        vi.resetAllMocks();
        process.env = { ...originalEnv, NEXT_PUBLIC_API_URL: API_URL };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it("deve reativar a unidade com sucesso", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        });
        axiosPostMock.mockResolvedValueOnce({});

        const result = await reativarUnidadeGestaoAction(
            uuid,
            "Motivo de reativação de teste",
        );

        expect(axiosPostMock).toHaveBeenCalledWith(
            `${API_URL}/unidades/gestao-unidades/${uuid}/reativar/`,
            { motivo_reativacao: "Motivo de reativação de teste" },
            {
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                },
            },
        );
        expect(result).toEqual({ success: true });
    });

    it("deve retornar erro se o token de autenticação não for encontrado", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });
        const result = await reativarUnidadeGestaoAction(
            uuid,
            "Motivo de reativação de teste",
        );
        expect(axiosPostMock).not.toHaveBeenCalled();
        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        });
    });

    it("deve retornar mensagem de erro da API", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        });
        const error = new AxiosError("Erro customizado");
        error.response = {
            data: { detail: "Mensagem da API" },
        } as unknown as AxiosResponse<unknown>;
        axiosPostMock.mockRejectedValueOnce(error);

        const result = await reativarUnidadeGestaoAction(
            uuid,
            "Motivo de reativação de teste",
        );

        expect(result).toEqual({ success: false, error: "Mensagem da API" });
    });

    it("deve retornar mensagem de erro padrão", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        });
        axiosPostMock.mockRejectedValueOnce({ message: "Falha geral" });

        const result = await reativarUnidadeGestaoAction(
            uuid,
            "Motivo de reativação de teste",
        );

        expect(result).toEqual({ success: false, error: "Falha geral" });
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
        vi.mocked(axiosPostMock).mockRejectedValue(error);

        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        });

        const result = await reativarUnidadeGestaoAction(
            uuid,
            "Motivo de reativação de teste",
        );

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor",
        });
    });
});
