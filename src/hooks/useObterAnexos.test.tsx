import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useObterAnexos } from "./useObterAnexos";

const obterAnexosMock = vi.fn();

vi.mock("@/actions/obter-anexos", () => ({
    obterAnexos: (...args: unknown[]) => obterAnexosMock(...args),
}));

describe("useObterAnexos", () => {
    let queryClient: QueryClient;
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    beforeEach(() => {
        vi.clearAllMocks();
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
    });

    it("deve buscar anexos com sucesso quando intercorrenciaUuid é fornecido", async () => {
        const mockData = {
            count: 2,
            next: null,
            previous: null,
            results: [
                {
                    uuid: "anexo-uuid-1",
                    nome_original: "documento1.pdf",
                    categoria: "boletim_ocorrencia" as const,
                    categoria_display: "Boletim de ocorrência",
                    perfil: "diretor" as const,
                    perfil_display: "Diretor de Escola",
                    tamanho_formatado: "1.2 MB",
                    extensao: "pdf",
                    arquivo_url: "https://example.com/anexo1.pdf",
                    criado_em: "2025-11-17T10:00:00Z",
                    usuario_username: "diretor1",
                },
                {
                    uuid: "anexo-uuid-2",
                    nome_original: "documento2.pdf",
                    categoria: "relatorio_naapa" as const,
                    categoria_display: "Relatório do NAAPA",
                    perfil: "diretor" as const,
                    perfil_display: "Diretor de Escola",
                    tamanho_formatado: "800 KB",
                    extensao: "pdf",
                    arquivo_url: "https://example.com/anexo2.pdf",
                    criado_em: "2025-11-17T11:00:00Z",
                    usuario_username: "diretor1",
                },
            ],
        };

        obterAnexosMock.mockResolvedValue({
            success: true,
            data: mockData,
        });

        const { result } = renderHook(
            () =>
                useObterAnexos({
                    intercorrenciaUuid: "uuid-123",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual(mockData);
        expect(obterAnexosMock).toHaveBeenCalledWith({
            intercorrenciaUuid: "uuid-123",
        });
    });

    it("não deve fazer a requisição quando intercorrenciaUuid é null", async () => {
        const { result } = renderHook(
            () =>
                useObterAnexos({
                    intercorrenciaUuid: null,
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isFetching).toBe(false);
        });

        expect(obterAnexosMock).not.toHaveBeenCalled();
        expect(result.current.data).toBeUndefined();
    });

    it("deve lidar com erro quando obterAnexos retorna success: false", async () => {
        obterAnexosMock.mockResolvedValue({
            success: false,
            error: "Erro ao buscar anexos",
        });

        const { result } = renderHook(
            () =>
                useObterAnexos({
                    intercorrenciaUuid: "uuid-123",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toBe("Erro ao buscar anexos");
    });

    it("deve retornar lista vazia quando não há anexos", async () => {
        const mockData = {
            count: 0,
            next: null,
            previous: null,
            results: [],
        };

        obterAnexosMock.mockResolvedValue({
            success: true,
            data: mockData,
        });

        const { result } = renderHook(
            () =>
                useObterAnexos({
                    intercorrenciaUuid: "uuid-123",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data?.count).toBe(0);
        expect(result.current.data?.results).toEqual([]);
    });

    it("deve usar cache e não fazer nova requisição se os dados estão frescos", async () => {
        const mockData = {
            count: 1,
            next: null,
            previous: null,
            results: [
                {
                    uuid: "anexo-uuid-1",
                    nome_original: "documento1.pdf",
                    categoria: "boletim_ocorrencia" as const,
                    categoria_display: "Boletim de ocorrência",
                    perfil: "diretor" as const,
                    perfil_display: "Diretor de Escola",
                    tamanho_formatado: "1.2 MB",
                    extensao: "pdf",
                    arquivo_url: "https://example.com/anexo1.pdf",
                    criado_em: "2025-11-17T10:00:00Z",
                    usuario_username: "diretor1",
                },
            ],
        };

        obterAnexosMock.mockResolvedValue({
            success: true,
            data: mockData,
        });

        const { result: result1 } = renderHook(
            () =>
                useObterAnexos({
                    intercorrenciaUuid: "uuid-123",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result1.current.isSuccess).toBe(true);
        });

        expect(obterAnexosMock).toHaveBeenCalledTimes(1);

        const { result: result2 } = renderHook(
            () =>
                useObterAnexos({
                    intercorrenciaUuid: "uuid-123",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result2.current.isSuccess).toBe(true);
        });

        expect(obterAnexosMock).toHaveBeenCalledTimes(1);
        expect(result2.current.data).toEqual(mockData);
    });

    it("deve lançar erro quando intercorrenciaUuid é vazio mas enabled", async () => {
        obterAnexosMock.mockResolvedValue({
            success: false,
            error: "UUID da intercorrência não fornecido",
        });

        const { result } = renderHook(
            () =>
                useObterAnexos({
                    intercorrenciaUuid: "",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isFetching).toBe(false);
        });

        expect(result.current.data).toBeUndefined();
        expect(obterAnexosMock).not.toHaveBeenCalled();
    });

    it("deve usar queryKey correta com intercorrenciaUuid", async () => {
        const mockData = {
            count: 0,
            next: null,
            previous: null,
            results: [],
        };

        obterAnexosMock.mockResolvedValue({
            success: true,
            data: mockData,
        });

        const { result } = renderHook(
            () =>
                useObterAnexos({
                    intercorrenciaUuid: "uuid-diferente",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(obterAnexosMock).toHaveBeenCalledWith({
            intercorrenciaUuid: "uuid-diferente",
        });
    });
});
