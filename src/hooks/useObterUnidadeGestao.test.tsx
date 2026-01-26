import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useObterUnidadeGestao } from "./useObterUnidadeGestao";

const obterUnidadeGestaoMock = vi.fn();

vi.mock("@/actions/obter-unidade-gestao", () => ({
    obterUnidadeGestao: (...args: unknown[]) => obterUnidadeGestaoMock(...args),
}));

describe("useObterUnidadeGestao", () => {
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

    it("deve buscar dados da unidade com sucesso quando uuid é fornecido", async () => {
        const mockData = {
            uuid: "unidade-uuid-123",
            codigo_eol: "093319",
            nome: "EMEF ALMEIDA JUNIOR",
            tipo_unidade: "EMEF" as const,
            tipo_unidade_label: "EMEF",
            rede: "DIRETA" as const,
            rede_label: "Direta",
            dre_uuid: "1a2766dc-36c8-4bbb-a840-155013526b80",
            dre_nome: "DRE BUTANTÃ",
            sigla: "DRE-BT",
            ativa: true,
        };

        obterUnidadeGestaoMock.mockResolvedValue({
            success: true,
            data: mockData,
        });

        const { result } = renderHook(
            () =>
                useObterUnidadeGestao({
                    uuid: "unidade-uuid-123",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual(mockData);
        expect(obterUnidadeGestaoMock).toHaveBeenCalledWith("unidade-uuid-123");
    });

    it("deve lidar com erro quando obterUnidadeGestao retorna success: false", async () => {
        obterUnidadeGestaoMock.mockResolvedValue({
            success: false,
            error: "Unidade não encontrada",
        });

        const { result } = renderHook(
            () =>
                useObterUnidadeGestao({
                    uuid: "unidade-uuid-123",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toBe("Unidade não encontrada");
    });

    it("não deve fazer requisição quando uuid é vazio", async () => {
        const { result } = renderHook(
            () =>
                useObterUnidadeGestao({
                    uuid: "",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isFetching).toBe(false);
        });

        expect(result.current.data).toBeUndefined();
        expect(obterUnidadeGestaoMock).not.toHaveBeenCalled();
    });

    it("não deve fazer requisição quando enabled é false", async () => {
        const { result } = renderHook(
            () =>
                useObterUnidadeGestao({
                    uuid: "unidade-uuid-123",
                    enabled: false,
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isFetching).toBe(false);
        });

        expect(result.current.data).toBeUndefined();
        expect(obterUnidadeGestaoMock).not.toHaveBeenCalled();
    });

    it("deve usar cache e não fazer nova requisição se os dados estão frescos", async () => {
        const mockData = {
            uuid: "unidade-uuid-123",
            codigo_eol: "093319",
            nome: "EMEF ALMEIDA JUNIOR",
            tipo_unidade: "EMEF" as const,
            tipo_unidade_label: "EMEF",
            rede: "DIRETA" as const,
            rede_label: "Direta",
            dre_uuid: "1a2766dc-36c8-4bbb-a840-155013526b80",
            dre_nome: "DRE BUTANTÃ",
            sigla: "DRE-BT",
            ativa: true,
        };

        obterUnidadeGestaoMock.mockResolvedValue({
            success: true,
            data: mockData,
        });

        const { result: result1 } = renderHook(
            () =>
                useObterUnidadeGestao({
                    uuid: "unidade-uuid-123",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result1.current.isSuccess).toBe(true);
        });

        expect(obterUnidadeGestaoMock).toHaveBeenCalledTimes(1);

        const { result: result2 } = renderHook(
            () =>
                useObterUnidadeGestao({
                    uuid: "unidade-uuid-123",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result2.current.isSuccess).toBe(true);
        });

        expect(obterUnidadeGestaoMock).toHaveBeenCalledTimes(1);
        expect(result2.current.data).toEqual(mockData);
    });

    it("deve usar queryKey correta com uuid", async () => {
        const mockData = {
            uuid: "unidade-uuid-diferente",
            codigo_eol: "012345",
            nome: "CEI EXEMPLO",
            tipo_unidade: "CEI" as const,
            tipo_unidade_label: "CEI",
            rede: "INDIRETA" as const,
            rede_label: "Indireta",
            dre_uuid: "dre-uuid-2",
            dre_nome: "DRE CAMPO LIMPO",
            sigla: "DRE-CL",
            ativa: true,
        };

        obterUnidadeGestaoMock.mockResolvedValue({
            success: true,
            data: mockData,
        });

        const { result } = renderHook(
            () =>
                useObterUnidadeGestao({
                    uuid: "unidade-uuid-diferente",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(obterUnidadeGestaoMock).toHaveBeenCalledWith(
            "unidade-uuid-diferente"
        );
    });

    it("deve fazer nova requisição para uuid diferente", async () => {
        const mockData1 = {
            uuid: "unidade-uuid-1",
            codigo_eol: "093319",
            nome: "EMEF ALMEIDA JUNIOR",
            tipo_unidade: "EMEF" as const,
            tipo_unidade_label: "EMEF",
            rede: "DIRETA" as const,
            rede_label: "Direta",
            dre_uuid: "dre-uuid-1",
            dre_nome: "DRE BUTANTÃ",
            sigla: "DRE-BT",
            ativa: true,
        };

        const mockData2 = {
            uuid: "unidade-uuid-2",
            codigo_eol: "012345",
            nome: "CEI EXEMPLO",
            tipo_unidade: "CEI" as const,
            tipo_unidade_label: "CEI",
            rede: "INDIRETA" as const,
            rede_label: "Indireta",
            dre_uuid: "dre-uuid-2",
            dre_nome: "DRE CAMPO LIMPO",
            sigla: "DRE-CL",
            ativa: false,
        };

        obterUnidadeGestaoMock
            .mockResolvedValueOnce({
                success: true,
                data: mockData1,
            })
            .mockResolvedValueOnce({
                success: true,
                data: mockData2,
            });

        const { result: result1 } = renderHook(
            () =>
                useObterUnidadeGestao({
                    uuid: "unidade-uuid-1",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result1.current.isSuccess).toBe(true);
        });

        expect(result1.current.data).toEqual(mockData1);
        expect(obterUnidadeGestaoMock).toHaveBeenCalledWith("unidade-uuid-1");

        const { result: result2 } = renderHook(
            () =>
                useObterUnidadeGestao({
                    uuid: "unidade-uuid-2",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result2.current.isSuccess).toBe(true);
        });

        expect(result2.current.data).toEqual(mockData2);
        expect(obterUnidadeGestaoMock).toHaveBeenCalledWith("unidade-uuid-2");
        expect(obterUnidadeGestaoMock).toHaveBeenCalledTimes(2);
    });
});
