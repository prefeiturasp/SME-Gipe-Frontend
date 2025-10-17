import { vi, describe, it, expect, beforeEach, type Mock } from "vitest";
import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { obterOcorrencia } from "./obter-ocorrencia";
import { cookies } from "next/headers";

vi.mock("@/lib/axios-intercorrencias");
vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

describe("obterOcorrencia", () => {
    const mockApiGet = apiIntercorrencias.get as Mock;
    const mockCookies = cookies as Mock;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve lançar erro se o token não existir", async () => {
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        await expect(obterOcorrencia("abc-123")).rejects.toThrow(
            "Usuário não autenticado"
        );
    });

    it("deve chamar a API com o UUID correto e o token de autenticação", async () => {
        const mockData = {
            id: 1,
            data_ocorrencia: "2024-01-15",
            unidade_codigo_eol: "123456",
            tiposOcorrencia: ["Violência física"],
            descricao: "Descrição da ocorrência",
            status: "Em andamento",
        };
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });
        mockApiGet.mockResolvedValue({ data: mockData });

        const uuid = "abc-123-def-456";
        await obterOcorrencia(uuid);

        expect(mockApiGet).toHaveBeenCalledWith(`/intercorrencias/${uuid}/`, {
            headers: {
                Authorization: "Bearer fake-token",
            },
        });
    });

    it("deve retornar os dados da ocorrência com sucesso", async () => {
        const mockData = {
            id: 1,
            data_ocorrencia: "2024-01-15",
            unidade_codigo_eol: "123456",
            tiposOcorrencia: ["Violência física"],
            descricao: "Descrição da ocorrência",
            status: "Em andamento",
        };
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });
        mockApiGet.mockResolvedValue({ data: mockData });

        const result = await obterOcorrencia("abc-123-def-456");

        expect(result).toEqual(mockData);
    });

    it("deve retornar os dados da ocorrência mesmo sem campos opcionais", async () => {
        const mockData = {
            id: 2,
            data_ocorrencia: "2024-02-20",
            unidade_codigo_eol: "654321",
            status: "Incompleta",
        };
        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });
        mockApiGet.mockResolvedValue({ data: mockData });

        const result = await obterOcorrencia("xyz-789-uvw-012");

        expect(result).toEqual(mockData);
    });

    it("deve propagar erro quando a API falhar", async () => {
        const { AxiosError, AxiosHeaders } = await import("axios");

        mockCookies.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "fake-token" }),
        });

        const axiosError = new AxiosError("Erro ao buscar ocorrência");
        axiosError.response = {
            status: 404,
            data: { detail: "Ocorrência não encontrada" },
            statusText: "Not Found",
            headers: {},
            config: { headers: new AxiosHeaders() },
        };
        mockApiGet.mockRejectedValue(axiosError);

        await expect(obterOcorrencia("uuid-inexistente")).rejects.toThrow(
            "Erro ao buscar ocorrência"
        );
    });
});
