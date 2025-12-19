import axios from "axios";
import { cookies } from "next/headers";

import { getUnidades } from "./gestao-de-unidades";

vi.mock("axios");
vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

const mockedAxios = vi.mocked(axios, true);
const mockedCookies = vi.mocked(cookies);

describe("getUnidades", () => {
    const API_URL = "https://example.com/api";

    beforeEach(() => {
        mockedAxios.get.mockReset();
        mockedCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "token-123" }),
        } as unknown as ReturnType<typeof cookies>);
        process.env.NEXT_PUBLIC_API_URL = API_URL;
    });

    it("deve buscar unidades com os parâmetros corretos quando o token existe", async () => {
        mockedAxios.get.mockResolvedValue({ data: { success: true } });

        const response = await getUnidades(true);

        expect(response).toEqual({ success: true });

        expect(mockedAxios.get).toHaveBeenCalledWith(
            `${API_URL}/unidades/gestao-unidades/`,
            expect.objectContaining({
                params: { ativa: true },
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

        const response = await getUnidades();

        expect(response).toEqual({
            success: false,
            error: "Token de autenticação não encontrado",
        });
        expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it("deve lançar erro quando a requisição falha", async () => {
        mockedAxios.get.mockRejectedValue(new Error("Network Error"));

        await expect(getUnidades()).rejects.toThrow(
            "Não foi possível buscar as unidades"
        );

        expect(mockedAxios.get).toHaveBeenCalledWith(
            `${API_URL}/unidades/gestao-unidades/`,
            expect.objectContaining({
                params: { ativa: undefined },
                headers: {
                    Authorization: "Bearer token-123",
                },
            })
        );
    });
});



