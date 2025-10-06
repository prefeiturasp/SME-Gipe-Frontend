import {
    describe,
    it,
    expect,
    beforeEach,
    vi,
    afterAll,
    type Mock,
} from "vitest";
import { getMeAction } from "@/actions/me";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import { User } from "@/stores/useUserStore";

vi.mock("axios");
vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

const axiosGetMock = axios.get as Mock;
const cookiesMock = cookies as Mock;

describe("getMeAction", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.resetAllMocks();
        process.env = { ...originalEnv };
        process.env.NEXT_PUBLIC_API_URL = "https://api.exemplo.com";
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it("deve retornar os dados do usuário quando a requisição for bem-sucedida", async () => {
        const fakeUser: User = {
            username: "fulano.tal",
            name: "Fulano de Tal",
            email: "fulano@example.com",
            cpf: "123.456.789-00",
            rede: "SME",
            is_core_sso: true,
            is_validado: true,
            perfil_acesso: {
                codigo: 1,
                nome: "Admin",
            },
            unidades: [
                {
                    ue: {
                        codigo_eol: "123456",
                        nome: "ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL TESTE",
                        sigla: "EMEF TESTE",
                    },
                    dre: {
                        codigo_eol: "108100",
                        nome: "DIRETORIA REGIONAL DE EDUCACAO BUTANTA",
                        sigla: "DRE-BT",
                    },
                },
            ],
        };

        const getMock = vi.fn().mockReturnValue({ value: "fake-auth-token" });
        cookiesMock.mockReturnValue({ get: getMock });

        axiosGetMock.mockResolvedValueOnce({ data: fakeUser });

        const result = await getMeAction();

        expect(axiosGetMock).toHaveBeenCalledWith(
            "https://api.exemplo.com/users/me",
            {
                headers: {
                    Authorization: "Bearer fake-auth-token",
                },
            }
        );

        expect(result).toEqual({ success: true, data: fakeUser });
    });

    it("deve retornar erro se o token de autenticação não for encontrado", async () => {
        const getMock = vi.fn().mockReturnValue(undefined);
        cookiesMock.mockReturnValue({ get: getMock });

        const result = await getMeAction();

        expect(axiosGetMock).not.toHaveBeenCalled();
        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        });
    });

    it("deve retornar erro se a chamada à API falhar", async () => {
        const getMock = vi.fn().mockReturnValue({ value: "fake-auth-token" });
        cookiesMock.mockReturnValue({ get: getMock });

        const axiosError = new AxiosError("API Error");
        axiosGetMock.mockRejectedValueOnce(axiosError);

        const result = await getMeAction();

        expect(result).toEqual({
            success: false,
            error: "Erro ao buscar os dados do usuário",
        });
    });
});
