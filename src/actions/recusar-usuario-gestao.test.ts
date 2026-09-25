import api from "@/lib/axios";
import type { AxiosResponse } from "axios";
import { AxiosError, AxiosRequestHeaders } from "axios";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { recusarUsuarioGestao } from "./recusar-usuario-gestao";

vi.mock("@/lib/axios", () => ({ default: { post: vi.fn() } }));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));

const apiPostMock = vi.mocked(api.post);
const cookiesMock = cookies as Mock;

describe("recusarUsuarioGestao action", () => {
    const uuid = "user-uuid-123";
    const mockToken = "token-abc";
    const justificativa = "Motivo de recusa";

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("deve recusar o usuário com sucesso", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        });
        apiPostMock.mockResolvedValueOnce({} as never);

        const result = await recusarUsuarioGestao(uuid, justificativa);

        expect(apiPostMock).toHaveBeenCalledWith(
            `/users/gestao-usuarios/${uuid}/reprovar/`,
            { justificativa },
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
        const result = await recusarUsuarioGestao(uuid, justificativa);
        expect(apiPostMock).not.toHaveBeenCalled();
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
        apiPostMock.mockRejectedValueOnce(error as never);

        const result = await recusarUsuarioGestao(uuid, justificativa);

        expect(result).toEqual({ success: false, error: "Mensagem da API" });
    });

    it("deve retornar mensagem de erro padrão", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        });
        apiPostMock.mockRejectedValueOnce({ message: "Falha geral" } as never);

        const result = await recusarUsuarioGestao(uuid, justificativa);

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
        } as never;
        vi.mocked(apiPostMock).mockRejectedValue(error as never);

        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        });

        const result = await recusarUsuarioGestao(uuid, justificativa);

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor",
        });
    });
});
