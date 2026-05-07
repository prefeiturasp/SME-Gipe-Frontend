import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { cookies } from "next/headers";
import { describe, expect, it, vi, type Mock } from "vitest";
import { getCategoriasDisponiveisGipeAction } from "./categorias-disponiveis-gipe";

vi.mock("@/lib/axios-intercorrencias", () => ({ default: { get: vi.fn() } }));
vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

const cookiesMock = cookies as Mock;

describe("getCategoriasDisponiveisGipeAction", () => {
    it("deve retornar sucesso com as categorias do GIPE quando a requisição for bem-sucedida", async () => {
        const mockData = {
            envolve_arma_ou_ataque: [
                { value: "sim", label: "Sim" },
                { value: "nao", label: "Não" },
            ],
            ameaca_foi_realizada_de_qual_maneira: [
                { value: "presencialmente", label: "Presencialmente" },
                { value: "virtualmente", label: "Virtualmente" },
            ],
            motivo_ocorrencia: [
                { value: "bullying", label: "Bullying" },
                { value: "cyberbullying", label: "Cyberbullying" },
            ],
            etapa_escolar: [
                {
                    value: "alfabetizacao",
                    label: "Alfabetização (1º ao 3º ano)",
                },
                {
                    value: "interdisciplinar",
                    label: "Interdisciplinar (4º ao 6º ano)",
                },
            ],
        };

        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "mock-token-123" }),
        });

        vi.mocked(apiIntercorrencias.get).mockResolvedValueOnce({
            data: mockData,
        });

        const result = await getCategoriasDisponiveisGipeAction();

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toEqual(mockData);
        }
        expect(apiIntercorrencias.get).toHaveBeenCalledWith(
            "gipe/categorias-disponiveis/",
            {
                headers: {
                    Authorization: "Bearer mock-token-123",
                },
            },
        );
    });

    it("deve retornar erro quando não houver token de autenticação", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        const result = await getCategoriasDisponiveisGipeAction();

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toBe(
                "Usuário não autenticado. Token não encontrado.",
            );
        }
    });

    it("deve retornar erro quando a requisição falhar com status 401", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "mock-token-123" }),
        });

        vi.mocked(apiIntercorrencias.get).mockRejectedValueOnce({
            response: { status: 401 },
        });

        const result = await getCategoriasDisponiveisGipeAction();

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toBe("Não autorizado. Faça login novamente.");
        }
    });

    it("deve retornar erro quando a requisição falhar com status 400", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "mock-token-123" }),
        });

        vi.mocked(apiIntercorrencias.get).mockRejectedValueOnce({
            response: { status: 400 },
        });

        const result = await getCategoriasDisponiveisGipeAction();

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toBe("Erro ao buscar as categorias do GIPE");
        }
    });

    it("deve retornar erro quando a requisição falhar com status 500", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "mock-token-123" }),
        });

        vi.mocked(apiIntercorrencias.get).mockRejectedValueOnce({
            response: { status: 500 },
        });

        const result = await getCategoriasDisponiveisGipeAction();

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toBe("Erro interno no servidor");
        }
    });

    it("deve retornar mensagem de erro customizada quando fornecida pela API", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "mock-token-123" }),
        });

        vi.mocked(apiIntercorrencias.get).mockRejectedValueOnce({
            response: { data: { detail: "Erro customizado da API" } },
        });

        const result = await getCategoriasDisponiveisGipeAction();

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toBe("Erro customizado da API");
        }
    });

    it("deve retornar error.message quando não houver response", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "mock-token-123" }),
        });

        vi.mocked(apiIntercorrencias.get).mockRejectedValueOnce({
            message: "Network Error",
        });

        const result = await getCategoriasDisponiveisGipeAction();

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toBe("Network Error");
        }
    });
});
