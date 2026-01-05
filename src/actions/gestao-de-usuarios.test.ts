import axios from "axios";
import { cookies } from "next/headers";

import { getUsuarios } from "./gestao-de-usuarios";

vi.mock("axios");
vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

const mockedAxios = vi.mocked(axios, true);
const mockedCookies = vi.mocked(cookies);

describe("getUsuarios", () => {
    const API_URL = "https://example.com/api";

    beforeEach(() => {
        mockedAxios.get.mockReset();
        mockedCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "token-123" }),
        } as unknown as ReturnType<typeof cookies>);
        process.env.NEXT_PUBLIC_API_URL = API_URL;
    });

    it("deve buscar usuários com os parâmetros corretos quando o token existe", async () => {
        mockedAxios.get.mockResolvedValue({ data: { success: true } });

        const response = await getUsuarios(true, "dre-uuid", "ue-uuid", false);

        expect(response).toEqual({ success: true });

        expect(mockedAxios.get).toHaveBeenCalledWith(
            `${API_URL}/users/gestao-usuarios/`,
            expect.objectContaining({
                params: {
                    ativo: true,
                    dre: "dre-uuid",
                    unidade: "ue-uuid",
                    pendente_aprovacao: false,
                },
                headers: {
                    Authorization: "Bearer token-123",
                },
            })
        );
    });

    it("deve retornar erro quando o token não existe", async () => {
        mockedCookies.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        } as unknown as ReturnType<typeof cookies>);

        const response = await getUsuarios();

        expect(response).toEqual({
            success: false,
            error: "Token de autenticação não encontrado",
        });
        expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it("deve lançar erro quando a requisição falhar", async () => {
        mockedAxios.get.mockRejectedValue(new Error("Network error"));

        await expect(getUsuarios()).rejects.toThrow(
            "Não foi possível buscar os usuários"
        );
    });
});
