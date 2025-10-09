import { vi, describe, it, expect, beforeEach, type Mock } from "vitest";
import { cookies } from "next/headers";
import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { getOcorrenciasAction } from "./ocorrencias";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("@/lib/axios-intercorrencias");

describe("getOcorrenciasAction", () => {
    const mockCookies = cookies as Mock;
    const mockApiGet = apiIntercorrencias.get as Mock;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve retornar erro se o token não existir", async () => {
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        const result = await getOcorrenciasAction({});
        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado",
        });
    });

    it("deve chamar a API sem parâmetros para GIPE", async () => {
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });
        mockApiGet.mockResolvedValue({ data: [] });

        await getOcorrenciasAction({});

        expect(mockApiGet).toHaveBeenCalledWith("/intercorrencias/", {
            headers: { Authorization: "Bearer fake-token" },
        });
    });

    it("deve chamar a API com o parâmetro 'dre' para Ponto Focal", async () => {
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });
        mockApiGet.mockResolvedValue({ data: [] });

        await getOcorrenciasAction({ dre: "12345" });

        expect(mockApiGet).toHaveBeenCalledWith("/intercorrencias/?dre=12345", {
            headers: { Authorization: "Bearer fake-token" },
        });
    });

    it("deve chamar a API com o parâmetro 'usuario' para Diretor/Assistente", async () => {
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });
        mockApiGet.mockResolvedValue({ data: [] });

        await getOcorrenciasAction({ usuario: "user123" });

        expect(mockApiGet).toHaveBeenCalledWith(
            "/intercorrencias/?usuario=user123",
            {
                headers: { Authorization: "Bearer fake-token" },
            }
        );
    });

    it("deve retornar os dados com sucesso", async () => {
        const mockData = [{ id: 1, uuid: "abc" }];
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });
        mockApiGet.mockResolvedValue({ data: mockData });

        const result = await getOcorrenciasAction({});

        expect(result).toEqual({ success: true, data: mockData });
    });

    it("deve retornar erro em caso de falha na API", async () => {
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });
        mockApiGet.mockRejectedValue(new Error("API Error"));

        const result = await getOcorrenciasAction({});

        expect(result).toEqual({
            success: false,
            error: "API Error",
        });
    });
});
