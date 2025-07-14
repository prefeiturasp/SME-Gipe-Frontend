import {
    describe,
    it,
    expect,
    beforeEach,
    vi,
    afterAll,
    type Mock,
} from "vitest";
import { loginAction } from "@/actions/login";
import axios from "axios";
import { AxiosError, type AxiosResponse } from "axios";
import { cookies } from "next/headers";

vi.mock("axios");
vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

const axiosPostMock = axios.post as Mock;
const cookiesMock = cookies as Mock;

describe("loginAction", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.resetAllMocks();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it("retorna dados do usuário e seta o cookie com sucesso", async () => {
        process.env.NEXT_PUBLIC_API_URL = "https://api.exemplo.com";

        const fakeUser = {
            name: "Fulano",
            email: "f@x.com",
            cargo: { nome: "Dev" },
            token: "jwt_token_top",
        };

        const setMock = vi.fn();
        cookiesMock.mockReturnValue({ set: setMock });

        axiosPostMock.mockResolvedValueOnce({ data: fakeUser });

        const result = await loginAction({
            username: "fulano",
            password: "1234",
        });

        expect(axiosPostMock).toHaveBeenCalledWith(
            "https://api.exemplo.com/users/login",
            { username: "fulano", password: "1234" },
            { withCredentials: true }
        );

        expect(setMock).toHaveBeenCalledWith("auth_token", "jwt_token_top", {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "lax",
        });

        expect(result).toEqual(fakeUser);
    });

    it("lança erro com a mensagem do servidor se a requisição falhar", async () => {
        process.env.NEXT_PUBLIC_API_URL = "https://api.exemplo.com";

        const axiosError = new AxiosError("Request failed");
        axiosError.response = {
            status: 401,
            data: {
                detail: "Credenciais inválidas",
            },
            headers: {},
            config: {},
            statusText: "",
        } as AxiosResponse;

        axiosPostMock.mockRejectedValueOnce(axiosError);

        await expect(
            loginAction({
                username: "fulano",
                password: "errado",
            })
        ).rejects.toThrow("Credenciais inválidas");
    });

    it("lança erro genérico se não houver mensagem de erro no response", async () => {
        process.env.NEXT_PUBLIC_API_URL = "https://api.exemplo.com";

        const axiosError = new AxiosError("Erro desconhecido");
        axiosPostMock.mockRejectedValueOnce(axiosError);

        await expect(
            loginAction({ username: "foo", password: "bar" })
        ).rejects.toThrow("Erro na autenticação");
    });

    it("lança erro específico se status for 500", async () => {
        process.env.NEXT_PUBLIC_API_URL = "https://api.exemplo.com";

        const axiosError = new AxiosError("Internal Server Error");
        axiosError.response = {
            status: 500,
            data: {},
            headers: {},
            config: {},
            statusText: "Internal Server Error",
        } as AxiosResponse;

        axiosPostMock.mockRejectedValueOnce(axiosError);

        await expect(
            loginAction({ username: "erro", password: "500" })
        ).rejects.toThrow("Erro interno no servidor");
    });
    it("lança erro com a mensagem genérica do próprio erro", async () => {
        process.env.NEXT_PUBLIC_API_URL = "https://api.exemplo.com";

        const axiosError = new AxiosError("Mensagem genérica");
        axiosError.message = "Mensagem genérica";
        axiosError.response = {
            status: 418,
            data: {},
            headers: {},
            config: {},
            statusText: "I'm a teapot",
        } as AxiosResponse;

        axiosPostMock.mockRejectedValueOnce(axiosError);

        await expect(
            loginAction({ username: "genérico", password: "123" })
        ).rejects.toThrow("Mensagem genérica");
    });
});
